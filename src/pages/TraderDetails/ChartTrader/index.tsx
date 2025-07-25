import { ChartBar, ChartLine } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderPnlStatsApi } from 'apis/statisticApi'
import BarChartTraderPnL from 'components/@charts/BarChartTraderPnL'
import LineChartPnL from 'components/@charts/LineChartPnL'
import { parseTraderPnLStatisticData } from 'components/@charts/LineChartPnL/helpers'
import ActiveDot from 'components/@ui/ActiveDot'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import useTraderProfitStore from 'hooks/store/useTraderProfitStore'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

const ChartTrader = ({
  protocol,
  account,
  timeOption,
  onChangeTime,
  isShowTimeFilter = true,
  chartTraderSx,
}: {
  protocol: ProtocolEnum
  account: string
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  isShowTimeFilter?: boolean
  chartTraderSx?: any
}) => {
  const { unrealisedPnl } = useTraderProfitStore()
  const [isBarChart, setIsBarChart] = useState(false)
  const to = useMemo(() => dayjs().utc().valueOf(), [])
  const timeframeDuration = getDurationFromTimeFilter(timeOption.id)
  const from = useMemo(
    () => dayjs(to).utc().startOf('day').subtract(timeframeDuration, 'day').valueOf(),
    [timeframeDuration, to]
  )

  const { data: stats, isLoading: loadingStats } = useQuery(
    [QUERY_KEYS.GET_TRADER_PNL_STATISTIC, protocol, account, from, to],
    () =>
      getTraderPnlStatsApi({
        from,
        to,
        account,
        protocol,
        isFill: timeOption.id !== TimeFilterByEnum.ALL_TIME,
      }),
    {
      retry: 0,
      refetchInterval: 60_000,
      select: (data) => {
        if (protocol === ProtocolEnum.HYPERLIQUID) {
          return data.map((item, index) => {
            return {
              ...item,
              unrealisedPnl: index < data.length - 1 ? item.unrealisedPnl ?? 0 : unrealisedPnl,
            }
          })
        }

        return data
      },
    }
  )
  const cumulativePnL = useMemo(() => {
    let cumulativePnL = 0
    if (stats) {
      cumulativePnL = stats.reduce((acc, item) => acc + item.realisedPnl + item.unrealisedPnl, 0)
    }
    return cumulativePnL
  }, [stats])

  const filteredFrom = stats && stats.length > 0 ? Math.max(from, dayjs(stats[0].date).utc().valueOf()) : from

  const chartData = useMemo(() => {
    return parseTraderPnLStatisticData(stats)
  }, [stats])

  const { lg } = useResponsive()
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', px: 12, pt: 12, pb: 1, ...chartTraderSx }}>
      {loadingStats && <Loading />}
      {stats && !loadingStats && (
        <>
          <Flex width="100%" flexDirection={['column', 'column', 'column', 'column', 'row']} alignItems="start">
            {isBarChart && (
              <Flex
                flexWrap="wrap"
                alignItems="center"
                color="neutral3"
                width="100%"
                sx={{
                  minWidth: lg ? '230px' : 'auto',
                  pl: '12px',
                  gap: 2,
                  order: [2, 2, 2, 2, 1],
                }}
              >
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <ActiveDot color="green1" />
                  <Type.Caption>Daily Profit</Type.Caption>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <ActiveDot color="red2" />
                  <Type.Caption>Daily Loss</Type.Caption>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <ActiveDot color={`${themeColors.red1}80`} />
                  <Type.Caption>Daily Fees</Type.Caption>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <ActiveDot color="orange1" />
                  <Type.Caption>Cumulative PnL: </Type.Caption>
                  <Type.Caption color={cumulativePnL > 0 ? 'green1' : cumulativePnL < 0 ? 'red2' : 'neutral1'}>
                    {`${cumulativePnL < 0 ? '-' : ''}$${formatNumber(Math.abs(cumulativePnL), 2)}`}
                  </Type.Caption>
                </Flex>
              </Flex>
            )}
            <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ order: [1, 1, 1, 1, 2] }}>
              <Box display={['block', 'block', 'block', 'block', 'none']}>
                {isShowTimeFilter && (
                  <TimeDropdown
                    timeOption={timeOption}
                    onChangeTime={onChangeTime}
                    menuSx={{ transform: 'translateX(10px)' }}
                  />
                )}
              </Box>
              <Box width={56} display={['none', 'none', 'none', 'none', 'block']} />
              {!isBarChart && (
                <Type.Caption color="neutral3" sx={{ textAlign: 'center' }}>
                  PnL
                </Type.Caption>
              )}
              <Flex alignItems="center">
                <ButtonWithIcon
                  sx={{ border: 'none' }}
                  icon={
                    <Box color={!isBarChart ? 'primary1' : 'neutral3'}>
                      <ChartLine size={20} />
                    </Box>
                  }
                  size={28}
                  variant="ghost"
                  p={1}
                  block
                  onClick={() => {
                    setIsBarChart(false)
                  }}
                  data-tip="React-tooltip"
                  data-tooltip-id="trader_line_chart"
                  data-tooltip-offset={8}
                />
                <ButtonWithIcon
                  icon={
                    <Box color={isBarChart ? 'primary1' : 'neutral3'}>
                      <ChartBar size={20} />
                    </Box>
                  }
                  size={28}
                  variant="ghost"
                  p={1}
                  block
                  onClick={() => {
                    setIsBarChart(true)
                  }}
                  sx={{ border: 'none' }}
                  data-tip="React-tooltip"
                  data-tooltip-id="trader_bar_chart"
                  data-tooltip-offset={8}
                />
                <Tooltip id="trader_line_chart">
                  <Type.Caption>Line Chart</Type.Caption>
                </Tooltip>
                <Tooltip id="trader_bar_chart">
                  <Type.Caption>Bar Chart</Type.Caption>
                </Tooltip>
              </Flex>
            </Flex>
          </Flex>
          <Box flex="1 0 0" mt={1} sx={{ position: 'relative' }} id={ELEMENT_IDS.TRADER_CHART_PNL}>
            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  visibility: isBarChart ? 'visible' : 'hidden',
                }}
              >
                <BarChartTraderPnL data={stats} isLoading={loadingStats} from={filteredFrom} to={to} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  visibility: isBarChart ? 'hidden' : 'visible',
                }}
              >
                <LineChartPnL
                  data={chartData}
                  isCumulativeData={false}
                  isLoading={loadingStats}
                  from={filteredFrom}
                  to={to}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Flex>
  )
}

export default ChartTrader
