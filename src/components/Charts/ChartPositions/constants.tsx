import { TimeframeEnum } from 'utils/config/enums'

export const TIMEFRAME_OPTIONS: TimeframeEnum[] = [
  TimeframeEnum.M5,
  TimeframeEnum.M15,
  TimeframeEnum.H1,
  TimeframeEnum.H4,
]

export const TIMEFRAME_OPTIONS_EXPANDED: TimeframeEnum[] = [...TIMEFRAME_OPTIONS, TimeframeEnum.D1]
