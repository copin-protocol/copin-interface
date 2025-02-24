import { SystemStyleObject } from '@styled-system/css'
import { ReactNode, RefObject } from 'react'
import { GridProps } from 'styled-system'

import { ApiMeta } from 'apis/api'
import { TableSelectHandler } from 'hooks/helpers/useTableSelect'
import { SortTypeEnum } from 'utils/config/enums'

export interface TableSortProps<T> {
  sortBy: keyof T
  sortType: SortTypeEnum
}

export type ColumnData<T = Record<string, any>, K = unknown> = {
  title: ReactNode
  text?: ReactNode
  searchText?: string | string[]
  dataIndex?: keyof T
  key: keyof T | undefined
  style: Record<string, any>
  render?: (data: T, index?: number, externalSource?: K, isChildren?: boolean) => ReactNode
  numDigit?: number
  sortBy?: keyof T
  sortType?: SortTypeEnum
  filterComponent?: ReactNode
}
type ExtractDataType<Type> = Type extends ColumnData<infer T> ? T : never
type ExtractExternalSourceType<Type> = Type extends ColumnData<any, infer K> ? K : never
export type ColumnDataParameter = ExtractDataType<ColumnData>
export type ColumnExternalSourceParameter = ExtractExternalSourceType<ColumnData>
export interface TableProps<T, K> {
  data: T[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  columns: ColumnData<T, K>[]
  footer?: ReactNode
  wrapperSx?: any
  borderWrapperSx?: any
  onClickRow?: (data: T) => void
  renderRowBackground?: (data: T, index: number) => string
  currentSort?: TableSortProps<T>
  changeCurrentSort?: (sort: TableSortProps<T> | undefined) => void
  externalSource?: K
  visibleColumns?: (keyof T)[]
  handleToggleVisibleColumn?: (key: keyof T) => void
  isSelectedAll?: boolean
  handleSelectAll?: TableSelectHandler<T>['handleSelectAll']
  checkIsSelected?: TableSelectHandler<T>['checkIsSelected']
  handleSelect?: TableSelectHandler<T>['handleSelect']
  restrictHeight?: boolean
  containerSx?: any
  scrollRef?: RefObject<HTMLDivElement> | null
  loadingSx?: any
  rowSx?: SystemStyleObject & GridProps
  isInfiniteLoad?: boolean
  tableHeadSx?: any
  tableBodySx?: any
  tableBodyWrapperSx?: any
  checkIsTop?: (data: T) => boolean
  scrollToTopDependencies?: any | null // null === no scroll
  noDataMessage?: ReactNode
  footerData?: T[]
  footerRowSx?: any
  noDataComponent?: ReactNode
  noDataWrapperSx?: any
  getRowChildrenData?: (props: { rowData: T; data: T[] | undefined }) => T[]
  getChildRowKey?: (props: { data: T }) => string
  hasHoverBg?: boolean
}
export type InfiniteTableProps<T, K> = Omit<TableProps<T, K>, 'data'> & { data: T[] | undefined }
