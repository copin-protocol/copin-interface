import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import {
  CandlestickData,
  ColorType,
  CrosshairMode,
  LineStyle,
  MouseEventParams,
  PriceScaleMode,
  Range,
  SeriesMarker,
  Time,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import NoDataFound from 'components/@ui/NoDataFound'
import CurrencyOption from 'components/CurrencyOption'
import { PositionData } from 'entities/trader.d'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, TimeframeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ALL_TOKENS_ID, TOKEN_TRADE_SUPPORT, getDefaultTokenTrade, getTokenOptions } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import PositionLegend from './PositionLegend'
import TimeframeSelection from './TimeframeSelection'
import { getTimeframe } from './helpers'
import { ChartPositionsProps } from './types'

interface TimeScaleRange {
  from: number
  to: number
}

const THE_REST_HEIGHT = 200

export default function ChartPositions({
  protocol,
  targetPosition,
  openingPositions,
  closedPositions,
  currencyOptions,
  currencyOption,
  changeCurrency,
  timeframeOption,
  timeRange,
  componentIds,
  sx,
  isExpanded,
  toggleExpand,
  hasNextPage,
  fetchNextPage,
  isLoadingClosed,
  currencySelectProps,
}: ChartPositionsProps) {
  const { myProfile } = useMyProfile()
  const chartId = componentIds?.chart ? componentIds.chart : 'chart-positions'
  const legendId = componentIds?.legend ? componentIds.legend : 'legend-positions'
  const tooltipId = componentIds?.tooltip ? componentIds.tooltip : 'tooltip-positions'

  const isMobile = useIsMobile()

  const tokenOptions = useMemo(
    () => currencyOptions ?? getTokenOptions({ protocol, ignoredAll: true }),
    [currencyOptions, protocol]
  )

  const [markerId, setMarkerId] = useState<string | undefined>()
  const [visibleRange, setVisibleRange] = useState<TimeScaleRange | undefined>()
  const [visibleLogicalRange, setVisibleLogicalRange] = useState<TimeScaleRange | undefined>()
  const hasAllTokens = currencyOption.id === ALL_TOKENS_ID
  const filterPositions = (positions?: PositionData[]) =>
    (positions &&
      positions.length > 0 &&
      positions.filter((e) =>
        hasAllTokens ? e.indexToken === positions[0].indexToken : e.indexToken === currencyOption.id
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
    () =>
      mostRecentPos
        ? dayjs(mostRecentPos.closeBlockTime ? mostRecentPos.closeBlockTime : mostRecentPos.blockTime).utc()
        : undefined,
    [mostRecentPos]
  )

  const oldestPosition =
    filteredClosedPositions && filteredClosedPositions.length > 0
      ? filteredClosedPositions[filteredClosedPositions.length - 1]
      : undefined
  const oldestPosTime = oldestPosition ? dayjs(oldestPosition.openBlockTime).utc() : undefined

  const tokenTrade =
    TOKEN_TRADE_SUPPORT[protocol][
      hasAllTokens
        ? mostRecentPos
          ? mostRecentPos.indexToken
          : getDefaultTokenTrade(protocol).address
        : currencyOption.id
    ]

  const to = useMemo(() => (timeRange ? timeRange.to : dayjs().utc().valueOf()), [timeRange])
  const timeframeDuration = getDurationFromTimeFilter(timeframeOption?.id)
  const fromRange = useMemo(
    () => (timeRange ? dayjs(timeRange.from).utc() : dayjs(to).utc().subtract(timeframeDuration, 'day')),
    [timeRange, timeframeDuration, to]
  )
  const from = useMemo(() => {
    const minFrom =
      mostRecentTrade && fromRange.isAfter(mostRecentTrade)
        ? mostRecentTrade.subtract(timeframeDuration, 'day')
        : fromRange
    return oldestPosTime && oldestPosTime.isBefore(minFrom) ? oldestPosTime.valueOf() : minFrom.valueOf()
  }, [fromRange, mostRecentTrade, oldestPosTime, timeframeDuration])
  const timeframe = useMemo(() => getTimeframe(from, to), [from, to])
  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])

  const [currentTimeframe, setCurrentTimeframe] = useState(timeframe)

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, tokenTrade.symbol, from, to, currentTimeframe],
    () => getChartDataV2({ symbol: tokenTrade.symbol, timeframe: currentTimeframe, from, to }),
    {
      retry: 0,
    }
  )
  const chartData: CandlestickData[] = useMemo(
    () =>
      data
        ?.map((e) => {
          return {
            open: e.open,
            close: e.close,
            high: e.high,
            low: e.low,
            time: dayjs(e.timestamp).utc().unix() - timezone,
          } as CandlestickData
        })
        ?.sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? [],
    [data, timezone]
  )
  const openingPos = (openingPositions ?? []).filter(
    (e) => e.indexToken === tokenTrade.address && dayjs(e.blockTime).utc().valueOf() >= from
  )
  const closedPos = closedPositions.filter(
    (e) => e.indexToken === tokenTrade.address && dayjs(e.closeBlockTime).utc().valueOf() >= from
  )
  const listPositions = useMemo(() => [...closedPos, ...openingPos], [closedPos, openingPos])
  const currentPosition = listPositions.find((e) => markerId?.includes(e.id))

  useEffect(() => {
    if (targetPosition) {
      const targetMarkerId = `${targetPosition.id}-CLOSE`
      setMarkerId(targetMarkerId)

      const openTime = dayjs(targetPosition.openBlockTime).utc()
      const closedTime = dayjs(targetPosition.closeBlockTime).utc()
      const diffDay = closedTime.diff(openTime, 'day')
      const duration = diffDay < 5 && currentTimeframe !== TimeframeEnum.M5 ? 5 : 1
      setVisibleRange({
        from: openTime.subtract(duration, 'day').unix(),
        to: closedTime.add(duration, 'day').unix(),
      })
    }
  }, [targetPosition, currentTimeframe])

  useEffect(() => {
    if ((currentTimeframe || currencyOption) && !targetPosition) {
      setVisibleRange(undefined)
      setVisibleLogicalRange(undefined)
    }
  }, [currencyOption, currentTimeframe, targetPosition])

  useEffect(() => {
    if (mostRecentTrade && !visibleRange && !targetPosition) {
      const duration =
        currentTimeframe === TimeframeEnum.D1
          ? 30
          : mostRecentTrade && dayjs(from).utc().isAfter(mostRecentTrade)
          ? 2
          : 1
      setVisibleRange({
        from: mostRecentTrade.subtract(duration, 'days').valueOf() / 1000,
        to: mostRecentTrade.add(duration, 'days').valueOf() / 1000,
      })
    }
  }, [mostRecentTrade, visibleRange, from, currentTimeframe])

  useEffect(() => {
    if (isLoadingClosed || hasAllTokens) return
    if (hasNextPage && oldestPosTime && oldestPosTime.valueOf() > from) {
      fetchNextPage && fetchNextPage()
    }
  }, [fetchNextPage, from, hasAllTokens, hasNextPage, isLoadingClosed, oldestPosTime])

  useEffect(() => {
    if (isLoading || !data || !chartData || data.length === 0 || chartData.length === 0) return

    const container = document.getElementById(chartId)
    const chart = createChart(container ? container : chartId, {
      height: Math.max(container?.clientHeight ?? 0, THE_REST_HEIGHT),
      rightPriceScale: {
        entireTextOnly: true,
        borderVisible: false,
        mode: PriceScaleMode.Logarithmic,
        textColor: themeColors.neutral3,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderVisible: true,
        borderColor: '#1f1a30',
        rightOffset: 3,
        fixLeftEdge: true,
        fixRightEdge: false,
        shiftVisibleRangeOnNewBar: true,
      },
      grid: {
        horzLines: {
          color: 'transparent',
          visible: false,
        },
        vertLines: {
          color: 'transparent',
          visible: false,
        },
      },
      overlayPriceScales: {
        borderVisible: false,
      },
      leftPriceScale: {
        visible: false,
        scaleMargins: {
          bottom: 0,
          top: 0,
        },
      },
      layout: {
        textColor: themeColors.neutral3,
        background: { type: ColorType.Solid, color: 'transparent' },
        fontFamily: FONT_FAMILY,
        fontSize: 13,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        horzLine: {
          labelBackgroundColor: themeColors.neutral1,
          color: themeColors.neutral3,
          width: 1,
          style: LineStyle.Dotted,
        },
        vertLine: {
          color: themeColors.neutral3,
          labelBackgroundColor: themeColors.neutral1,
          width: 1,
          style: LineStyle.Dotted,
        },
      },
    })

    const timeScale = chart.timeScale()
    function onVisibleTimeRangeChanged(value: Range<any> | null) {
      if (isLoadingClosed || hasAllTokens) return
      if (chartData && chartData.length > 0 && hasNextPage && value && Number(value.from) === chartData[0].time) {
        setVisibleRange({ from: Number(value.from), to: Number(value.to) })
        fetchNextPage && fetchNextPage()
      }
    }
    timeScale.subscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged)

    const series = chart.addCandlestickSeries({
      upColor: themeColors.neutral3,
      downColor: 'transparent',
      borderDownColor: themeColors.neutral3,
      borderUpColor: themeColors.neutral3,
      wickDownColor: themeColors.neutral3,
      wickUpColor: themeColors.neutral3,
    })
    series.setData(chartData)
    series.applyOptions({})

    const increasePosMarkers = listPositions.map((position): SeriesMarker<Time> => {
      const isGMX = position.protocol === ProtocolEnum.GMX
      const isOpen = isGMX ? !position.id : position.status === PositionStatusEnum.OPEN
      const isSelected =
        markerId && markerId.includes(isOpen ? (isGMX ? position.blockTime : position.openBlockTime) : position.id)
      return {
        id: `${position.id}-OPEN-${isGMX ? position.blockTime : position.openBlockTime}`,
        position: 'aboveBar',
        color: markerId && !isSelected ? themeColors.neutral3 : position.isLong ? themeColors.green1 : themeColors.red2,
        size: isSelected ? 1.85 : 1.35,
        shape: position.isLong ? 'arrowUp' : 'arrowDown',
        time: (dayjs(isGMX && isOpen ? position.blockTime : position.openBlockTime)
          .utc()
          .unix() - timezone) as Time,
      }
    })

    const closePosMarkers = closedPos.map((position): SeriesMarker<Time> => {
      return {
        id: `${position.id}-CLOSE`,
        position: 'belowBar',
        color:
          markerId && !markerId.includes(position.id)
            ? themeColors.neutral3
            : position.isLiquidate || position.roi <= -100
            ? themeColors.red2
            : themeColors.neutral1,
        size: markerId && markerId.includes(position.id) ? 1.75 : 1.5,
        shape: 'square',
        text: '$' + formatNumber(position.realisedPnl),
        time: (dayjs(position.closeBlockTime).utc().unix() - timezone) as Time,
      }
    })

    const markers = [...increasePosMarkers, ...closePosMarkers].sort((a, b) => (a.time as number) - (b.time as number))
    series.setMarkers(markers)
    if (visibleRange) {
      timeScale.setVisibleRange({
        from: visibleRange.from as UTCTimestamp,
        to: visibleRange.to as UTCTimestamp,
      })
    }
    if (visibleLogicalRange) {
      timeScale.setVisibleLogicalRange({
        from: visibleLogicalRange.from,
        to: visibleLogicalRange.to,
      })
    }

    const avgPriceLine = series.createPriceLine({
      id: 'averagePrice',
      price: 0,
      color: 'transparent',
      lineWidth: 1,
      lineVisible: false,
      axisLabelVisible: false,
      title: 'Avg. Price',
      lineStyle: LineStyle.Dashed,
    })

    const handleClickEvent = (param: MouseEventParams) => {
      const hoverMakerId = param.hoveredObjectId as string | undefined
      setMarkerId(hoverMakerId)

      const timeRange = timeScale.getVisibleRange()
      setVisibleRange({ from: Number(timeRange?.from), to: Number(timeRange?.to) })
      const logicalRange = timeScale.getVisibleLogicalRange()
      setVisibleLogicalRange({ from: Number(logicalRange?.from), to: Number(logicalRange?.to) })

      if (hoverMakerId) {
        logEvent({
          label: getUserForTracking(myProfile?.username),
          category: EventCategory.CHART,
          action: EVENT_ACTIONS[EventCategory.CHART].VIEW_ORDER_MARKER,
        })
      }
    }

    if (container) {
      const legend = document.getElementById(legendId) ?? document.createElement('div')
      legend.setAttribute('id', legendId)
      if (legend) {
        legend.style.position = 'absolute'
        legend.style.left = '8px'
        legend.style.bottom = `56px`
        legend.style.zIndex = '1'
        legend.style.fontSize = '13px'
        legend.style.fontFamily = FONT_FAMILY
        legend.style.lineHeight = '13px'
        legend.style.color = themeColors.neutral3
        legend.style.display = 'none'
        container.appendChild(legend)
      }

      // Create and style the tooltip html element
      // const toolTip = document.getElementById(tooltipId) ?? document.createElement('div')
      // toolTip.setAttribute('id', tooltipId)
      // if (toolTip) {
      //   toolTip.style.position = 'absolute'
      //   toolTip.style.display = 'none'
      //   toolTip.style.padding = '8px'
      //   toolTip.style.boxSizing = 'border-box'
      //   toolTip.style.zIndex = '1001'
      //   toolTip.style.background = themeColors.neutral5
      //   toolTip.style.color = themeColors.neutral1
      //   toolTip.style.fontSize = '12px'
      //   toolTip.style.left = '16px'
      //   toolTip.style.top = '20px'
      //   if (!toolTip.isConnected) {
      //     container.appendChild(toolTip)
      //   }
      // }

      chart.subscribeCrosshairMove((param) => {
        const hoverMakerId = param.hoveredObjectId as string | undefined
        if (markerId && hoverMakerId) {
          const currentPositionId = markerId.split('-')[0]
          if (hoverMakerId.includes(currentPositionId)) {
            setMarkerId(hoverMakerId)
          }
        }
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > container.clientWidth ||
          param.point.y < 0 ||
          param.point.y > container.clientHeight
        ) {
          // if (toolTip) {
          //   toolTip.style.display = 'none'
          // }
          if (legend) {
            legend.style.display = 'none'
          }
        } else {
          // style="color: ${themeColors.neutral1}"
          if (legend) {
            const candleData = param.seriesData.get(series) as CandlestickData
            if (candleData && candleData.time) {
              legend.innerHTML = `<div style="font-size: 12px; margin: 1px 0;">O: <span>${formatNumber(
                candleData.open
              )}</span> | H: <span>${formatNumber(candleData.high)}</span> | L: <span>${formatNumber(
                candleData.low
              )}</span> | C: <span>${formatNumber(candleData.close)}</span></div>`
              legend.style.display = 'block'
            }
          }

          if (markerId) {
            // const currentPosition = listPositions.find((e) => markerId.includes(e.id))
            // toolTip.innerHTML = ''
            if (currentPosition) {
              avgPriceLine.applyOptions({
                price: currentPosition.averagePrice,
                color: currentPosition.isLong ? themeColors.green2 : themeColors.red1,
                lineVisible: true,
                axisLabelVisible: true,
                title: (currentPosition.isLong ? 'Long' : 'Short') + ' - Avg. Price',
              })

              //       if (markerId.includes('OPEN')) {
              //         toolTip.style.display = 'block'
              //         toolTip.innerHTML = `<div>OPEN | ${formatLocalDate(
              //           currentPosition.openBlockTime ?? currentPosition.blockTime,
              //           DAYJS_FULL_DATE_FORMAT
              //         )}</div><div style="color: ${themeColors.neutral1}">
              // 	Avg. Price: ${formatNumber(currentPosition.averagePrice)} | <span style="color: ${
              //           currentPosition.isLong ? themeColors.green1 : themeColors.red2
              //         }">${currentPosition.isLong ? 'Long' : 'Short'}</span>
              // 	</div><div style="color: ${themeColors.neutral1}">
              // 	Size: ${formatNumber(currentPosition.size, 0)} | ${formatNumber(currentPosition.leverage, 1)}x
              // 	</div>`
              //       } else if (markerId.includes('CLOSE')) {
              //         toolTip.style.display = 'block'
              //         toolTip.innerHTML = `<div><span style="color: ${
              //           currentPosition.roi <= -100 ? themeColors.red2 : themeColors.neutral1
              //         }">${currentPosition.roi <= -100 ? 'LIQUIDATED' : 'CLOSED'}</span> | ${formatLocalDate(
              //           currentPosition.closeBlockTime,
              //           DAYJS_FULL_DATE_FORMAT
              //         )}</div><div style="color: ${themeColors.neutral1}">
              // 	Avg. Price: ${formatNumber(currentPosition.averagePrice)} | <span style="color: ${
              //           currentPosition.isLong ? themeColors.green1 : themeColors.red2
              //         }">${currentPosition.isLong ? 'Long' : 'Short'}</span>
              // 	</div><div style="color: ${themeColors.neutral1}">
              // 	Size: ${formatNumber(currentPosition.size, 0)} | ${formatNumber(currentPosition.leverage, 1)}x
              // 	</div><div>Realised PnL: <span style="font-weight: 800;color: ${
              //   currentPosition.realisedPnl === 0
              //     ? themeColors.neutral1
              //     : currentPosition.realisedPnl > 0
              //     ? themeColors.green1
              //     : themeColors.red2
              // }">
              // 	$${formatNumber(currentPosition.realisedPnl, 0)} (${formatNumber(currentPosition.roi, 0)}%)
              // 	</span></div><div style="color: ${themeColors.neutral1}">
              // 	Paid Fees: $${formatNumber(currentPosition.fee, 0)}
              // 	</div>`
              //       } else {
              //         // toolTip.style.display = 'none'
              //       }
              //     } else {
              //     }
            } else {
              // toolTip.style.display = 'none'
              avgPriceLine.applyOptions({
                price: 0,
                lineVisible: false,
              })
            }
          }
        }
      })

      chart.subscribeClick(handleClickEvent)
    }

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
      timeScale.unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged)
      chart.unsubscribeClick(handleClickEvent)

      chart.remove()
    }
  }, [
    chartData,
    chartId,
    closedPos,
    closedPositions,
    currentPosition,
    data,
    from,
    isLoading,
    isMobile,
    legendId,
    listPositions,
    markerId,
    openingPositions,
    timezone,
    tokenTrade.address,
    tooltipId,
    visibleLogicalRange,
    visibleRange,
  ])

  const changeTimeframe = (data: TimeframeEnum) => {
    setCurrentTimeframe(data)
    setVisibleLogicalRange(undefined)
    setVisibleRange(undefined)
  }

  return (
    <Box height="100%" sx={{ position: 'relative', pl: 12, ...(sx ?? {}) }}>
      {/*<div id={legendId} />*/}
      {/*<div id={tooltipId} />*/}
      <Flex width="calc(100% - 24px)" alignItems="center" sx={{ position: 'absolute', top: 0, left: 12, zIndex: 100 }}>
        {currentPosition && (
          <PositionLegend
            isExpanded={isExpanded}
            data={currentPosition}
            isOpening={currentPosition.status !== PositionStatusEnum.CLOSE}
          />
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mr={12} mt={2} sx={{ gap: 2 }}>
        {isExpanded && hasNextPage && hasAllTokens && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (hasNextPage) {
                fetchNextPage && fetchNextPage()
              }
            }}
            sx={{ p: 0 }}
          >
            <Type.Caption>
              <Trans>Load more positions</Trans>
            </Type.Caption>
          </Button>
        )}
        <Flex flex={1} alignItems="center" justifyContent="flex-end" sx={{ gap: 2 }}>
          <TimeframeSelection isExpanded={isExpanded} currentOption={currentTimeframe} changeOption={changeTimeframe} />
          <CurrencyOption
            options={tokenOptions}
            currentOption={
              currencyOption.id === ALL_TOKENS_ID
                ? tokenOptions.find((e) => e.id === mostRecentPos?.indexToken) ?? currencyOption
                : currencyOption
            }
            handleChangeOption={(option) => {
              changeCurrency && changeCurrency(option)
            }}
            selectProps={currencySelectProps}
          />
          {toggleExpand && (
            <IconBox
              icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
              role="button"
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'sm',
                border: 'small',
                borderColor: 'neutral4',
                color: 'neutral2',
                '&:hover': { color: 'neutral1' },
              }}
              onClick={toggleExpand}
            />
          )}
        </Flex>
      </Flex>
      {(isLoading || isLoadingClosed) && (
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
      <div id={chartId} style={{ height: 'calc(100% - 40px)' }} />
    </Box>
  )
}
