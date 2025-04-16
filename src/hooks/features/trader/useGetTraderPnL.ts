import { useEffect } from 'react'

import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useTraderProfitStore from 'hooks/store/useTraderProfitStore'
import { ProtocolEnum } from 'utils/config/enums'
import { calcOpeningPnL } from 'utils/helpers/calculate'
import { getSymbolFromPair } from 'utils/helpers/transform'

const useGetTraderPnL = ({ protocol, positions }: { protocol: ProtocolEnum; positions?: PositionData[] }) => {
  const { setUnrealisedPnl } = useTraderProfitStore()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol })

  const calculateTotalUnrealizedPnL = (
    positionsList: PositionData[] | undefined,
    marketPrices: Record<string, number | undefined>
  ): number => {
    if (!positionsList?.length) {
      return 0
    }

    return positionsList.reduce((totalPnl, position) => {
      if (protocol === ProtocolEnum.HYPERLIQUID) {
        return totalPnl + position.pnl
      } else {
        const tokenSymbol = getSymbolFromPair(position.pair)
        const marketPrice = marketPrices[tokenSymbol]
        if (marketPrice) {
          return totalPnl + calcOpeningPnL(position, marketPrice)
        }
      }

      return totalPnl
    }, 0)
  }

  useEffect(() => {
    if (protocol !== ProtocolEnum.HYPERLIQUID) return
    const totalUnrealizedPnl = calculateTotalUnrealizedPnL(positions, prices)
    setUnrealisedPnl(totalUnrealizedPnl)
  }, [positions, prices, protocol])
}

export default useGetTraderPnL
