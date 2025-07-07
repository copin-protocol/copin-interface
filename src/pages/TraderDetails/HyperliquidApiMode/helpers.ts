import dayjs from 'dayjs'

import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { TimeFilterByEnum } from 'utils/config/enums'

type PnlPoint = [number, string]

const PERP_KEY_MAP: Record<string, string> = {
  [TimeFilterByEnum.LAST_24H]: 'perpDay',
  [TimeFilterByEnum.S7_DAY]: 'perpWeek',
  [TimeFilterByEnum.S30_DAY]: 'perpMonth',
  [TimeFilterByEnum.ALL_TIME]: 'perpAllTime',
}

const COMBINED_KEY_MAP: Record<string, string> = {
  [TimeFilterByEnum.LAST_24H]: 'day',
  [TimeFilterByEnum.S7_DAY]: 'week',
  [TimeFilterByEnum.S30_DAY]: 'month',
  [TimeFilterByEnum.ALL_TIME]: 'allTime',
}

export function formatChartData(
  hlPortfolioData: any,
  timeOption: TimeFilterByEnum,
  isAccountValue: boolean,
  isCombined: boolean
) {
  if (!hlPortfolioData) return []

  const key = isCombined ? COMBINED_KEY_MAP[timeOption] : PERP_KEY_MAP[timeOption]
  const historyKey = isAccountValue ? 'accountValueHistory' : 'pnlHistory'
  const found = hlPortfolioData.find(([k]: [string, any]) => k === key)
  if (!found) return []

  const historyValue: PnlPoint[] = found[1]?.[historyKey] || []

  return historyValue.map(([timestamp, pnl]) => ({
    fullDate: dayjs(Number(timestamp)).format(DAYJS_FULL_DATE_FORMAT),
    time: Number(timestamp),
    pnl: Number(pnl),
  }))
}
