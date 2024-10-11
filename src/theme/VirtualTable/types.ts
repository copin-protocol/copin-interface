import { ReactNode, RefObject } from 'react'

import { ApiMeta } from 'apis/api'
import { ColumnData, TableSortProps } from 'theme/Table/types'

export interface VirtualTableProps<T, K> {
  data: T[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  columns: ColumnData<T, K>[]
  footer?: ReactNode
  onClickRow?: (data: T) => void
  currentSort?: TableSortProps<T>
  changeCurrentSort?: (sort: TableSortProps<T> | undefined) => void
  externalSource?: K
  containerSx?: any
  scrollRef?: RefObject<HTMLDivElement> | null
  loadingSx?: any
  isInfiniteLoad?: boolean
  scrollToTopDependencies?: any[]
  noDataMessage?: ReactNode
}
