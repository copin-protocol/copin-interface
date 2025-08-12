import { memo, useEffect, useMemo } from 'react'

import ChartPositions from 'components/@charts/ChartPositions'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { PositionData, TraderTokenStatistic } from 'entities/trader.d'
import { DEFAULT_PROTOCOL, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { TokenOptionProps } from 'utils/config/trades'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { useQueryInfinitePositions } from './useQueryInfinitePositions'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}

const MarketPositions = memo(function MarketPositionsMemo({
  account,
  protocol,
  tokensStatistic,
  currentPair,
  setCurrentPair,
}: {
  account: string
  protocol: ProtocolEnum
  tokensStatistic: TraderTokenStatistic[]
  currentPair?: string
  setCurrentPair: (pair: string) => void
}) {
  const currencyOption = useMemo(() => {
    if (!currentPair) return undefined
    const symbol = getSymbolFromPair(currentPair)
    const result: TokenOptionProps = {
      id: symbol,
      label: symbol,
      value: symbol,
    }
    return result
  }, [currentPair])
  const { openingPositions, closedPositions, isLoadingClosed, handleFetchClosedPositions, hasNextClosedPositions } =
    useQueryInfinitePositions({
      address: account,
      protocol,
      currentPair,
      limit: MAX_PAGE_LIMIT,
    })

  useEffect(() => {
    const existOpening = !!openingPositions?.find((e) => e.id === currentPair)
    const existClosed = !!closedPositions?.find((e) => e.id === currentPair)
    const existToken = !!tokensStatistic?.find((e) => e.pair === currentPair)
    if (currentPair && (existOpening || existClosed || existToken)) return
    if (!!openingPositions?.length) {
      setCurrentPair(openingPositions[0].pair)
      return
    }
    if (!!closedPositions?.length) {
      setCurrentPair(closedPositions[0].pair)
      return
    }
    if (!!tokensStatistic?.length) {
      setCurrentPair(tokensStatistic?.[0].pair)
      return
    }
  }, [closedPositions, currentPair, openingPositions, tokensStatistic, setCurrentPair])

  return (
    <ChartPositions
      sx={{
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
      protocol={protocol ?? DEFAULT_PROTOCOL}
      timeframeOption={TIME_FILTER_OPTIONS[1]}
      currencyOption={currencyOption}
      openingPositions={openingPositions ?? []}
      closedPositions={closedPositions ?? []}
      fetchNextPage={handleFetchClosedPositions}
      hasNextPage={hasNextClosedPositions}
      isLoadingClosed={isLoadingClosed}
      account={account}
      isExpanded
    />
  )
})

export default MarketPositions
