import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderVolumeCopy } from 'apis/copyTradeApis'
import CopyTradeCloneDrawer from 'components/@copyTrade/CopyTradeCloneDrawer'
import DeleteCopyTradeModal from 'components/@copyTrade/CopyTradeDeleteModal'
import CopyTradeEditDrawer from 'components/@copyTrade/CopyTradeEditDrawer'
import CopyTradeHistoryDrawer from 'components/@copyTrade/CopyTradeHistoryDrawer'
import { getMaxVolumeCopy, useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { CopyTable, CopyTradeWithCheckingData, ListCopyDEX } from '../ListCopyTrade'
import ConfirmStopModal from '../ListCopyTrade/ConfirmStopModal'
import { TraderCopyCountWarning } from '../ListCopyTrade/TraderCopyCountWarning'
import useVaultCopyTradeColumns from '../ListCopyTrade/useVaultCopyTradeColumns'
import NoDataOrSelect from '../NoDataOrSelect'
import useVaultManagementContext from './useVaultManagementContext'

export default function ListVaultCopyTrades({ expanded }: { expanded: boolean }) {
  const {
    listTraderAddresses,
    selectedTraders,
    copyTrades,
    isLoadingCopyTrades,
    handleRefresh,
    handleSelectAllTraders,
    isLoadingTraders,
    handleAddTrader,
    activeWallet,
  } = useVaultManagementContext()
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const [openConfirmStopModal, setOpenConfirmStopModal] = useState(false)
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      setOpenConfirmStopModal(false)
      handleRefresh()
    },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)
  const [openCloneDrawer, setOpenCloneDrawer] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const copyTradeData = useRef<CopyTradeWithCheckingData>()

  const onSelect = useCallback((data?: CopyTradeWithCheckingData) => {
    copyTradeData.current = data
  }, [])

  const handleCloseDrawer = () => {
    onSelect(undefined)
    setOpenDrawer(false)
  }

  const handleCloseHistoryDrawer = () => {
    onSelect(undefined)
    setOpenHistoryDrawer(false)
  }

  const handleCloseCloneDrawer = () => {
    onSelect(undefined)
    setOpenCloneDrawer(false)
  }

  const handleCloseDeleteModal = () => {
    onSelect(undefined)
    setOpenDeleteModal(false)
  }

  const toggleStatus = useCallback(
    ({
      id,
      currentStatus,
      multipleCopy,
    }: {
      id: string
      currentStatus: CopyTradeStatusEnum
      multipleCopy: boolean
    }) => {
      updateCopyTrade({
        copyTradeId: id,
        data: {
          multipleCopy,
          status:
            currentStatus === CopyTradeStatusEnum.RUNNING ? CopyTradeStatusEnum.STOPPED : CopyTradeStatusEnum.RUNNING,
        },
      })
    },
    [updateCopyTrade]
  )

  const { columns, renderProps } = useVaultCopyTradeColumns({
    onSelect,
    setOpenDrawer,
    setOpenHistoryDrawer,
    setOpenCloneDrawer,
    setOpenConfirmStopModal,
    setOpenDeleteModal,
    toggleStatus,
    isMutating,
    copyTradeData,
    expanded,
  })

  const { data: volumeCopies } = useQuery(
    [QUERY_KEYS.GET_TRADER_VOLUME_COPY, activeWallet?.id],
    () => getTraderVolumeCopy({ exchange: activeWallet?.exchange }),
    { enabled: !!activeWallet?.id }
  )

  const handleConfirmStop = () => {
    if (!copyTradeData.current) {
      console.debug('cannot select copy trade')
      return
    }
    toggleStatus({
      id: copyTradeData.current.id,
      currentStatus: copyTradeData.current.status,
      multipleCopy: copyTradeData.current.multipleCopy,
    })
  }
  const handleDismissConfirmStopModal = () => {
    setOpenConfirmStopModal(false)
  }

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyTradeWithCheckingData> | undefined>({
    sortBy: 'status',
    sortType: SortTypeEnum.ASC,
  })
  const changeCurrentSort = (sort: TableSortProps<CopyTradeWithCheckingData> | undefined) => {
    setCurrentSort(sort)
  }
  let sortedData: CopyTradeWithCheckingData[] | undefined = Array.isArray(copyTrades) ? [] : undefined
  if (copyTrades?.length) {
    sortedData = [...copyTrades]
    if (sortedData && sortedData.length > 0 && !!currentSort) {
      sortedData.sort((a, b) => {
        const x = a?.[currentSort.sortBy] as any
        const y = b?.[currentSort.sortBy] as any
        if (currentSort.sortType === SortTypeEnum.ASC) {
          return x < y ? -1 : x > y ? 1 : 0
        } else {
          return x < y ? 1 : x > y ? -1 : 0
        }
      })
    }
  }
  const isRef = !!activeWallet?.isReferral
  const systemVolumeLimit = useSystemConfigContext()
  sortedData = sortedData?.map((_d) => ({
    ..._d,
    isRef,
    maxVolume: getMaxVolumeCopy({ plan: myProfile?.plan, isRef, volumeLimitData: systemVolumeLimit.volumeLimit }),
    copyVolume: volumeCopies?.find((_v) => _v.account === _d.account && _v.protocol === _d.protocol)?.totalVolume ?? 0,
    plan: myProfile?.plan,
  }))

  const hasSelectedTraders = !!selectedTraders.length
  const { sm } = useResponsive()

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <TraderCopyCountWarning allCopyTrades={copyTrades} traderAddresses={listTraderAddresses} />
      <Box flex="1 0 0" overflow="hidden">
        {hasSelectedTraders &&
          (sm ? (
            <CopyTable
              sortedData={sortedData}
              columns={columns}
              isLoading={isLoadingCopyTrades}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
            />
          ) : (
            <ListCopyDEX sortedData={sortedData} isLoading={isLoadingCopyTrades} renderProps={renderProps} />
          ))}
        {!isLoadingCopyTrades && !!listTraderAddresses.length && !hasSelectedTraders && (
          <NoDataOrSelect
            type="noSelectTraders"
            handleClickActionButton={() => handleSelectAllTraders(true)}
            actionButtonText={<Trans>Select All Traders</Trans>}
            isLoading={isLoadingTraders}
          />
        )}
      </Box>
      {!isLoadingTraders && !listTraderAddresses.length && <NoDataOrSelect type="noTraders" />}

      {openDrawer && (
        <CopyTradeEditDrawer
          isOpen={openDrawer}
          onDismiss={handleCloseDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={() => handleRefresh()}
        />
      )}
      <CopyTradeHistoryDrawer
        isOpen={openHistoryDrawer}
        onDismiss={handleCloseHistoryDrawer}
        copyTradeData={copyTradeData.current}
      />
      {openCloneDrawer && (
        <CopyTradeCloneDrawer
          isOpen={openCloneDrawer}
          onDismiss={handleCloseCloneDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={(traderAddress) => {
            traderAddress && handleAddTrader(traderAddress)
            handleRefresh()
          }}
        />
      )}
      {openDeleteModal && (
        <DeleteCopyTradeModal
          copyTradeId={copyTradeData.current?.id}
          account={copyTradeData.current?.account}
          protocol={copyTradeData.current?.protocol}
          onDismiss={handleCloseDeleteModal}
          onSuccess={() => handleRefresh()}
        />
      )}
      {openConfirmStopModal && (
        <ConfirmStopModal
          isOpen={openConfirmStopModal}
          onConfirm={handleConfirmStop}
          onDismiss={handleDismissConfirmStopModal}
          isConfirming={isMutating}
        />
      )}
    </Flex>
  )
}
// function AvailableMargin({ value, sx }: { value: number | undefined; sx?: any }) {
//   return (
//     <Flex sx={{ gap: 2, ...(sx || {}) }}>
//       <Type.Caption color="neutral3">
//         <Trans>Available Fund</Trans>:
//       </Type.Caption>
//       <Type.CaptionBold color="neutral1">${formatNumber(value)}</Type.CaptionBold>
//     </Flex>
//   )
// }
