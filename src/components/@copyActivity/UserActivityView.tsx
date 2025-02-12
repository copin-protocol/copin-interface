import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useQuery } from 'react-query'

import { getUserActivityLogsApi } from 'apis/activityLogApis'
import CopyTradePositionDetails from 'components/@position/CopyPositionDetails'
import Container from 'components/@ui/Container'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { UserActivityData } from 'entities/user'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useMyProfileStore from 'hooks/store/useMyProfile'
import IconButton from 'theme/Buttons/IconButton'
import { PaginationWithLimit } from 'theme/Pagination'
import RcDrawer from 'theme/RcDrawer'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { QUERY_KEYS, TOOLTIP_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { pageToOffset } from 'utils/helpers/transform'

import ListActivityMobile from './ListActivityMobile'
import { ExternalSource, getUserActivityColumns } from './configs'

export default function UserActivityView({
  currentPage,
  currentLimit,
  currentSort,
  changeCurrentPage,
  changeCurrentLimit,
  changeCurrentSort,
  copyWallets,
  copyTradeIds,
  copyWalletIds,
  traders,
  excludingColumnKeys,
}: {
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  currentSort: TableSortProps<UserActivityData> | undefined
  changeCurrentSort: (sort: TableSortProps<UserActivityData> | undefined) => void
  copyWallets: CopyWalletData[] | undefined
  copyWalletIds: string[] | undefined
  copyTradeIds: string[] | undefined
  traders: string[] | undefined
  excludingColumnKeys?: (keyof UserActivityData)[]
}) {
  const { myProfile } = useMyProfileStore()
  const { data, isFetching } = useQuery(
    [
      QUERY_KEYS.GET_USER_ACTIVITY_LOGS,
      currentPage,
      currentLimit,
      myProfile?.id,
      currentSort,
      copyWalletIds,
      copyTradeIds,
      traders,
    ],
    () =>
      getUserActivityLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        copyWalletIds,
        copyTradeIds,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
        traders,
        method: 'POST',
      }),
    { keepPreviousData: true, retry: 0 }
  )
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData>()
  const handleSelectCopyItem = async (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }
  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
  }

  const isMobile = useIsMobile()
  const { lg } = useResponsive()

  const externalSource: ExternalSource = {
    handleSelectCopyItem,
    copyWallets,
    isMobile: !lg,
  }

  return (
    <>
      <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
        {lg ? (
          <Table
            data={data?.data}
            restrictHeight
            columns={getUserActivityColumns({ layoutType: 'normal', excludingColumnKeys })}
            isLoading={isFetching}
            externalSource={externalSource}
            tableBodyWrapperSx={{ table: { borderSpacing: '0 8px' }, '& tbody tr': { bg: 'neutral6' } }}
            // tableHeadSx={{ th: { borderBottom: 'none' } }}
            noDataMessage={<Trans>No Activity Found</Trans>}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
          />
        ) : (
          <ListActivityMobile data={data?.data} isLoading={isFetching} externalSource={externalSource} />
        )}
        <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}>
          <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
            Reverse Copy
          </Type.Caption>
        </Tooltip>
      </Box>
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={data?.meta}
        sx={{ py: 1 }}
      />
      <RcDrawer
        open={openCopyDrawer}
        onClose={handleCopyDismiss}
        width={isMobile ? '100%' : '60%'}
        zIndex={Z_INDEX.TOASTIFY}
      >
        <Container sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            icon={<XCircle size={24} />}
            variant="ghost"
            sx={{ position: 'absolute', right: 1, top: 1, zIndex: 1 }}
            onClick={handleCopyDismiss}
          />
          <CopyTradePositionDetails copyPositionData={currentCopyPosition} />
        </Container>
      </RcDrawer>
    </>
  )
}
