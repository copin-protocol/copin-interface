import { ReactNode } from 'react'

import { SortTypeEnum } from 'utils/config/enums'
import { FilterCondition } from 'utils/types'

export type TableSettings<T, K = unknown> = {
  style: any
  text?: ReactNode
  label: ReactNode
  unit?: string
  sortBy?: keyof T
  visible: boolean
  filter?: FilterCondition
  id: keyof T
  freezeLeft?: number
  freezeIndex?: number
  render?: (text: T, index?: number, externalSource?: K) => React.ReactNode
  searchText?: string
}

export type ExternalTraderListSource = {
  traderFavorites?: string[]
  onToggleFavorite?: (account: string) => void
  isMarketsLeft?: boolean
}

export type TableSettingsProps<T> = TableSettings<T, ExternalTraderListSource>[]

export interface TraderListSortProps<T> {
  sortBy: keyof T
  sortType: SortTypeEnum
}
export interface TraderListPagination {
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
}

export interface CustomizeColumnsState {
  visibleColumns: string[]
  setVisibleColumns: (data: string[]) => void
}
