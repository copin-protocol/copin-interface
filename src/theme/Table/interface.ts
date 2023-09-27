import { SystemStyleObject } from '@styled-system/css'
import React, { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import { PaginationProps } from 'theme/Pagination/interface'

export declare type TableSize = 'small' | 'medium' | 'large'
export declare type AlignType = 'left' | 'right' | 'center'

export type ColumnProps<T> = {
  title: ReactNode
  dataIndex?: string
  key?: React.Key
  align?: AlignType
  width?: string | number
  render?: (text: T, index: number) => React.ReactNode
}

export type TableProps<T> = {
  size?: TableSize
  loading?: boolean
  hasHeader?: boolean
  dataSource?: T[]
  minWidth?: string | number
  columns: ColumnProps<T>[]
  pagination?: PaginationProps | false
  footer?: ReactNode
  emptyMessage?: string | ReactNode
  rowSx?: GridProps & SystemStyleObject
  fullHeight?: boolean
}
