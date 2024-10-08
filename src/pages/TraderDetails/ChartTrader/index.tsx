import { ChartBar, ChartLine } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderPnlStatsApi } from 'apis/statisticApi'
import BarChartTraderPnL from 'components/@charts/BarChartTraderPnL'
import LineChartPnL from 'components/@charts/LineChartPnL'
import { parseTraderPnLStatisticData } from 'components/@charts/LineChartPnL/helpers'
import ActiveDot from 'components/@ui/ActiveDot'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
// import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

const ChartTrader = ({
  protocol,
  account,
  timeOption,
}: // onChangeTime,
{
  protocol: ProtocolEnum
  account: string
  timeOption: TimeFilterProps
  // onChangeTime: (option: TimeFilterProps) => void
}) => {
  const [isBarChart, setIsBarChart] = useState(false)
  const to = useMemo(() => dayjs().utc().startOf('day').valueOf(), [])
  const timeframeDuration = getDurationFromTimeFilter(timeOption.id)
  const from = useMemo(() => dayjs(to).utc().subtract(timeframeDuration, 'day').valueOf(), [timeframeDuration, to])

  const { data: stats, isLoading: loadingStats } = useQuery(
    [QUERY_KEYS.GET_TRADER_PNL_STATISTIC, protocol, account, from, to],
    () =>
      getTraderPnlStatsApi({
        from,
        to,
        account,
        protocol,
      }),
    {
      retry: 0,
    }
  )
  const cumulativePnL = useMemo(() => {
    let cumulativePnL = 0
    if (stats) {
      cumulativePnL = stats.reduce((acc, item) => acc + item.pnl, 0)
    }
    return cumulativePnL
  }, [stats])

  const filteredFrom = stats && stats.length > 0 ? Math.max(from, dayjs(stats[0].date).utc().valueOf()) : from

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', px: 12, pt: 12, pb: 1 }}>
      {loadingStats && <Loading />}
      {stats && !loadingStats && (
        <>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <Box width={56} />
            <Flex alignItems="center" sx={{ gap: 2 }} mb={1}>
              {isBarChart ? (
                <Flex flexWrap="wrap" alignItems="center" color="neutral3" sx={{ gap: 2 }}>
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
                    <Type.Caption color={cumulativePnL > 0 ? 'green1' : cumulativePnL < 0 ? 'red2' : 'neutral1'}>{`${
                      cumulativePnL < 0 ? '-' : ''
                    }$${formatNumber(Math.abs(cumulativePnL), 2)}`}</Type.Caption>
                  </Flex>
                </Flex>
              ) : (
                <Type.Caption color="neutral3">PnL</Type.Caption>
              )}
              {/* <TimeDropdown timeOption={timeOption} onChangeTime={onChangeTime} /> */}
            </Flex>
            <Flex alignItems="center">
              <ButtonWithIcon
                sx={{ border: 'none' }}
                icon={
                  <Box color={!isBarChart ? 'primary1' : 'neutral3'}>
                    <ChartLine size={20} />
                  </Box>
                }
                size={28}
                variant="info"
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
                variant="info"
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
              <Tooltip id="trader_line_chart" place="top" type="dark" effect="solid">
                <Type.Caption>Line Chart</Type.Caption>
              </Tooltip>
              <Tooltip id="trader_bar_chart" place="top" type="dark" effect="solid">
                <Type.Caption>Bar Chart</Type.Caption>
              </Tooltip>
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
                  data={parseTraderPnLStatisticData(stats)}
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
