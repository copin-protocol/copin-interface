import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradePnLApi } from 'apis/copyTradeApis'
import Divider from 'components/@ui/Divider'
import TimeFilter, { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getDurationFromTimeFilter, getTimeframeFromTimeRange } from 'utils/helpers/transform'

import ChartCopierPnL from './ChartCopierPnL'
import ChartDailyROI from './ChartDailyROI'

enum ViewEnum {
  Pnl,
  DailyRoi,
}

const ViewEnumLabel = {
  [ViewEnum.Pnl]: 'PNL',
  [ViewEnum.DailyRoi]: 'Daily ROI',
}

const Stats = ({ exchange, copyWalletId }: { exchange: CopyTradePlatformEnum; copyWalletId: string | undefined }) => {
  const { currentOption, changeCurrentOption } = useOptionChange({ optionName: 'filter', options: TIME_FILTER_OPTIONS })
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

  return (
    <>
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
        <TimeFilter currentFilter={currentOption} handleFilterChange={changeCurrentOption} />
      </Flex>
      <Divider isDashed />
      <Box
        height={['auto', 'auto', 'auto', 'auto', '100%']}
        sx={{ overflow: [undefined, undefined, undefined, undefined, 'auto'] }}
      >
        {view === ViewEnum.Pnl && <ChartCopierPnL data={data} isLoading={isLoading} from={from} to={to} />}
        {view === ViewEnum.DailyRoi && <ChartDailyROI data={data} isLoading={isLoading} from={from} to={to} />}
      </Box>
    </>
  )
}

export default Stats
