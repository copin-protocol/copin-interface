import { useCallback, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderVolumeCopy } from 'apis/copyTradeApis'
import DeleteCopyTradeModal from 'components/@copyTrade/CopyTradeDeleteModal'
import CopyTradeEditDrawer from 'components/@copyTrade/CopyTradeEditDrawer'
import CopyTradeHistoryDrawer from 'components/@copyTrade/CopyTradeHistoryDrawer'
import { MobileLayoutType } from 'components/@position/types'
import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { getMaxVolumeCopy, useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { CopyTable, CopyTradeWithCheckingData, ListCopyCEX } from 'pages/MyProfile/ListCopyTrade'
import ConfirmStopModal from 'pages/MyProfile/ListCopyTrade/ConfirmStopModal'
import useCEXCopyTradeColumns from 'pages/MyProfile/ListCopyTrade/useCEXCopyTradeColumns'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function LiteCopyTrades({
  copyWallet,
  copyTrades,
  loading,
  reload,
  layoutType,
}: {
  copyWallet: CopyWalletData
  copyTrades: CopyTradeData[] | undefined
  loading: boolean
  reload: () => void
  layoutType: MobileLayoutType
}) {
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const [openConfirmStopModal, setOpenConfirmStopModal] = useState(false)

  const refetchQueries = useRefetchQueries()
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      refetchQueries([
        QUERY_KEYS.GET_COPY_TRADE_SETTINGS,
        QUERY_KEYS.GET_EMBEDDED_COPY_TRADES,
        QUERY_KEYS.USE_GET_ALL_COPY_TRADES,
      ])
      setOpenConfirmStopModal(false)
    },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)
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

  const { columns, renderProps } = useCEXCopyTradeColumns({
    onSelect,
    setOpenDrawer,
    setOpenHistoryDrawer,
    setOpenCloneDrawer: undefined,
    setOpenConfirmStopModal,
    setOpenDeleteModal,
    toggleStatus,
    isMutating,
    copyTradeData,
    lite: true,
  })

  const { data: volumeCopies } = useQuery([QUERY_KEYS.GET_TRADER_VOLUME_COPY, copyWallet.id], () =>
    getTraderVolumeCopy({ exchange: copyWallet.exchange })
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
  const systemVolumeLimit = useSystemConfigContext()
  sortedData = sortedData?.map((_d) => ({
    ..._d,
    isRef: true,
    maxVolume: getMaxVolumeCopy({ plan: myProfile?.plan, isRef: true, volumeLimitData: systemVolumeLimit.volumeLimit }),
    copyVolume: volumeCopies?.find((_v) => _v.account === _d.account && _v.protocol === _d.protocol)?.totalVolume ?? 0,
    plan: myProfile?.plan,
  }))

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Box flex="1 0 0" overflow="hidden">
        {!loading &&
          !!copyTrades?.length &&
          (layoutType === 'LIST' ? (
            <CopyTable
              sortedData={sortedData}
              columns={columns}
              isLoading={loading}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
            />
          ) : (
            <ListCopyCEX sortedData={sortedData} isLoading={loading} renderProps={renderProps} />
          ))}
        {!loading && !copyTrades?.length && <NoDataOrSelect type="noTraders" />}
        {openDrawer && (
          <CopyTradeEditDrawer
            isLite
            isOpen={openDrawer}
            onDismiss={handleCloseDrawer}
            copyTradeData={copyTradeData.current}
            onSuccess={() => reload()}
          />
        )}
        <CopyTradeHistoryDrawer
          isOpen={openHistoryDrawer}
          onDismiss={handleCloseHistoryDrawer}
          copyTradeData={copyTradeData.current}
        />
        {openDeleteModal && (
          <DeleteCopyTradeModal
            copyTradeId={copyTradeData.current?.id}
            account={copyTradeData.current?.account}
            protocol={copyTradeData.current?.protocol}
            onDismiss={handleCloseDeleteModal}
            onSuccess={() => reload()}
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
      </Box>
    </Flex>
  )
}
