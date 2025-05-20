import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React from 'react'

import { ApiListResponse } from 'apis/api'
import { AlertLogData } from 'entities/alertLog'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Flex } from 'theme/base'

import CustomLogMobile from './CustomLogMobile'
import { ExternalSource } from './configs'

export default function CustomLogs({
  data,
  isLoading = false,
  currentSort,
  changeCurrentSort,
  columns,
  externalSource,
}: {
  data?: ApiListResponse<AlertLogData>
  isLoading?: boolean
  currentSort?: TableSortProps<AlertLogData>
  changeCurrentSort?: (sort?: TableSortProps<AlertLogData>) => void
  columns: ColumnData<AlertLogData, ExternalSource>[]
  externalSource?: ExternalSource
}) {
  const { lg } = useResponsive()

  return (
    <Flex flex={1} flexDirection="column" sx={{ overflow: 'hidden' }}>
      {lg ? (
        <Table
          data={data?.data}
          restrictHeight
          columns={columns}
          externalSource={externalSource}
          isLoading={isLoading}
          // tableHeadSx={{ th: { borderBottom: 'none' } }}
          noDataMessage={<Trans>No Activity Found</Trans>}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child, td:last-child': {
                pr: 3,
              },
            },
          }}
        />
      ) : (
        <CustomLogMobile data={data?.data} isLoading={isLoading} externalSource={externalSource} />
      )}
    </Flex>
  )
}
