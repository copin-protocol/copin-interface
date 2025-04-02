import { ComponentType, ReactNode } from 'react'

import { StatisticChartData, StatsData } from 'entities/chart'
import { TimeIntervalEnum } from 'utils/config/enums'

import { ChartId } from './config'

export type ChartComponentProps = {
  isActive?: boolean
  isLoading: boolean
  title: ReactNode
  data: StatisticChartData[]
  stats: StatsData
  syncId: string
  lastUpdatedTime: string
  isPercentView?: boolean
  togglePercentView?: (value: boolean) => void
  onChartRenderEnd: (chartId: ChartId) => void
  id: ChartId
  timeType: TimeIntervalEnum
}

export type ChartConfig = {
  id: ChartId
  title: ReactNode
  syncId: string
  component: ComponentType<ChartComponentProps>
}
