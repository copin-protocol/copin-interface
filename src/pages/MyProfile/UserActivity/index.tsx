import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { getUserActivityLogsApi } from 'apis/activityLogApis'
import Container from 'components/@ui/Container'
import Table from 'components/@ui/Table'
import { TableSortProps } from 'components/@ui/Table/types'
import CopyTradePositionDetails from 'components/CopyTradePositionDetails'
import { UserActivityData } from 'entities/user'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { PaginationWithLimit } from 'theme/Pagination'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, TOOLTIP_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import ListActivityMobile from './ListActivityMobile'
import SelectedCopyTrades from './SelectedCopyTrades'
import SelectedWallets from './SelectedWallets'
import { CopySelection, ExternalSource, userActivityColumns } from './configs'
import useFilterActivities from './useFilterActivities'

export default function UserActivity() {
  const { copyWallets } = useCopyWalletContext()
  const { myProfile } = useMyProfileStore()
  const storageData = sessionStorage.getItem(STORAGE_KEYS.MY_ACTIVITIES)
  const [selectionState, dispatch] = useFilterActivities(storageData)
  const selectedWalletIds = selectionState?.selectedWallets?.map((e) => e.id)
  const selectedCopyTradeIds = selectionState?.selectedCopyTrades?.map((e) => e.id)
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })
  const [currentSort, setCurrentSort] = useState<TableSortProps<UserActivityData> | undefined>(() => {
    const initSortBy: TableSortProps<UserActivityData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  })
  const changeCurrentSort = (sort: TableSortProps<UserActivityData> | undefined) => {
    setCurrentSort(sort)
    changeCurrentPage(1)
  }

  const checkFilters = (allData: any[], selectedIds: string[]) => {
    if (allData?.length === selectedIds?.length) return
    if (!!selectedIds.length) return selectedIds
    return ['']
  }

  const { data, isFetching } = useQuery(
    [
      QUERY_KEYS.GET_USER_ACTIVITY_LOGS,
      currentPage,
      currentLimit,
      myProfile?.id,
      currentSort,
      selectedWalletIds,
      selectedCopyTradeIds,
    ],
    () =>
      getUserActivityLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        copyWalletIds: checkFilters(selectionState.allWallets, selectedWalletIds),
        copyTradeIds: checkFilters(selectionState.allCopyTrades, selectedCopyTradeIds),
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    { keepPreviousData: true, retry: 0 }
  )
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopySelection>()
  const handleSelectCopyItem = async (data: CopySelection) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }
  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
    setCurrentCopyPosition(undefined)
  }

  const onChangeFilter = () => {
    changeCurrentPage(1)
  }

  useEffect(() => {
    const dataStorage = JSON.stringify(selectionState)
    sessionStorage.setItem(STORAGE_KEYS.MY_ACTIVITIES, dataStorage)
  }, [selectionState])

  const isMobile = useIsMobile()
  const { lg } = useResponsive()

  const externalSource: ExternalSource = {
    handleSelectCopyItem,
    copyWallets,
    isMobile: !lg,
  }

  return (
    <>
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* <Type.H5 p={3}>
          <Trans>Activity</Trans>
        </Type.H5>
        <Divider mb={3} /> */}
        <Flex
          sx={{
            alignItems: 'center',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            height: 50,
            gap: 3,
          }}
        >
          <SelectedWallets
            allWallets={selectionState.allWallets}
            selectedWallets={selectionState.selectedWallets}
            dispatch={dispatch}
            onChangeWallets={onChangeFilter}
          />
          <SelectedCopyTrades
            selectedWallets={selectionState.selectedWallets}
            allCopyTrades={selectionState.allCopyTrades}
            selectedCopyTrades={selectionState.selectedCopyTrades}
            dispatch={dispatch}
            onChangeCopyTrades={onChangeFilter}
          />
        </Flex>
        <Box mt={2} />
        <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
          {lg ? (
            <Table
              data={data?.data}
              restrictHeight
              columns={userActivityColumns}
              isLoading={isFetching}
              externalSource={externalSource}
              tableBodyWrapperSx={{ table: { borderSpacing: '0 8px' }, '& tbody tr': { bg: 'neutral6' } }}
              tableHeadSx={{ th: { borderBottom: 'none' } }}
              noDataMessage={<Trans>No Activity Found</Trans>}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
            />
          ) : (
            <ListActivityMobile data={data?.data} isLoading={isFetching} externalSource={externalSource} />
          )}
          <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
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
          sx={{ py: 2 }}
        />
      </Flex>
      {openCopyDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openCopyDrawer}
          onDismiss={handleCopyDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral5"
        >
          <Container sx={{ position: 'relative', height: '100%' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
              onClick={handleCopyDismiss}
            />
            <CopyTradePositionDetails id={currentCopyPosition?.id ?? ''} />
          </Container>
        </Drawer>
      )}
    </>
  )
}
