import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'

import MULTICALL_ABI from 'abis/Multicall.json'
import { NO_TX_HASH_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'
import { TOKEN_COLLATERAL_SUPPORT } from 'utils/config/tokenCollateralSupport'
import { WorkerBalanceMessage } from 'utils/types'
import { CHAINS } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

import { fetchHLAccountBalance } from './utils'

export class BalanceServiceWorker {
  public async getBalances({ protocol, address }: { protocol: ProtocolEnum; address: string }) {
    // fetch balance tokens
    const balanceInTokens: WorkerBalanceMessage['balances'] = []

    if (protocol === ProtocolEnum.HYPERLIQUID) {
      try {
        const balance = await fetchHLAccountBalance({ address })
        balanceInTokens.push({ symbol: 'USDC', tokenAmount: balance, isStableCoin: true })
        return balanceInTokens
      } catch {
        return
      }
    }

    const providerConfig = PROTOCOL_PROVIDER[protocol]

    if (!providerConfig) return 0
    const isEVM = typeof providerConfig?.chainId === 'number'
    const chainId = providerConfig.chainId as number
    // provider
    const provider = rpcProvider(chainId)

    if (isEVM) {
      try {
        const nativeBalance = await provider.getBalance(address)
        const parsedNativeBalance = (() => {
          if (!nativeBalance) return 0
          const nativeSymbol = CHAINS[chainId].token
          const balance = Number(formatUnits(nativeBalance))
          if (isNaN(balance)) return 0
          balanceInTokens.push({ symbol: nativeSymbol, tokenAmount: balance, isStableCoin: false })
          return 0
        })()
      } catch {}
    }

    const isExcludedProtocol = NO_TX_HASH_PROTOCOLS.includes(protocol)
    if (!isExcludedProtocol) {
      try {
        const calls: { address: string; name: string; params: any[] }[] = []
        const tokenArray = Object.values(TOKEN_COLLATERAL_SUPPORT[protocol])
        const tokens = Array.from(new Set(tokenArray.map((token) => token.address)))
          .map((address) => tokenArray.find((token) => token.address === address))
          .filter((token) => token !== undefined)
        tokens.forEach((token: any) => {
          calls.push({
            address: token.address,
            name: 'balanceOf',
            params: [address],
          })
        })
        const contract = new Contract(
          CONTRACT_ADDRESSES[chainId]['MULTICALL'],
          MULTICALL_ABI,
          provider.getSigner(address)
        )
        if (address) {
          contract.connect(address)
        }
        const itf = new Interface(CONTRACT_ABIS[CONTRACT_QUERY_KEYS.ERC20])
        const calldata = calls.map((call) => ({
          target: call.address.toLowerCase(),
          callData: itf.encodeFunctionData(call.name, call.params),
        }))
        const { returnData } = await contract.aggregate(calldata)
        const tokenBalances = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))

        // parse data

        const parsedTokenBalances = (() => {
          if (!tokenBalances?.length) return
          ;(tokenBalances as BigNumber[][]).forEach((balanceData, index) => {
            const collateralToken = tokens[index]
            if (!collateralToken) return
            const collateralAmount = Number(
              formatUnits(balanceData?.[0] ?? BigNumber.from(0), collateralToken.decimals)
            )
            balanceInTokens.push({
              symbol: collateralToken.symbol,
              tokenAmount: collateralAmount,
              isStableCoin: !!collateralToken.isStableCoin,
            })
            return
          })
        })()
      } catch {}
    }
    const filteredBalances = balanceInTokens.filter((v) => !!v.tokenAmount)
    return filteredBalances
  }
}
