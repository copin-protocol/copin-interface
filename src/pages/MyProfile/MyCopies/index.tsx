import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderVolumeCopy } from 'apis/copyTradeApis'
import { TableSortProps } from 'components/@ui/Table/types'
import CopyTradeCloneDrawer from 'components/CopyTradeCloneDrawer'
import CopyTradeEditDrawer from 'components/CopyTradeEditDrawer'
import DeleteCopyTradeModal from 'components/CopyTradeForm/DeleteCopyTradeModal'
import CopyTradeHistoryDrawer from 'components/CopyTradeHistoryDrawer'
import { CopyTradeData } from 'entities/copyTrade.d'
import { CopyWalletData } from 'entities/copyWallet'
import { getMaxVolumeCopy, useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import { Box, Flex } from 'theme/base'
import { CopyTradeStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import NoDataOrSelect from '../NoDataOrSelect'
import ConfirmStopModal from './ConfirmStopModal'
import FilterSection from './FilterSection'
import { CopyTable, CopyTradeWithCheckingData, ListCopy } from './ListCopyTrade'
import { TraderCopyCountWarning } from './TraderCopyCountWarning'
import useCopyTradeColumns from './useCopyTradeColumns'

export interface MyCopiesProps {
  traders: string[]
  selectedTraders: string[]
  data: CopyTradeData[] | undefined
  allCopyTrades: CopyTradeData[] | undefined
  isLoading: boolean
  onRefresh: () => void
  handleToggleStatus: (status: CopyTradeStatusEnum) => void
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
  handleToggleProtocol: (protocol: ProtocolEnum) => void
  checkIsProtocolChecked: (protocol: ProtocolEnum) => boolean
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  isLoadingTraders: boolean
  handleToggleTrader: (address: string) => void
  handleAddTrader: (address: string) => void
  copyWallet: CopyWalletData | null
  copyStatus: CopyTradeStatusEnum[]
  selectedProtocol: ProtocolEnum[]
  toggleAllProtocol: (isToggledAll: boolean) => void
  isToggleAllProtocol: boolean
}

export default function MyCopies(props: MyCopiesProps) {
  const {
    traders,
    selectedTraders,
    data,
    isLoading,
    onRefresh,
    handleSelectAllTraders,
    isLoadingTraders,
    handleAddTrader,
    copyWallet,
  } = props
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const [openConfirmStopModal, setOpenConfirmStopModal] = useState(false)
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      setOpenConfirmStopModal(false)
      onRefresh()
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
    ({ id, currentStatus }: { id: string; currentStatus: CopyTradeStatusEnum }) => {
      updateCopyTrade({
        copyTradeId: id,
        data: {
          status:
            currentStatus === CopyTradeStatusEnum.RUNNING ? CopyTradeStatusEnum.STOPPED : CopyTradeStatusEnum.RUNNING,
        },
      })
    },
    [updateCopyTrade]
  )

  const { columns, renderProps } = useCopyTradeColumns({
    onSelect,
    setOpenDrawer,
    setOpenHistoryDrawer,
    setOpenCloneDrawer,
    setOpenConfirmStopModal,
    setOpenDeleteModal,
    toggleStatus,
    isMutating,
    copyTradeData,
  })

  const { data: volumeCopies } = useQuery(
    [QUERY_KEYS.GET_TRADER_VOLUME_COPY, copyWallet?.id],
    () => getTraderVolumeCopy({ exchange: copyWallet?.exchange }),
    { enabled: !!copyWallet?.id }
  )

  const handleConfirmStop = () => {
    if (!copyTradeData.current) {
      console.debug('cannot select copy trade')
      return
    }
    toggleStatus({ id: copyTradeData.current.id, currentStatus: copyTradeData.current.status })
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
  let sortedData: CopyTradeWithCheckingData[] | undefined = Array.isArray(data) ? [] : undefined
  if (data?.length) {
    //@ts-ignore
    sortedData = [...data]
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
  const isRef = !!copyWallet?.isReferral
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
      <FilterSection {...props} />
      <TraderCopyCountWarning allCopyTrades={props.allCopyTrades} traderAddresses={props.traders} />
      <Box flex="1 0 0" overflow="hidden">
        {hasSelectedTraders &&
          (sm ? (
            <CopyTable
              sortedData={sortedData}
              columns={columns}
              isLoading={isLoading}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
            />
          ) : (
            <ListCopy sortedData={sortedData} isLoading={isLoading} renderProps={renderProps} />
          ))}
        {!isLoading && !!traders.length && !hasSelectedTraders && (
          <NoDataOrSelect
            type="noSelectTraders"
            actionButton={
              <Button
                variant="primary"
                mt={3}
                onClick={() => handleSelectAllTraders(false)}
                isLoading={isLoadingTraders}
                disabled={isLoadingTraders}
              >
                <Trans>Select All Traders</Trans>
              </Button>
            }
          />
        )}
      </Box>
      {!isLoadingTraders && !traders.length && <NoDataOrSelect type="noTraders" />}

      {openDrawer && (
        <CopyTradeEditDrawer
          isOpen={openDrawer}
          onDismiss={handleCloseDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={() => onRefresh()}
        />
      )}
      {openHistoryDrawer && (
        <CopyTradeHistoryDrawer
          isOpen={openHistoryDrawer}
          onDismiss={handleCloseHistoryDrawer}
          copyTradeData={copyTradeData.current}
        />
      )}
      {openCloneDrawer && (
        <CopyTradeCloneDrawer
          isOpen={openCloneDrawer}
          onDismiss={handleCloseCloneDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={(traderAddress) => {
            traderAddress && handleAddTrader(traderAddress)
            onRefresh()
          }}
        />
      )}
      {openDeleteModal && (
        <DeleteCopyTradeModal
          copyTradeId={copyTradeData.current?.id}
          account={copyTradeData.current?.account}
          protocol={copyTradeData.current?.protocol}
          onDismiss={handleCloseDeleteModal}
          onSuccess={() => onRefresh()}
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
