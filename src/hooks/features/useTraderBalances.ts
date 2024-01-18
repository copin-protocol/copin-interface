import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, formatUnits } from '@ethersproject/units'
import { useEffect, useMemo, useRef } from 'react'

import useUsdPrices from 'hooks/store/useUsdPrices'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { ProtocolEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER, TOKEN_ADDRESSES, TOKEN_COLLATERAL_SUPPORT } from 'utils/config/trades'
import { getNativeBalance } from 'utils/web3/balance'
import { CONTRACT_ABIS } from 'utils/web3/contracts'

interface TokenBalance {
  address: string
  decimals: number
  price: number
  amount: number
  amountBN: BigNumber
}

const useTraderBalances = ({ account, protocol }: { account?: string; protocol: ProtocolEnum }) => {
  const { prices } = useUsdPrices()
  const nativeRef = useRef<number>()
  const protocolProvider = PROTOCOL_PROVIDER[protocol]

  useEffect(() => {
    if (nativeRef.current || !protocol || !protocolProvider) return
    const ethPrice = prices[TOKEN_ADDRESSES[protocol].ETH]
    if (!account || !prices || !ethPrice) return
    getNativeBalance(protocolProvider.provider, account).then((value: BigNumber) => {
      nativeRef.current = Number(formatEther(value)) * ethPrice
    })
  }, [account, prices, protocol, protocolProvider])

  const calls: { address: string; name: string; params: any[] }[] = []
  const tokens = useMemo(
    () =>
      protocol && TOKEN_COLLATERAL_SUPPORT[protocol]
        ? [
            // ...Object.keys(TOKEN_TRADE_SUPPORT[protocol]).map((key) => TOKEN_TRADE_SUPPORT[protocol][key]),
            ...Object.keys(TOKEN_COLLATERAL_SUPPORT[protocol]).map((key) => TOKEN_COLLATERAL_SUPPORT[protocol][key]),
          ]
        : [],
    [protocol]
  )
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
    data,
    isLoading,
    refetch: reloadToken,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.ERC20],
    calls,
    protocolProvider?.chainId,
    protocolProvider?.provider,
    account,
    {
      enabled: !!protocolProvider?.chainId && !!account && tokens.length > 0,
      keepPreviousData: true,
      retry: 0,
    }
  )

  const tokenBalance = useMemo<number | undefined>(() => {
    if (!data || data.length === 0) return
    const results: BigNumber[][] = data ?? []
    const tokenBalances: TokenBalance[] = []

    if (results.length > 0) {
      for (let i = 0; i < tokens.length; i++) {
        const decimals = tokens[i].decimals || 18
        tokenBalances.push({
          address: tokens[i].address,
          decimals,
          amountBN: results[i]?.[0] ?? BigNumber.from(0),
          amount: Number(formatUnits(results[i]?.[0] ?? BigNumber.from(0), decimals)),
          price: prices[tokens[i].address] ?? 1,
        })
      }
    }
    return tokenBalances.reduce((sum, next) => sum + next.amount * next.price, 0)
  }, [data, prices, tokens])

  const balance = (tokenBalance ?? 0) + (nativeRef.current ?? 0)

  return { balance, isLoading, reloadToken }
}

export default useTraderBalances
