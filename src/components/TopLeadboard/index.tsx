import { useResponsive } from 'ahooks'
import React from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import Table from 'components/@ui/Table'
import useLeaderboardProvider from 'hooks/features/useLeaderboardProvider'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { formatLocalDate } from 'utils/helpers/format'

import { LeaderboardColumns } from './ColumnsData'

const TopLeaderboard = () => {
  const { sm } = useResponsive()
  const {
    data,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
    lastTimeUpdated,
  } = useLeaderboardProvider()

  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return data?.meta && data.meta.total > 0 ? (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Box
          sx={{
            flex: '1 0 0',
            overflowX: 'auto',
            ...(sm
              ? {}
              : {
                  '& *': {
                    fontSize: '13px !important',
                    lineHeight: '18px !important',
                  },
                }),
          }}
        >
          <Table
            restrictHeight
            data={data?.data}
            columns={LeaderboardColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            tableBodyWrapperSx={{
              table: { borderSpacing: '0' },
              tbody: {
                '& tr': {
                  px: 3,
                },
                '& td:first-child': {
                  pl: 0,
                },
                '& th:last-child': {
                  pr: 3,
                },
              },
            }}
            tableHeadSx={{
              th: {
                pt: 2,
                pb: 12,
              },
              '& th:first-child': {
                pl: 4,
                minWidth: ['90px !important', '90px !important', '85px !important', '85px !important'],
              },
              '& th:last-child': {
                pr: 4,
                minWidth: ['152px !important', '152px !important', '182px !important', '182px !important'],
              },
            }}
            topIndex={3}
          />
        </Box>
        <Flex
          py={1}
          alignItems="center"
          px={3}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ gap: 2, borderTop: 'small', borderColor: 'neutral4' }}
        >
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral2">Last Updated:</Type.Caption>
            <Type.Caption>{formatLocalDate(lastTimeUpdated)}</Type.Caption>
          </Flex>
          <PaginationWithLimit
            currentPage={currentPage}
            currentLimit={currentLimit}
            onPageChange={changeCurrentPage}
            onLimitChange={changeCurrentLimit}
            apiMeta={data?.meta}
            menuPosition="top"
            sx={{ justifyContent: 'flex-end', gap: 2, px: 0 }}
          />
        </Flex>
      </Flex>
    </>
  ) : (
    <NoDataFound />
  )
}

export default TopLeaderboard
