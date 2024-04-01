import { ChartBar, ChartLine } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderPnlStatsApi } from 'apis/statisticApi'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

import ChartTraderDailyPnL from './ChartTraderDailyPnL'
import ChartTraderPnL from './ChartTraderPnL'

const ChartTrader = ({
  protocol,
  account,
  timeOption,
  onChangeTime,
}: {
  protocol: ProtocolEnum
  account: string
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
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

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', px: 12, pt: 12, pb: 1 }}>
      {loadingStats && <Loading />}
      {stats && !loadingStats && (
        <>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <Box width={56} />
            <Flex alignItems="center" sx={{ gap: 2 }} mb={1}>
              <Type.Caption color="neutral3">PnL in the past</Type.Caption>
              <TimeDropdown timeOption={timeOption} onChangeTime={onChangeTime} />
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
          <Box flex="1 0 0" mt={1} sx={{ position: 'relative' }}>
            {isBarChart ? (
              <ChartTraderDailyPnL data={stats} isLoading={loadingStats} from={from} to={to} />
            ) : (
              <ChartTraderPnL data={stats} isLoading={loadingStats} from={from} to={to} />
            )}
          </Box>
        </>
      )}
    </Flex>
  )
}

export default ChartTrader
