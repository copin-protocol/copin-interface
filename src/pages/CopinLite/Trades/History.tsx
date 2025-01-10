import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyHistoryPositions from 'components/@position/CopyHistoryPositions'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import { TradesTab } from './types'

const LiteHistory = ({ currentTab }: { currentTab: string }) => {
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    limitName: URL_PARAM_KEYS.LITE_HISTORY_LIMIT,
    pageName: URL_PARAM_KEYS.LITE_HISTORY_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  })
  const _queryParams: GetMyPositionsParams = useMemo(
    () => ({
      limit: currentLimit,
      offset: pageToOffset(currentPage, currentLimit),
      status: [PositionStatusEnum.CLOSE],
    }),
    [currentLimit, currentPage]
  )
  const _queryBody: GetMyPositionRequestBody = useMemo(
    () => ({
      copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
    }),
    [embeddedWallet]
  )
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, currentPage, embeddedWallet?.id],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      enabled: currentTab == TradesTab.History,
      retry: 0,
      keepPreviousData: true,
    }
  )
  return (
    <Flex flexDirection="column" height="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          <Box flex="1 0 0" overflow="hidden">
            <CopyHistoryPositions
              layoutType="lite"
              data={data?.data}
              isLoading={isLoading}
              currentSort={undefined}
              changeCurrentSort={undefined}
              deletedTraders={[]}
              onClosePositionSuccess={refetch}
            />
          </Box>
          <PaginationWithLimit
            currentLimit={currentLimit}
            onLimitChange={changeCurrentLimit}
            currentPage={currentPage}
            onPageChange={changeCurrentPage}
            apiMeta={data?.meta}
            sx={{ py: 2 }}
          />
        </>
      )}
    </Flex>
  )
}

export default LiteHistory
