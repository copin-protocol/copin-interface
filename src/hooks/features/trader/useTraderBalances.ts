import useTraderBalanceStore from 'hooks/store/useTraderBalanceStore'
import useUsdPrices from 'hooks/store/useUsdPrices'
import { ProtocolEnum } from 'utils/config/enums'

const useTraderBalances = ({ account, protocol }: { account: string | undefined; protocol: ProtocolEnum }) => {
  const { prices } = useUsdPrices()
  const { balances } = useTraderBalanceStore()
  const traderBalanceInToken = balances[`${account}__${protocol}`]

  const traderBalance =
    traderBalanceInToken?.reduce((result, current) => {
      if (current.isStableCoin) return result + current.tokenAmount
      const tokenPrice = prices[current.symbol] ?? 0
      return result + current.tokenAmount * tokenPrice
    }, 0) ?? 0

  return { balance: traderBalance }
}

export default useTraderBalances
