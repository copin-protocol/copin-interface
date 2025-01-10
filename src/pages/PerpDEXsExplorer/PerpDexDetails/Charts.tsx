import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, ProjectorScreenChart } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getPerpDexDailyStatisticApi, getProtocolDailyStatisticApi } from 'apis/statisticApi'
import logo from 'assets/logo-text.svg'
import SectionTitle from 'components/@ui/SectionTitle'
import TimeFilter from 'components/@ui/TimeFilter'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import { PERP_DEX_CHART_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import { PerpDexChartData, StatsData } from 'entities/chart'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { PerpChartTypeEnum, ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'
import { TimeRange } from 'utils/types'

import {
  LiquidationChartComponent,
  NetProfitChartComponent,
  ProfitLossChartComponent,
  RevenueChartComponent,
  TraderChartComponent,
  VolumeChartComponent,
  getChartData,
} from './ChartComponent'
import { CHART_CONFIG } from './chartConfig'

export default function Charts({
  perpdex,
  protocol,
}: {
  perpdex: string | undefined
  protocol: ProtocolEnum | undefined
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const [timeRange, setTimeRange] = useState<TimeRange>({})
  const [selectingRange, setSelectingRange] = useState(() => {
    return searchParams['selecting_range'] === '1'
  })
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'time-filter',
    options: PERP_DEX_CHART_FILTER_OPTIONS,
    defaultOption: TimeFilterByEnum.S90_DAY.toString(),
    optionNameToBeDelete: ['time_range', 'selecting_range'],
  })
  const duration = getDurationFromTimeFilter(currentOption.id)
  const defaultTimeRange: TimeRange = useMemo(() => {
    const timeRangeStr = searchParams['time_range'] as string | undefined
    if (!timeRangeStr) return {}
    const timeRangeArr = timeRangeStr.split('_')
    const from = Number(timeRangeArr[0])
    const to = Number(timeRangeArr[1])
    if (isNaN(from) || isNaN(to)) return {}
    return { from: dayjs(from).utc().toDate(), to: dayjs(to).utc().toDate() } as TimeRange
  }, [searchParams])
  const handleSetTimeRange = (range: TimeRange) => {
    if (!range || Object.keys(range).length < 2) {
      setTimeRange({})
      setSearchParams({ ['time_range']: null, ['selecting_range']: null })
      return
    }
    const rangeSearch = `${dayjs(range.from).utc().valueOf()}_${dayjs(range.to).utc().valueOf()}`
    setSearchParams({ ['time_range']: rangeSearch, ['selecting_range']: '1' })
    setTimeRange(range)
  }

  useEffect(() => {
    if (!selectingRange) {
      const to = dayjs().utc()
      const from = to.subtract(duration, 'days')
      setTimeRange({ from: from.toDate(), to: to.toDate() } as TimeRange)
    }
  }, [defaultTimeRange, duration, searchParams, selectingRange])
  const { md } = useResponsive()

  return (
    <Box p={3} pt={1} backgroundColor="neutral7">
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'row'],
          alignItems: ['start', 'start', 'center'],
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <SectionTitle icon={ProjectorScreenChart} title={<Trans>STATISTIC CHARTS</Trans>} sx={{ mb: 0 }} />
        </Box>

        <Flex flex="1 0 0" justifyContent="end" alignItems="center" sx={{ gap: 16 }}>
          <TimeFilter
            options={PERP_DEX_CHART_FILTER_OPTIONS}
            currentFilter={selectingRange ? null : currentOption}
            handleFilterChange={(option) => {
              setSelectingRange(false)
              changeCurrentOption(option)
            }}
          />
          <Box height={16} flex="0 0 1px" bg="neutral2"></Box>
          {!!timeRange && (
            <RangeFilter
              anchor="right"
              anchorPos={md ? 0 : -50}
              isRangeSelection={selectingRange}
              from={timeRange.from}
              to={timeRange.to}
              changeTimeRange={(range) => {
                setSelectingRange(true)
                handleSetTimeRange(range)
              }}
            />
          )}
        </Flex>
      </Flex>
      <StatisticChart perpdex={perpdex} timeRange={timeRange} protocol={protocol} />
    </Box>
  )
}

