import { useMemo } from 'react'

import { HlPortfolioRawData } from 'entities/hyperliquid'
import { calculateMaxDrawdown, getPortfolioByTime } from 'pages/TraderDetails/HyperliquidApiMode/helpers'
import { TimeFilterByEnum } from 'utils/config/enums'

const useHyperliquidPortfolio = ({
  hlPortfolioData,
  timeOption = TimeFilterByEnum.LAST_24H,
  isCombined = false,
  isAccountValue = false,
}: {
  hlPortfolioData?: HlPortfolioRawData
  timeOption?: TimeFilterByEnum
  isCombined?: boolean
  isAccountValue?: boolean
}) => {
  return useMemo(() => {
    const { historyData, totalVolume } = getPortfolioByTime(hlPortfolioData, timeOption, isAccountValue, isCombined)
    const { historyData: accountValueHistory } = getPortfolioByTime(hlPortfolioData, timeOption, true, isCombined)
    const { historyData: pnlHistory } = getPortfolioByTime(hlPortfolioData, timeOption, false, isCombined)
    const mdd = calculateMaxDrawdown(pnlHistory, accountValueHistory)
    const latestPnl = historyData.length ? historyData[historyData.length - 1] : 0

    return {
      historyData,
      totalVolume,
      mdd,
      latestPnl,
    }
  }, [hlPortfolioData, isAccountValue, isCombined, timeOption])
}

export default useHyperliquidPortfolio
