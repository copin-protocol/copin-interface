import React, { ReactNode } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

export declare type TableSize = 'small' | 'medium' | 'large'
export declare type AlignType = 'left' | 'right' | 'center'

export type ColumnProps<T, K = unknown> = {
  title: ReactNode
  key?: React.Key
  align?: AlignType
  columnSx?: any
  render?: (text: T, index: number, externalSource?: K) => React.ReactNode
}

export type TableProps<T, K = unknown> = {
  loading?: boolean
  dataSource?: T[]
  externalSource?: K
  minWidth?: string | number
  columns: ColumnProps<T, K>[]
  header?: ReactNode
  footer?: ReactNode
  renderExternal?: (data: T) => ReactNode
}

function Table<T, K = unknown>({
  loading = false,
  minWidth = '650px',
  dataSource,
  externalSource,
  columns,
  footer,
  header,
  renderExternal,
}: TableProps<T, K>) {
  if (loading) {
    return <Loading />
  }

  return (
    <Box sx={{}}>
      {header ? <Box mb={24}>{header}</Box> : null}
      <Box sx={{ overflowX: 'auto' }}>
        <Flex
          minWidth={minWidth}
          justifyContent="space-between"
          color="neutral3"
          pb={2}
          px={3}
          sx={{ borderBottom: '1px solid', borderColor: 'neutral4' }}
        >
          {columns &&
            columns.map((column) => (
              <Box key={column.key} textAlign={column.align} sx={column.columnSx}>
                <Type.Caption color="neutral3">{column.title}</Type.Caption>
              </Box>
            ))}
        </Flex>

        <Flex flexDirection="column" minWidth={minWidth} sx={{ gap: 2 }}>
          {!!dataSource &&
            dataSource.map((data: any, index: any) => (
              <Box key={index} sx={{ bg: 'neutral5', px: 3, py: 2 }}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  pb={2}
                  sx={{ borderBottom: '1px solid', borderColor: 'neutral4' }}
                >
                  {columns &&
                    columns.map((column) => (
                      <Box key={column.key} textAlign={column.align} sx={column.columnSx}>
                        <Type.Body color="neutral2">
                          {column?.render && column.render(data, index, externalSource)}
                        </Type.Body>
                      </Box>
                    ))}
                </Flex>
                {renderExternal && renderExternal(data)}
              </Box>
            ))}
          {loading && <Loading />}
          {!!dataSource && dataSource.length === 0 && (
            <Box sx={{ bg: 'neutral8', borderRadius: 'sm' }}>
              <NoDataFound />
            </Box>
          )}
        </Flex>
      </Box>
      {footer ? (
        <Flex justifyContent="center" mt={3}>
          {footer}
        </Flex>
      ) : null}
    </Box>
  )
}

export default Table
