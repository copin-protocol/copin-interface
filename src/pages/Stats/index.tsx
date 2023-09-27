import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getSystemStatsApi } from 'apis/statisticApi'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import TimeFilter from 'components/@ui/TimeFilter'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import { StatsData } from 'entities/chart.d'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatLocalRelativeDate } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'
import { TimeRange } from 'utils/types'

import {
  CopierChartComponent,
  CopyTradeChartComponent,
  NetProfitChartComponent,
  OrderChartComponent,
  ProfitLossChartComponent,
  TraderChartComponent,
  VolumeChartComponent,
  getChartData,
} from './ChartComponent'
import Overview from './Overview'

export default function Stats() {
  const { searchParams, setSearchParams } = useSearchParams()
  const [timeRange, setTimeRange] = useState<TimeRange>({})
  const [selectingRange, setSelectingRange] = useState(() => {
    return searchParams['selecting_range'] === '1'
  })
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'time-filter',
    options: TIME_FILTER_OPTIONS,
    defaultOption: TimeFilterByEnum.S30_DAY.toString(),
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

  return (
    <>
      <CustomPageTitle title="Stats" />
      <Container p={3}>
        <Flex my={24} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Type.H5 color="neutral8" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
            <Trans>Overview</Trans>
          </Type.H5>
        </Flex>
        <Overview />
        <Flex my={24} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
          <Type.H5 color="neutral8" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
            <Trans>Analytics</Trans>
          </Type.H5>
          <Flex justifyContent="start" alignItems="center" sx={{ gap: 16 }}>
            <TimeFilter
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
        <StatisticChart timeRange={timeRange} />
      </Container>
    </>
  )
}

function StatisticChart({ timeRange }: { timeRange: TimeRange }) {
  const [isPercentView, setIsPercentView] = useState(false)
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_SYSTEM_STATS, timeRange],
    () =>
      getSystemStatsApi({
        from: ignoreDataFrom(dayjs(timeRange.from).utc().valueOf()),
        to: dayjs(timeRange.to).utc().valueOf(),
      }),
    { enabled: timeRange.from !== timeRange.to }
  )
  const chartData = useMemo(() => getChartData({ data }), [data])
  const lastUpdatedTime = useMemo(
    () => (data && data.length > 0 ? data[data.length - 1].statisticAt : dayjs().toISOString()),
    [data]
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

  return (
    <Box>
      <Type.H5 mb={20}>
        <Trans>Volume</Trans>
      </Type.H5>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper isLoading={isLoading} title={<Trans>Volume</Trans>} time={lastUpdatedTime}>
          <VolumeChartComponent data={chartData} syncId="volume_chart" />
        </ChartWrapper>
        <ChartWrapper isLoading={isLoading} title={<Trans>Order</Trans>} time={lastUpdatedTime}>
          <OrderChartComponent data={chartData} syncId="volume_chart" />
        </ChartWrapper>
      </Box>
      <Type.H5 mt={[3, 4]} mb={20}>
        <Trans>Profit & Loss</Trans>
      </Type.H5>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper isLoading={isLoading} title={<Trans>Copiers Net PnL</Trans>} time={lastUpdatedTime}>
          {stats && <NetProfitChartComponent data={chartData} stats={stats} syncId="pnl_chart" />}
        </ChartWrapper>
        <ChartWrapper
          isLoading={isLoading}
          title={<Trans>Copiers Profit vs Loss</Trans>}
          time={lastUpdatedTime}
          isPercentsView={isPercentView}
          togglePercentView={setIsPercentView}
        >
          {stats && (
            <ProfitLossChartComponent data={chartData} stats={stats} isPercentView={isPercentView} syncId="pnl_chart" />
          )}
        </ChartWrapper>
      </Box>
      <Type.H5 mt={[3, 4]} mb={20}>
        <Trans>Copy Statistic</Trans>
      </Type.H5>
      <Box
        mt={24}
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr', '1fr 1fr'],
          gap: 24,
        }}
      >
        <ChartWrapper isLoading={isLoading} title={<Trans>Total Copier</Trans>} time={lastUpdatedTime}>
          {<CopierChartComponent data={chartData} syncId="copy_chart" />}
        </ChartWrapper>
        <ChartWrapper isLoading={isLoading} title={<Trans>Total Copy Trade</Trans>} time={lastUpdatedTime}>
          {<CopyTradeChartComponent data={chartData} syncId="copy_chart" />}
        </ChartWrapper>
        <ChartWrapper isLoading={isLoading} title={<Trans>Total Unique Trader</Trans>} time={lastUpdatedTime}>
          {<TraderChartComponent data={chartData} syncId="copy_chart" />}
        </ChartWrapper>
      </Box>
    </Box>
  )
}

function ChartWrapper({
  isLoading,
  title,
  time,
  children,
  isPercentsView,
  togglePercentView,
}: {
  isLoading: boolean
  title: ReactNode
  time: string
  children: ReactNode
  isPercentsView?: boolean
  togglePercentView?: (value: boolean) => void
}) {
  return (
    <Box sx={{ p: 3, bg: 'neutral5' }}>
      {isLoading ? (
        <Flex minHeight={400} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Loading />
        </Flex>
      ) : null}
      {!isLoading ? (
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <Type.CaptionBold>{title}</Type.CaptionBold>
            {togglePercentView && (
              <Button
                py={2}
                sx={{
                  backgroundColor: isPercentsView ? 'primary1' : 'neutral2',
                  color: 'neutral8',
                  '&:hover': {
                    color: 'neutral4',
                  },
                }}
                type="button"
                onClick={() => togglePercentView(!isPercentsView)}
              >
                %
              </Button>
            )}
          </Flex>
          <Type.Caption mb={4} display="block" color="neutral2">
            Updated {!!time ? formatLocalRelativeDate(time) : '--'}
          </Type.Caption>
          {children}
        </>
      ) : null}
    </Box>
  )
}

const ignoreDataFrom = (from: number) => {
  const fromDate = dayjs(from).utc()
  const ignoreDate = dayjs(new Date(2023, 5, 23)).utc()
  return (fromDate.isAfter(ignoreDate) ? fromDate : ignoreDate).valueOf()
}