function StatisticChart({
  perpdex,
  timeRange,
  protocol,
}: {
  perpdex: string | undefined
  timeRange: TimeRange
  protocol: ProtocolEnum | undefined
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentChartId, setCurrentChartId] = useState<PerpChartTypeEnum | undefined>()

  const { data: perpdexStats, isLoading: isLoadingPerpDexStats } = useQuery(
    [QUERY_KEYS.GET_PERP_DEX_STATISTIC_CHART_DATA, perpdex, timeRange],
    () =>
      getPerpDexDailyStatisticApi({
        perpdex: perpdex ?? '',
        from: dayjs(timeRange.from).utc().valueOf(),
        to: dayjs(timeRange.to).utc().valueOf(),
      }),
    { enabled: !protocol && timeRange.from !== timeRange.to && !!perpdex }
  )
  const { data: protocolStats, isLoading: isLoadingProtocolStats } = useQuery(
    [QUERY_KEYS.GET_PERP_DEX_STATISTIC_CHART_DATA, protocol, timeRange],
    () =>
      getProtocolDailyStatisticApi({
        protocol,
        from: dayjs(timeRange.from).utc().valueOf(),
        to: dayjs(timeRange.to).utc().valueOf(),
      }),
    { enabled: timeRange.from !== timeRange.to || !!protocol }
  )
  const data = protocolStats?.length ? protocolStats : perpdexStats
  const isLoading = isLoadingProtocolStats || isLoadingPerpDexStats
  const chartData = useMemo(() => getChartData({ data: data || ([] as any) }), [data])

  const stats = useMemo(() => {
    let stats
    if (data && chartData) {
      const maxProfit = maxBy(chartData, (item) => item.traderProfit)?.traderProfit ?? 0
      const maxLoss = minBy(chartData, (item) => item.traderLoss)?.traderLoss ?? 0
      const maxProfitLoss = Math.max(maxProfit, -maxLoss)
      const minProfitLoss = Math.min(maxProfit, -maxLoss)

      const maxPnl = maxBy(chartData, (item) => item.traderPnl)?.traderPnl ?? 0
      const minPnl = minBy(chartData, (item) => item.traderPnl)?.traderPnl ?? 0
      const maxCurrentCumulativePnl = maxBy(chartData, (item) => item.traderPnlCumulative)?.traderPnlCumulative ?? 0
      const minCurrentCumulativePnl = minBy(chartData, (item) => item.traderPnlCumulative)?.traderPnlCumulative ?? 0

      const currentProfitCumulative = chartData[chartData.length - 1]?.traderProfitCumulative ?? 0
      const currentLossCumulative = chartData[chartData.length - 1]?.traderLossCumulative ?? 0

      stats = {
        maxProfit,
        maxLoss,
        maxProfitLoss,
        minProfitLoss,
        maxCumulativeProfitLoss: Math.max(currentProfitCumulative, -currentLossCumulative),
        maxAbsPnl: Math.max(Math.abs(maxPnl), Math.abs(minPnl)),
        maxAbsCumulativePnl: Math.max(Math.abs(maxCurrentCumulativePnl), Math.abs(minCurrentCumulativePnl)),
      } as StatsData
    }

    return stats
  }, [data, chartData])

  const handleToggleExpand = (chartId: string) => {
    setIsExpanded((prev) => !prev)
    setCurrentChartId((prev) => (prev === chartId ? undefined : (chartId as PerpChartTypeEnum)))
  }

  return (
    <Box mt={1}>
      {isExpanded ? (
        <RenderChartComponent
          data={chartData}
          stats={stats}
          syncId="perpdex"
          currentChartId={currentChartId}
          isLoading={isLoading}
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
            gap: 3,
          }}
        >
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.VOLUME}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.ACTIVE_USER}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.REVENUE}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.LIQUIDATIONS}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.NET_PNL}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
          <RenderChartComponent
            data={chartData}
            stats={stats}
            syncId="perpdex"
            currentChartId={PerpChartTypeEnum.PROFIT_LOSS}
            isLoading={isLoading}
            isExpanded={isExpanded}
            handleToggleExpand={handleToggleExpand}
          />
        </Box>
      )}
    </Box>
  )
}

