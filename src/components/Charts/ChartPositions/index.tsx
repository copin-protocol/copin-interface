import { useSize } from 'ahooks'
import dayjs from 'dayjs'
import { Range, UTCTimestamp } from 'lightweight-charts'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useRef, useState } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import CurrencyOption from 'components/CurrencyOption'
// import CurrencyOption from 'components/CurrencyOption'
import { PositionData } from 'entities/trader.d'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { PositionStatusEnum, TimeframeEnum } from 'utils/config/enums'
import { ALL_TOKENS_ID, TOKEN_TRADE_SUPPORT, getDefaultTokenTrade } from 'utils/config/trades'

import useChartPositionData from '../useChartPositionData'
import BrushChart from './BrushChart'
import PositionLegend from './PositionLegend'
import TimeframeSelection from './TimeframeSelection'
import { renderChart, renderMarker } from './renderChart'
import { ChartPositionsProps } from './types'

export interface TimeScaleRange {
  from: number
  to: number
}

const THE_REST_HEIGHT = 200

export default function ChartPositions({
  protocol,
  targetPosition,
  openingPositions,
  closedPositions,
  timeRange,
  componentIds,
  sx,
  isExpanded,
  handleExpand,
  hasNextPage,
  fetchNextPage,
  isLoadingClosed,
  currencyOption,
  currencyOptions,
  changeCurrency,
  currencySelectProps,
}: ChartPositionsProps) {
  const hasBrush = !!isExpanded
  const { myProfile } = useMyProfile()
  const chartId = componentIds?.chart ? componentIds.chart : 'chart-positions'
  const legendId = componentIds?.legend ? componentIds.legend : 'legend-positions'
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const size = useSize(wrapperRef)

  const [markerId, setMarkerId] = useState<string | undefined>()
  const [visibleRange, setVisibleRange] = useState<TimeScaleRange | undefined>()
  const [timeframe, setTimeframe] = useState(TimeframeEnum.H1)
  const hasAllTokens = currencyOption?.id === ALL_TOKENS_ID
  const filterPositions = (positions?: PositionData[]) =>
    (positions &&
      positions.length > 0 &&
      positions.filter((e) =>
        hasAllTokens ? e.indexToken === positions[0].indexToken : e.indexToken === currencyOption?.id
      )) ||
    []

  const filteredOpeningPositions = filterPositions(openingPositions)
  const filteredClosedPositions = filterPositions(closedPositions)
  const mostRecentPos = useMemo(() => {
    return filteredOpeningPositions.length > 0
      ? filteredOpeningPositions[0]
      : filteredClosedPositions.length > 0
      ? filteredClosedPositions[0]
      : undefined
  }, [filteredClosedPositions, filteredOpeningPositions])
  const mostRecentTrade = useMemo(
    () => (mostRecentPos ? dayjs(mostRecentPos.closeBlockTime ?? mostRecentPos.openBlockTime).utc() : undefined),
    [mostRecentPos]
  )
  // time range when not expand
  const _timeRange = useMemo(() => {
    const today = dayjs().utc()
    if (mostRecentTrade) {
      return {
        to: today.valueOf(),
        from: mostRecentTrade.subtract(7, 'day').valueOf(),
      }
    }
    return { to: dayjs().utc().valueOf(), from: dayjs().utc().subtract(7, 'day').valueOf() }
  }, [mostRecentTrade])

  const oldestPosition =
    filteredClosedPositions && filteredClosedPositions.length > 0
      ? filteredClosedPositions[filteredClosedPositions.length - 1]
      : undefined
  const oldestPosTime = oldestPosition ? dayjs(oldestPosition.openBlockTime).utc() : undefined

  const defaultToken = getDefaultTokenTrade(protocol).address
  const tokenTrade = useMemo(
    () =>
      TOKEN_TRADE_SUPPORT[protocol][
        hasAllTokens ? (mostRecentPos ? mostRecentPos.indexToken : defaultToken) : currencyOption?.id ?? defaultToken
      ],
    [currencyOption?.id, defaultToken, hasAllTokens, mostRecentPos, protocol]
  )

  const { chartData, isLoading, from, timezone } = useChartPositionData({
    timeRange: isExpanded ? timeRange : _timeRange,
    timeframe,
    protocol,
    indexToken: tokenTrade?.address,
  })
  const openingPos = (openingPositions ?? []).filter(
    (e) => e.indexToken === tokenTrade?.address && dayjs(e.openBlockTime).utc().valueOf() >= from
  )
  const closedPos = closedPositions.filter(
    (e) => e.indexToken === tokenTrade?.address && dayjs(e.closeBlockTime).utc().valueOf() >= from
  )
  const listPositions = useMemo(() => [...closedPos, ...openingPos], [closedPos, openingPos])
  const currentPosition = listPositions.find((e) => markerId?.includes(e.id))

  useEffect(() => {
    if (targetPosition) {
      setMarkerId(targetPosition.id)

      const openTime = dayjs(targetPosition.openBlockTime).utc()
      const closedTime = dayjs(targetPosition.closeBlockTime).utc()
      const diffDay = closedTime.diff(openTime, 'day')
      const duration = diffDay < 5 && timeframe !== TimeframeEnum.M5 ? 5 : 1
      setVisibleRange({
        from: openTime.subtract(duration, 'day').unix(),
        to: closedTime.add(duration, 'day').unix(),
      })
    }
  }, [targetPosition, timeframe])

  useEffect(() => {
    if ((timeframe || currencyOption) && !targetPosition) {
      setVisibleRange(undefined)
    }
  }, [currencyOption, timeframe, targetPosition])

  useEffect(() => {
    if (mostRecentTrade && !visibleRange && !targetPosition) {
      const duration =
        timeframe === TimeframeEnum.D1 ? 60 : mostRecentTrade && dayjs(from).utc().isAfter(mostRecentTrade) ? 2 : 1
      setVisibleRange({
        from: mostRecentTrade.subtract(duration, 'days').valueOf() / 1000,
        to: mostRecentTrade.add(duration, 'days').valueOf() / 1000,
      })
    }
  }, [mostRecentTrade, from, timeframe, visibleRange])

  useEffect(() => {
    if (isLoadingClosed || hasAllTokens) return
    if (hasNextPage && oldestPosTime && oldestPosTime.valueOf() > from) {
      fetchNextPage && fetchNextPage()
    }
  }, [fetchNextPage, from, hasAllTokens, hasNextPage, isLoadingClosed, oldestPosTime])

  const [candleStickChart, setCandleStickChart] = useState<ReturnType<typeof renderChart>>()

  // Render chart candle
  const chartIsRemoved = useRef(false)
  useEffect(() => {
    chartIsRemoved.current = false
    const renderResult = renderChart({
      chartMinHeight: THE_REST_HEIGHT,
      username: myProfile?.username,
      hasBrush,
      chartId,
      legendId,
      chartData,
      setVisibleRange,
      setMarkerId,
    })
    if (!renderResult) return
    setCandleStickChart(renderResult)
    const { chart, container, handleClickEvent } = renderResult

    const handleResize = () => {
      if (container) {
        chart.applyOptions({
          width: container.offsetWidth,
          height: Math.max(container.clientHeight ?? 0, THE_REST_HEIGHT),
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.unsubscribeClick(handleClickEvent)
      chart.remove()
      setCandleStickChart(undefined)
      chartIsRemoved.current = true
    }
  }, [chartData, chartId, hasBrush, legendId, myProfile?.username])

  const [showSeeMorePositions, setShowSeeMorePositions] = useState(false)

  // Subscribe time scale event
  useEffect(() => {
    if (!candleStickChart || chartIsRemoved.current) return
    const { timeScale } = candleStickChart
    if (visibleRange) {
      if (
        timeScale.getVisibleRange()?.from !== visibleRange.from ||
        timeScale.getVisibleRange()?.to !== visibleRange.to
      ) {
        timeScale.setVisibleRange({
          from: visibleRange.from as UTCTimestamp,
          to: visibleRange.to as UTCTimestamp,
        })
      }
    }
    function onVisibleTimeRangeChanged(value: Range<any> | null) {
      if (!isExpanded) {
        if (!value?.from) return
        if (value.from < (chartData?.[5]?.time ?? 0)) {
          setShowSeeMorePositions(true)
        } else {
          setShowSeeMorePositions(false)
        }
        return
      }
      if (isLoadingClosed || hasAllTokens) return
      if (chartData && chartData.length > 0 && value) {
        const from = Number(value.from)
        const to = Number(value.to)
        if (hasNextPage && from === chartData[0].time) {
          setVisibleRange({ from, to })
          fetchNextPage && fetchNextPage()
        } else {
          if (!hasBrush || (visibleRange?.from === from && visibleRange?.to === to)) return
          setVisibleRange({ from, to })
        }
      }
    }
    timeScale.subscribeVisibleTimeRangeChange(debounce(onVisibleTimeRangeChanged, 100))
    return () => {
      timeScale.unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged)
    }
  }, [
    candleStickChart,
    chartData,
    fetchNextPage,
    hasAllTokens,
    hasBrush,
    hasNextPage,
    isLoadingClosed,
    visibleRange?.from,
    visibleRange?.to,
    isExpanded,
  ])

  // Render markers
  useEffect(() => {
    if (!candleStickChart || chartIsRemoved.current) return
    const { series } = candleStickChart
    renderMarker({ listPositions, markerId, timezone, closedPos, series })
  }, [candleStickChart, closedPos, listPositions, markerId, timezone])

  // Show marker details
  useEffect(() => {
    if (!candleStickChart || chartIsRemoved.current) return
    const { avgPriceLine } = candleStickChart
    if (markerId) {
      if (currentPosition) {
        avgPriceLine.applyOptions({
          price: currentPosition.averagePrice,
          color: currentPosition.isLong ? themeColors.green2 : themeColors.red1,
          lineVisible: true,
          axisLabelVisible: true,
          title: (currentPosition.isLong ? 'Long' : 'Short') + ' - Avg. Price',
        })
      }
    } else {
      avgPriceLine.applyOptions({
        price: 0,
        lineVisible: false,
      })
    }
  }, [candleStickChart, currentPosition, markerId])

  const changeTimeframe = (data: TimeframeEnum) => {
    setTimeframe(data)
    setVisibleRange(undefined)
  }

  const handleBrush = (extent: [number, number]) => {
    // Set visible range using TimeScaleApi
    setVisibleRange({ from: extent[0], to: extent[1] })
  }

  return (
    <Flex
      ref={wrapperRef}
      flexDirection="column"
      width="100%"
      height="100%"
      sx={{ position: 'relative', overflow: 'hidden', ...(sx ?? {}) }}
    >
      {/*<div id={legendId} />*/}
      {/*<div id={tooltipId} />*/}
      <Flex width="100%" alignItems="center" sx={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}>
        {currentPosition && (
          <PositionLegend
            isExpanded={isExpanded}
            data={currentPosition}
            isOpening={currentPosition.status === PositionStatusEnum.OPEN}
          />
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mr={12} mt={2} sx={{ gap: 2 }}>
        <Type.Caption pl={12} color="neutral3">
          {currencyOption?.label}/USD
        </Type.Caption>
        <Flex flex={1} alignItems="center" justifyContent="flex-end" sx={{ gap: 2 }}>
          <TimeframeSelection isExpanded={isExpanded} currentOption={timeframe} changeOption={changeTimeframe} />
          {!!currencyOptions?.length && !!changeCurrency && (
            <CurrencyOption
              options={currencyOptions}
              currentOption={
                currencyOption?.id === ALL_TOKENS_ID
                  ? currencyOptions.find((e) => e.id === mostRecentPos?.indexToken) ?? currencyOption
                  : currencyOption ?? currencyOptions[0]
              }
              handleChangeOption={(option) => {
                changeCurrency && changeCurrency(option)
              }}
              selectProps={currencySelectProps}
            />
          )}
        </Flex>
      </Flex>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            bg: 'modalBG',
          }}
        >
          <Loading />
        </Box>
      )}
      {!isLoading && chartData && chartData.length === 0 && <NoDataFound />}
      <div id={chartId} style={{ padding: '0 12px', flex: '1 0 0' }} />
      {!isExpanded && showSeeMorePositions && (
        <Button
          variant="outline"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 8,
            backdropFilter: 'blur(3px)',
          }}
          onClick={handleExpand}
        >
          See all positions
        </Button>
      )}
      {isExpanded && tokenTrade?.symbol && size && (
        <BrushChart
          symbol={tokenTrade?.symbol}
          key={chartId}
          chartDimensions={{ width: size?.width, height: 100 }}
          onBrush={handleBrush}
          from={visibleRange?.from ? new Date(visibleRange?.from * 1000) : undefined}
          to={visibleRange?.to ? new Date(visibleRange?.to * 1000) : undefined}
        />
      )}
    </Flex>
  )
}
