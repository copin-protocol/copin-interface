import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getHlAccountInfo } from 'apis/hyperliquid'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useUsdPrices from 'hooks/store/useUsdPrices'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { NO_TX_HASH_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS, QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER, TOKEN_COLLATERAL_SUPPORT } from 'utils/config/trades'
import { TokenCollateral } from 'utils/types'
import { getNativeBalance } from 'utils/web3/balance'
import { CHAINS, DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

const useTraderBalances = ({ account, protocol }: { account: string | undefined; protocol: ProtocolEnum }) => {
  const isExcludedProtocol = NO_TX_HASH_PROTOCOLS.includes(protocol)
  const { prices } = useUsdPrices()
  const protocolProvider = PROTOCOL_PROVIDER[protocol]
  const isEVM = typeof protocolProvider?.chainId === 'number'

  const { data: hlAccountData } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_DETAIL, account],
    () => getHlAccountInfo({ user: account ?? '' }),
    {
      enabled: !!account && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
    }
  )
  const hlBalance = Number(hlAccountData?.marginSummary?.accountValue ?? 0)

  const { data: nativeBalanceData } = useQuery(
    [QUERY_KEYS.GET_TRADER_NATIVE_BALANCE],
    () =>
      getNativeBalance(
        rpcProvider(protocolProvider?.chainId && isEVM ? Number(protocolProvider?.chainId) : DEFAULT_CHAIN_ID),
        account ?? ''
      ),
    {
      enabled: !!account && !!protocolProvider?.chainId && isEVM && !isExcludedProtocol,
    }
  )

  const calls: { address: string; name: string; params: any[] }[] = []
  const tokens = useMemo(() => {
    if (!protocol || !TOKEN_COLLATERAL_SUPPORT[protocol]) return []
    const tokenArray = Object.values(TOKEN_COLLATERAL_SUPPORT[protocol])
    return Array.from(new Set(tokenArray.map((token) => token.address)))
      .map((address) => tokenArray.find((token) => token.address === address))
      .filter((token): token is TokenCollateral => token !== undefined)
  }, [protocol])
  if (account) {
    tokens.forEach((token) => {
      calls.push({
        address: token.address,
        name: 'balanceOf',
        params: [account],
      })
    })
  }

  const {
    data: tokenBalancesData,
    isLoading,
    refetch: reloadToken,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.ERC20],
    calls,
    Number(protocolProvider?.chainId),
    rpcProvider(protocolProvider?.chainId && isEVM ? Number(protocolProvider?.chainId) : DEFAULT_CHAIN_ID),
    account,
    {
      enabled: !!protocolProvider?.chainId && isEVM && !!account && tokens.length > 0 && !isExcludedProtocol,
      keepPreviousData: true,
      retry: 0,
    }
  )

  const { getListIndexTokenByListSymbols } = useMarketsConfig()

  const nativeBalance = useMemo(() => {
    if (!nativeBalanceData || !protocolProvider?.chainId) return 0
    const nativeSymbol = CHAINS[protocolProvider.chainId].token
    const price = prices[nativeSymbol] ?? 0
    const balance = Number(formatUnits(nativeBalanceData)) * price
    if (isNaN(balance)) return 0
    return balance
  }, [nativeBalanceData, prices])

  const tokenBalances = useMemo(() => {
    if (!tokenBalancesData?.length) return 0
    const balances = (tokenBalancesData as BigNumber[][]).reduce((result, balanceData, index) => {
      const collateralToken = tokens[index]
      if (!collateralToken) return result
      const collateralAmount = Number(formatUnits(balanceData?.[0] ?? BigNumber.from(0), collateralToken.decimals))
      if (collateralToken.isStableCoin) {
        return (result += collateralAmount)
      }
      const indexTokens = getListIndexTokenByListSymbols?.({ protocol, listSymbol: [collateralToken.symbol] })
      if (!indexTokens?.length) {
        return result
      }
      let collateralTokenPrice = 0
      for (const indexToken of indexTokens) {
        const price = prices[indexToken]
        if (typeof price === 'number') {
          collateralTokenPrice = price
          break
        }
      }
      return (result += collateralAmount * collateralTokenPrice)
    }, 0)
    return balances
  }, [tokenBalancesData, prices, getListIndexTokenByListSymbols])

  return { balance: tokenBalances + nativeBalance + hlBalance, isLoading, reloadToken }
}

export default useTraderBalances
