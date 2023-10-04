import { Trans } from '@lingui/macro'
import { useCallback, useRef, useState } from 'react'

import Table from 'components/@ui/Table'
import { TableSortProps } from 'components/@ui/Table/types'
import CopyTradeCloneDrawer from 'components/CopyTradeCloneDrawer'
import CopyTradeEditDrawer from 'components/CopyTradeEditDrawer'
import DeleteCopyTradeModal from 'components/CopyTradeForm/DeleteCopyTradeModal'
import { CopyTradeData } from 'entities/copyTrade.d'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { CopyTradeStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { parseProtocolImage } from 'utils/helpers/transform'

import NoDataOrSelect from '../NoDataOrSelect'
import ConfirmStopModal from './ConfirmStopModal'
import SelectedTraders from './SelectedTraders'
import useCopyTradeColumns from './useCopyTradeColumns'

export default function MyCopies({
  traders,
  selectedTraders,
  data,
  allCopyTrades,
  isLoading,
  onRefresh,
  handleToggleStatus,
  handleToggleProtocol,
  checkIsStatusChecked,
  checkIsProtocolChecked,
  handleSelectAllTraders,
  isLoadingTraders,
  handleToggleTrader,
  handleAddTrader,
}: {
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
}) {
  const [openConfirmStopModal, setOpenConfirmStopModal] = useState(false)
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      setOpenConfirmStopModal(false)
      onRefresh()
    },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openCloneDrawer, setOpenCloneDrawer] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const copyTradeData = useRef<CopyTradeData>()

  const onSelect = useCallback((data?: CopyTradeData) => {
    copyTradeData.current = data
  }, [])

  const handleCloseDrawer = () => {
    onSelect(undefined)
    setOpenDrawer(false)
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

  const columns = useCopyTradeColumns({
    onSelect,
    setOpenDrawer,
    setOpenCloneDrawer,
    setOpenConfirmStopModal,
    setOpenDeleteModal,
    toggleStatus,
    isMutating,
    copyTradeData,
  })

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

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyTradeData> | undefined>({
    sortBy: 'status',
    sortType: SortTypeEnum.ASC,
  })
  const changeCurrentSort = (sort: TableSortProps<CopyTradeData> | undefined) => {
    setCurrentSort(sort)
  }
  let sortedData: CopyTradeData[] | undefined = undefined
  if (data?.length) {
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

  const hasSelectedTraders = !!selectedTraders.length

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex p={2} pr={3} sx={{ gap: 3, borderBottom: 'small', borderColor: 'neutral5' }}>
        <Flex flex={1} sx={{ gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Flex sx={{ alignItems: 'center' }}>
            <SelectedTraders
              selectedTraders={selectedTraders}
              allTraders={traders}
              allCopyTrades={allCopyTrades}
              handleToggleTrader={handleToggleTrader}
              handleSelectAllTraders={handleSelectAllTraders}
            />
            <Flex sx={{ gap: 2 }}>
              <Type.Caption color="neutral1">
                <Trans>Available Margin</Trans>:
              </Type.Caption>
              <Type.CaptionBold color="neutral1">
                ${formatNumber(sortedData?.[0]?.bingXAvailableMargin)}
              </Type.CaptionBold>
            </Flex>
          </Flex>
          <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ width: '1px', height: '20px', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
            <Flex alignItems="center" sx={{ gap: 3 }}>
              <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                <Trans>Source</Trans>
              </Type.Caption>
              {protocolFilters.map((protocol) => {
                return (
                  <Checkbox
                    key={protocol}
                    checked={checkIsProtocolChecked(protocol)}
                    onChange={() => handleToggleProtocol(protocol)}
                  >
                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
                      <Image src={parseProtocolImage(protocol)} width={20} height={20} />
                      <Type.Caption lineHeight="16px">{PROTOCOL_OPTIONS_MAPPING[protocol].text}</Type.Caption>
                    </Flex>
                  </Checkbox>
                )
              })}
            </Flex>
            <Box sx={{ width: '1px', height: '20px', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
            <Flex alignItems="center" sx={{ gap: 3 }}>
              <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                <Trans>Status</Trans>
              </Type.Caption>
              {statusFilters.map((status) => {
                return (
                  <Checkbox
                    key={status}
                    checked={checkIsStatusChecked(status)}
                    onChange={() => handleToggleStatus(status)}
                  >
                    <Type.Caption lineHeight="16px">{COPY_TRADE_STATUS_TRANS[status]}</Type.Caption>
                  </Checkbox>
                )
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box flex="1 0 0" overflow="hidden">
        {hasSelectedTraders && (
          <>
            <Table
              restrictHeight
              data={sortedData}
              columns={columns}
              isLoading={isLoading}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              tableHeadSx={{
                '& th': {
                  border: 'none',
                },
              }}
              tableBodySx={{
                borderSpacing: '0px 4px',
                '& td': {
                  bg: 'neutral6',
                },
                '& tr:hover td': {
                  bg: 'neutral5',
                },
              }}
            />
            <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
              <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
                Reverse Copy
              </Type.Caption>
            </Tooltip>
          </>
        )}
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

const protocolFilters = [ProtocolEnum.GMX, ProtocolEnum.KWENTA]

const statusFilters = [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED]
