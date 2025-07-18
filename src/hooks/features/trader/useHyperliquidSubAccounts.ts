import { useMemo } from 'react'

import { HlSubAccountData, HlTokenMappingData } from 'entities/hyperliquid'
import { parseHlSpotData } from 'pages/TraderDetails/HyperliquidApiMode/helpers'

const useHyperliquidSubAccounts = ({
  data,
  spotTokens,
}: {
  data?: HlSubAccountData[]
  spotTokens?: HlTokenMappingData[]
}) => {
  return useMemo(() => {
    return data?.map((e) => {
      const spotEquity = parseHlSpotData(e.spotState, spotTokens)?.reduce(
        (sum, current) => sum + (current.currentValue ?? 0),
        0
      )
      const perpEquity = Number(e.clearinghouseState?.marginSummary?.accountValue ?? 0)
      return {
        ...e,
        perpEquity,
        spotEquity,
      } as HlSubAccountData
    })
  }, [spotTokens, data])
}

export default useHyperliquidSubAccounts
