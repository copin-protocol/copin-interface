import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getSystemStatsApi } from 'apis/statisticApi'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import TimeFilter from 'components/@ui/TimeFilter'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { StatsData } from 'entities/chart.d'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { TimeFilterByEnum, TimeIntervalEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatLocalRelativeDate } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'
import { TimeRange } from 'utils/types'

import Overview from './Overview'
import { CHART_CONFIG_MAPPING, CHART_ORDER, ChartId, TIME_TYPE_OPTIONS } from './config'
import { getChartData } from './helper'
import { summarizeMonthly } from './helper'
import { ChartComponentProps, ChartConfig } from './types'

export default function StatsPage() {
  const { searchParams, setSearchParams } = useSearchParams()
  const [timeRange, setTimeRange] = useState<TimeRange>({})
  const [selectingRange, setSelectingRange] = useState(() => {
    return searchParams['selecting_range'] === '1'
  })
  const timeType = (searchParams['type'] as TimeIntervalEnum) ?? TimeIntervalEnum.DAILY
  const changeTimeType = (type: TimeIntervalEnum) => setSearchParams({ ['type']: type })
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'time-filter',
    options: TIME_FILTER_OPTIONS,
    defaultOption: TimeFilterByEnum.S30_DAY.toString(),
    optionNameToBeDelete: ['time_range', 'selecting_range'],
  })
  const duration = getDurationFromTimeFilter(
    timeType === TimeIntervalEnum.MONTHLY ? TimeFilterByEnum.ALL_TIME : currentOption.id
  )
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

  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="Copin Stats" />
      <Container p={3}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Type.Head color="neutral8" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
            <Trans>Overview</Trans>
          </Type.Head>
        </Flex>
        <Overview />
        <Flex
          my={3}
          sx={{
            alignItems: 'center',
            justifyContent: ['end', 'space-between'],
            flexWrap: 'wrap',
            columnGap: 3,
            rowGap: 0,
          }}
        >
          <Box sx={{ flex: '1 0 auto', order: 0 }}>
            <Type.Head color="neutral8" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
              <Trans>Analytics</Trans>
            </Type.Head>
          </Box>
          {timeType === TimeIntervalEnum.DAILY && (
            <Flex sx={{ alignItems: 'center', gap: 3, flexShrink: 0, order: [2, 1] }}>
              <TimeFilter
                currentFilter={selectingRange ? null : currentOption}
                handleFilterChange={(option) => {
                  setSelectingRange(false)
                  changeCurrentOption(option)
                }}
              />

              {!!timeRange && (
                <Flex sx={{ alignItems: 'center', columnGap: 2, rowGap: 0 }}>
                  <Box height={16} flex="0 0 1px" bg="neutral2"></Box>
                  <Box sx={{ flex: '0 0 auto' }}>
                    <RangeFilter
                      anchor="right"
                      isRangeSelection={selectingRange}
                      from={timeRange.from}
                      to={timeRange.to}
                      changeTimeRange={(range) => {
                        setSelectingRange(true)
                        handleSetTimeRange(range)
                      }}
                    />
                  </Box>
                </Flex>
              )}
            </Flex>
          )}

          <Flex
            sx={{
              height: 30,
              alignItems: 'center',
              borderRadius: 20,
              bg: 'neutral5',
              px: 3,
              overflow: 'hidden',
              order: [1, 2],
            }}
          >
            <TimeFilter
              currentFilter={TIME_TYPE_OPTIONS.find((v) => v.value === timeType)}
              options={TIME_TYPE_OPTIONS}
              handleFilterChange={(option) => {
                changeTimeType(option.value)
                setSelectingRange(false)
              }}
            />
          </Flex>
        </Flex>
        {/* Sometime recreate element is better performance than update element, use key because of this */}
        <StatisticChart key={timeType} timeRange={timeRange} timeType={timeType} />
      </Container>
    </SafeComponentWrapper>
  )
}