function RenderChartComponent({
  data,
  stats,
  syncId,
  currentChartId,
  isLoading,
  isExpanded,
  handleToggleExpand,
}: {
  data: PerpDexChartData[] | undefined
  stats?: StatsData
  syncId?: string
  currentChartId: PerpChartTypeEnum | undefined
  isLoading: boolean
  isExpanded?: boolean
  handleToggleExpand?: (chartId: string) => void
}) {
  const component = useMemo(() => {
    switch (currentChartId) {
      case PerpChartTypeEnum.VOLUME:
        return <VolumeChartComponent data={data} syncId={syncId} isExpanded={isExpanded} />
      case PerpChartTypeEnum.ACTIVE_USER:
        return <TraderChartComponent data={data} syncId={syncId} isExpanded={isExpanded} />
      case PerpChartTypeEnum.REVENUE:
        return <RevenueChartComponent data={data} syncId={syncId} isExpanded={isExpanded} />
      case PerpChartTypeEnum.LIQUIDATIONS:
        return <LiquidationChartComponent data={data} syncId={syncId} isExpanded={isExpanded} />
      case PerpChartTypeEnum.NET_PNL:
        return <NetProfitChartComponent data={data} stats={stats} syncId={syncId} isExpanded={isExpanded} />
      case PerpChartTypeEnum.PROFIT_LOSS:
        return <ProfitLossChartComponent data={data} stats={stats} syncId={syncId} isExpanded={isExpanded} />
      default:
        return null
    }
  }, [currentChartId, data, isExpanded, stats, syncId])

  if (!currentChartId) return null
  const config = CHART_CONFIG[currentChartId]

  return (
    <ChartWrapper
      data={data}
      isLoading={isLoading}
      title={config.label}
      chartId={currentChartId}
      isExpanded={isExpanded}
      handleToggleExpand={handleToggleExpand}
    >
      {component}
    </ChartWrapper>
  )
}

function ChartWrapper({
  data,
  isLoading,
  title,
  chartId,
  children,
  isExpanded,
  handleToggleExpand,
}: {
  isLoading: boolean
  data: PerpDexChartData[] | undefined
  title: ReactNode
  chartId: PerpChartTypeEnum
  children: ReactNode
  isExpanded?: boolean
  handleToggleExpand?: (chartId: string) => void
}) {
  const config = CHART_CONFIG[chartId]
  const hasData = !isLoading && !!data?.length
  const noData = !isLoading && data && !data.length

  return (
    <Box
      sx={{
        px: 3,
        pt: 3,
        bg: 'neutral6',
        border: 'small',
        borderColor: 'neutral5',
        borderRadius: '2px',
        position: 'relative',
      }}
    >
      {/* {isLoading ? (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Loading />
        </Flex>
      ) : null} */}
      <Flex alignItems="center" justifyContent="space-between">
        <Type.CaptionBold>{title}</Type.CaptionBold>
        {hasData && !!!!handleToggleExpand && (
          <IconBox
            icon={isExpanded ? <ArrowsIn size={18} /> : <ArrowsOutSimple size={18} />}
            role="button"
            sx={{
              width: 20,
              height: 20,
              display: ['none', 'none', 'none', 'none', 'flex'],
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'sm',
              // border: 'small',
              // borderColor: 'neutral4',
              color: 'neutral3',
              '&:hover': { color: 'neutral1' },
            }}
            onClick={(e: any) => {
              e.stopPropagation()
              handleToggleExpand?.(chartId)
            }}
          />
        )}
      </Flex>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            px: 5,
            py: 3,
            bg: 'neutral6',
          }}
        >
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              '& > *': { flexShrink: 0 },
            }}
          >
            <Image src={logo} sx={{ transform: 'translateY(-80px)' }} height="13px" />
          </Flex>
          {(isLoading || noData) && <Image src={config.noDataImage} width="100%" height="100%" />}
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {noData && (
              <>
                <Type.Caption mb={1} sx={{ fontWeight: 600 }}>
                  <Trans>No Data Yet</Trans>
                </Type.Caption>
                <Type.Small color="neutral2" sx={{ width: '100%', maxWidth: 300 }}>
                  <Trans>This graph will show {config.label} demographics once responses come in</Trans>
                </Type.Small>
              </>
            )}
            {isLoading && <Loading />}
          </Flex>
        </Box>
        <Box sx={{ position: 'relative', zIndex: hasData ? 1 : 0 }}>{children}</Box>
      </Box>
      {/*<Type.Caption mb={3} display="block" color="neutral2">*/}
      {/*  Updated {!!time ? formatLocalRelativeDate(time) : '--'}*/}
      {/*</Type.Caption>*/}
    </Box>
  )
}
