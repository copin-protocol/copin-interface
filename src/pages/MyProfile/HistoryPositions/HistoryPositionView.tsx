import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyHistoryPositions from 'components/@position/CopyHistoryPositions'
import { LayoutType } from 'components/@position/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import { CopyWalletData } from 'entities/copyWallet'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { PaginationWithLimit } from 'theme/Pagination'
import { TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, TOOLTIP_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

export default function HistoryPositionsView({
  selectedTraders,
  deletedTraders,
  selectedStatus,
  selectedWallets,
  currentSort,
  changeCurrentSort,
  currentPage,
  currentLimit,
  changeCurrentPage,
  changeCurrentLimit,
  layoutType,
  excludingColumnKeys,
}: {
  selectedTraders: string[] | undefined
  deletedTraders: string[] | undefined
  selectedStatus: PositionStatusEnum[] | undefined
  selectedWallets: CopyWalletData[] | undefined
  currentSort: TableSortProps<CopyPositionData> | undefined
  changeCurrentSort: (sort: TableSortProps<CopyPositionData> | undefined) => void
  currentPage: number
  currentLimit: number
  changeCurrentPage: (page: number) => void
  changeCurrentLimit: (limit: number) => void
  layoutType: LayoutType
  excludingColumnKeys?: (keyof CopyPositionData)[]
}) {
  const { myProfile } = useMyProfileStore()

  const _queryParams: GetMyPositionsParams = useMemo(
    () => ({
      limit: currentLimit,
      offset: pageToOffset(currentPage, currentLimit),
      sortBy: currentSort?.sortBy,
      sortType: currentSort?.sortType,
      status: (selectedStatus?.length ?? 0) > 1 ? undefined : selectedStatus,
    }),
    [currentLimit, currentPage, currentSort?.sortBy, currentSort?.sortType, selectedStatus]
  )
  const _queryBody: GetMyPositionRequestBody = useMemo(
    () => ({
      traders: selectedTraders,
      copyWalletIds: selectedWallets?.map((wallet) => wallet.id),
    }),
    [selectedTraders, selectedWallets]
  )
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, currentPage, myProfile?.id],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <>
      <Box flex="1 0 0" overflow="hidden">
        <CopyHistoryPositions
          data={data?.data}
          isLoading={isLoading}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          onClosePositionSuccess={refetch}
          deletedTraders={deletedTraders ?? []}
          layoutType={layoutType}
          excludingColumnKeys={excludingColumnKeys}
        />
      </Box>
      <PaginationWithLimit
        currentLimit={currentLimit}
        onLimitChange={changeCurrentLimit}
        currentPage={currentPage}
        onPageChange={changeCurrentPage}
        apiMeta={data?.meta}
        sx={{ py: 1 }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}>
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          Reverse Copy
        </Type.Caption>
      </Tooltip>
    </>
  )
}
