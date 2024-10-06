import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradePnLApi } from 'apis/copyTradeApis'
import BarChartCopierRoi from 'components/@charts/BarChartCopierRoi'
import LineChartPnl from 'components/@charts/LineChartPnL'
import { parseCopyTraderPnLData } from 'components/@charts/LineChartPnL/helpers'
import Divider from 'components/@ui/Divider'
import TimeFilter, { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getDurationFromTimeFilter, getTimeframeFromTimeRange } from 'utils/helpers/transform'

enum ViewEnum {
  Pnl,
  DailyRoi,
}

const ViewEnumLabel = {
  [ViewEnum.Pnl]: 'PNL',
  [ViewEnum.DailyRoi]: 'Daily ROI',
}

const Stats = ({ exchange, copyWalletId }: { exchange: CopyTradePlatformEnum; copyWalletId: string | undefined }) => {
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'filter',
    options: TIME_FILTER_OPTIONS,
    defaultOption: TimeFilterByEnum.S7_DAY.toString(),
  })
  const [view, setView] = useState<ViewEnum>(ViewEnum.DailyRoi)
  const to = useMemo(() => dayjs().utc().valueOf(), [])
  const timeframeDuration = getDurationFromTimeFilter(currentOption?.id)
  const from = useMemo(
    () =>
      dayjs(to)
        .utc()
        .subtract(timeframeDuration + 1, 'day')
        .valueOf(),
    [timeframeDuration, to]
  )
  const timeframe = useMemo(() => getTimeframeFromTimeRange(from, to), [from, to])
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_MY_PNL_DATA, exchange, from, to, timeframe, copyWalletId],
    () =>
      getCopyTradePnLApi({
        from,
        to,
        exchange,
        copyWalletId,
      }),
    {
      retry: 0,
    }
  )

  const filteredFrom = data && data.length > 0 ? Math.max(from, dayjs(data[0].date).utc().valueOf()) : from

  const handleFilterChange = (timeOption: TimeFilterProps) => {
    changeCurrentOption(timeOption)
  }

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Flex justifyContent="space-between" alignItems="center" py={1} px={12}>
        <Dropdown
          placement="bottomLeft"
          buttonSx={{
            border: 'none',
            px: 0,
          }}
          menuSx={{
            width: '100px',
            minWidth: 'auto',
          }}
          menu={
            <>
              <CheckableDropdownItem
                selected={view == ViewEnum.DailyRoi}
                onClick={() => setView(ViewEnum.DailyRoi)}
                text={ViewEnumLabel[ViewEnum.DailyRoi]}
              />
              <CheckableDropdownItem
                selected={view == ViewEnum.Pnl}
                onClick={() => setView(ViewEnum.Pnl)}
                text={ViewEnumLabel[ViewEnum.Pnl]}
              />
            </>
          }
        >
          {ViewEnumLabel[view]}
        </Dropdown>
        <TimeFilter currentFilter={currentOption} handleFilterChange={handleFilterChange} />
      </Flex>
      <Divider isDashed />
      <Box sx={{ flex: '1 0 0', overflow: 'hidden' }}>
        {view === ViewEnum.Pnl && (
          <LineChartPnl
            data={parseCopyTraderPnLData(data)}
            isLoading={isLoading}
            from={filteredFrom}
            to={to}
            isCumulativeData
            balanceTextComponent={Type.H5}
          />
        )}
        {view === ViewEnum.DailyRoi && (
          <BarChartCopierRoi data={data} isLoading={isLoading} from={filteredFrom} to={to} />
        )}
      </Box>
    </Flex>
  )
}

export default Stats