function StatisticChart({ timeRange, timeType }: { timeRange: TimeRange; timeType: TimeIntervalEnum }) {
  const [isPercentView, setIsPercentView] = useState(false)
  const { data: _data, isLoading } = useQuery(
    [QUERY_KEYS.GET_SYSTEM_STATS, timeRange],
    () =>
      getSystemStatsApi({
        from: ignoreDataFrom(dayjs(timeRange.from).utc().valueOf()),
        to: dayjs(timeRange.to).utc().valueOf(),
      }),
    { enabled: timeRange.from !== timeRange.to }
  )
  const data = useMemo(() => {
    return _data ? (timeType === TimeIntervalEnum.DAILY ? _data : summarizeMonthly(_data)) : undefined
  }, [_data, timeType])
  const chartData = useMemo(() => getChartData({ data, timeType }), [data, timeType])
  const lastUpdatedTime = useMemo(
    () => (_data && _data.length > 0 ? _data[_data.length - 1].statisticAt : dayjs().toISOString()),
    [_data]
  )

  const stats = useMemo(() => {
    let stats
    if (data && chartData) {
      const maxProfit = maxBy(chartData, (item) => item.totalProfit)?.totalProfit ?? 0
      const maxLoss = minBy(chartData, (item) => item.totalLoss)?.totalLoss ?? 0
      const maxProfitLoss = Math.max(maxProfit, -maxLoss)
      const minProfitLoss = Math.min(maxProfit, -maxLoss)

      const maxPnl = maxBy(chartData, (item) => item.pnl)?.pnl ?? 0
      const minPnl = minBy(chartData, (item) => item.pnl)?.pnl ?? 0
      const maxCurrentCumulativePnl = maxBy(chartData, (item) => item.pnlCumulative)?.pnlCumulative ?? 0
      const minCurrentCumulativePnl = minBy(chartData, (item) => item.pnlCumulative)?.pnlCumulative ?? 0

      const currentProfitCumulative = chartData[chartData.length - 1]?.profitCumulative ?? 0
      const currentLossCumulative = chartData[chartData.length - 1]?.lossCumulative ?? 0

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

  const [chartIsRendered, setChartIsRendered] = useState<ChartId[]>([])
  const onChartRenderEnd = useCallback((chartId: ChartId) => {
    setChartIsRendered((prev) => (prev.includes(chartId) ? prev : [...prev, chartId]))
  }, [])
  const chartComponentProps: ChartComponentProps = {
    id: ChartId.VOLUME,
    isLoading,
    title: '',
    data: chartData,
    stats: stats ?? ({} as any),
    syncId: '',
    lastUpdatedTime,
    isPercentView,
    togglePercentView: undefined,
    onChartRenderEnd,
    timeType,
  }

  const chartToRender = CHART_ORDER.find((v) => !chartIsRendered.includes(v))
  const chartIsActiveFn = (chartId: ChartId) => chartToRender === chartId || chartIsRendered.includes(chartId)
  const prevData = useRef(_data)
  useEffect(() => {
    if (prevData.current === data) return
    prevData.current = data
    setChartIsRendered([])
  }, [data])
  return (
    <Box>
      <Type.Head>
        <Trans>Volume</Trans>
      </Type.Head>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.VOLUME]}
          isActive={chartIsActiveFn(ChartId.VOLUME)}
        />
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.ORDERS]}
          isActive={chartIsActiveFn(ChartId.ORDERS)}
        />
      </Box>
      <Type.Head mt={[3, 4]}>
        <Trans>Profit & Loss</Trans>
      </Type.Head>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.PNL]}
          isActive={chartIsActiveFn(ChartId.PNL)}
        />
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.PROFIT_LOSS]}
          isActive={chartIsActiveFn(ChartId.PROFIT_LOSS)}
          togglePercentView={setIsPercentView}
        />
      </Box>
      <Type.Head mt={[3, 4]}>
        <Trans>Copy Statistic</Trans>
      </Type.Head>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.ACTIVE_USER]}
          isActive={chartIsActiveFn(ChartId.ACTIVE_USER)}
        />
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.COPY_TRADES]}
          isActive={chartIsActiveFn(ChartId.COPY_TRADES)}
        />
        <ChartWrapper
          {...chartComponentProps}
          {...CHART_CONFIG_MAPPING[ChartId.UNIQUE_TRADER]}
          isActive={chartIsActiveFn(ChartId.UNIQUE_TRADER)}
        />
      </Box>
    </Box>
  )
}

const ChartWrapper = memo(function ChartWrapper(props: ChartComponentProps & ChartConfig) {
  const {
    isActive,
    isLoading,
    isPercentView,
    title,
    lastUpdatedTime,
    component: ChartComponent,
    togglePercentView,
  } = props

  return (
    <Box sx={{ p: isActive ? 3 : 0, bg: 'neutral5', minHeight: 400 }}>
      {isLoading || !isActive ? (
        <Flex minHeight={400} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Loading />
        </Flex>
      ) : null}
      {!isLoading && isActive ? (
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <Type.CaptionBold>{title}</Type.CaptionBold>
            {togglePercentView && (
              <Button variant="outline" sx={{ py: 1 }} type="button" onClick={() => togglePercentView(!isPercentView)}>
                %
              </Button>
            )}
          </Flex>
          <Type.Caption mb={4} display="block" color="neutral2">
            Updated {!!lastUpdatedTime ? formatLocalRelativeDate(lastUpdatedTime) : '--'}
          </Type.Caption>
          {isActive && <ChartComponent {...props} />}
        </>
      ) : null}
    </Box>
  )
})

const ignoreDataFrom = (from: number) => {
  const fromDate = dayjs(from).utc()
  const ignoreDate = dayjs(new Date(2023, 5, 23)).utc()
  return (fromDate.isAfter(ignoreDate) ? fromDate : ignoreDate).valueOf()
}
