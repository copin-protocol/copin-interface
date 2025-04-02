import { Trans } from '@lingui/macro'
import { ComponentType, ReactNode } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { TimeIntervalEnum } from 'utils/config/enums'

import {
  CopierChartComponent,
  CopyTradeChartComponent,
  NetProfitChartComponent,
  OrderChartComponent,
  ProfitLossChartComponent,
  TraderChartComponent,
  VolumeChartComponent,
} from './ChartComponent'
import { ChartComponentProps } from './types'

export enum ChartId {
  VOLUME = 'VOLUME',
  ORDERS = 'ORDERS',
  PNL = 'PNL',
  PROFIT_LOSS = 'PROFIT_LOSS',
  ACTIVE_USER = 'ACTIVE_USER',
  COPY_TRADES = 'COPY_TRADES',
  UNIQUE_TRADER = 'UNIQUE_TRADER',
}
export const CHART_ORDER = [
  ChartId.VOLUME,
  ChartId.ORDERS,
  ChartId.PNL,
  ChartId.PROFIT_LOSS,
  ChartId.ACTIVE_USER,
  ChartId.COPY_TRADES,
  ChartId.UNIQUE_TRADER,
]
type ChartConfig = {
  id: ChartId
  title: ReactNode
  syncId: string
  component: ComponentType<ChartComponentProps>
}
export const CHART_CONFIG_MAPPING: Record<ChartId, ChartConfig> = {
  [ChartId.VOLUME]: {
    id: ChartId.VOLUME,
    title: <Trans>VOLUME</Trans>,
    syncId: 'volume_chart',
    component: VolumeChartComponent,
  },
  [ChartId.ORDERS]: {
    id: ChartId.ORDERS,
    title: <Trans>ORDERS</Trans>,
    syncId: 'volume_chart',
    component: OrderChartComponent,
  },
  [ChartId.PNL]: {
    id: ChartId.PNL,
    title: <Trans>NET PNL</Trans>,
    syncId: 'pnl_chart',
    component: NetProfitChartComponent,
  },
  [ChartId.PROFIT_LOSS]: {
    id: ChartId.PROFIT_LOSS,
    title: <Trans>PROFIT VS LOSS</Trans>,
    syncId: 'pnl_chart',
    component: ProfitLossChartComponent,
  },
  [ChartId.ACTIVE_USER]: {
    id: ChartId.ACTIVE_USER,
    title: <Trans>ACTIVE USERS</Trans>,
    syncId: 'copy_chart',
    component: CopierChartComponent,
  },
  [ChartId.COPY_TRADES]: {
    id: ChartId.COPY_TRADES,
    title: <Trans>COPY TRADES</Trans>,
    syncId: 'copy_chart',
    component: CopyTradeChartComponent,
  },
  [ChartId.UNIQUE_TRADER]: {
    id: ChartId.UNIQUE_TRADER,
    title: <Trans>UNIQUE TRADERS</Trans>,
    syncId: 'copy_chart',
    component: TraderChartComponent,
  },
}

export const TIME_TYPE_OPTIONS: TimeFilterProps<TimeIntervalEnum, TimeIntervalEnum>[] = [
  {
    id: TimeIntervalEnum.DAILY,
    text: <Trans>Daily</Trans>,
    sort_by: TimeIntervalEnum.DAILY,
    value: TimeIntervalEnum.DAILY,
  },
  // {
  //   id: TimeIntervalEnum.MONTHLY,
  //   text: <Trans>Monthly</Trans>,
  //   sort_by: TimeIntervalEnum.MONTHLY,
  //   value: TimeIntervalEnum.MONTHLY,
  // },
]
