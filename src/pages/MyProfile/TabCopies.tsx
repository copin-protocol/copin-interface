import { Trans } from '@lingui/macro'
import {
  ArrowUUpLeft,
  CopySimple,
  DotsThreeOutlineVertical,
  Funnel,
  PencilSimpleLine,
  Plugs,
  Radical,
  Trash,
} from '@phosphor-icons/react'
import { ReactNode, useMemo, useRef, useState } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Table from 'components/@ui/Table'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import CopyTradeCloneDrawer from 'components/CopyTradeCloneDrawer'
import CopyTradeEditDrawer from 'components/CopyTradeEditDrawer'
import DeleteCopyTradeModal from 'components/CopyTradeForm/DeleteCopyTradeModal'
import { CopyTradeData } from 'entities/copyTrade.d'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import { Button } from 'theme/Buttons'
// import usePageChange from 'hooks/helpers/usePageChange'
import IconButton from 'theme/Buttons/IconButton'
import Checkbox from 'theme/Checkbox'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import SwitchInput from 'theme/SwitchInput'
// import Pagination from 'theme/Pagination'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten, formatNumber } from 'utils/helpers/format'

import ConfirmStopModal from './ConfirmStopModal'
import NoDataOrSelect from './NoDataOrSelect'
import SelectedTag from './SelectedTag'
// import { pageToOffset } from 'utils/helpers/transform'
import { renderTrader } from './renderProps'

export default function MyCopiesTable({
  selectedTraders,
  data,
  isLoading,
  isSelectedAll,
  handleSelectAll,
  checkIsSelected,
  handleSelect,
  onDeleteTag,
  onRefresh,
  handleToggleStatus,
  checkIsStatusChecked,
  copyStatusFilters,
  handleSelectAllTraders,
  isLoadingOutsource,
  handleSelectTrader,
}: {
  selectedTraders: string[]
  data: CopyTradeData[] | undefined
  isLoading: boolean
  isSelectedAll: boolean
  handleSelectAll: (isSelectedAll: boolean) => void
  checkIsSelected: (data: CopyTradeData) => boolean
  handleSelect: (args: { data: CopyTradeData; isSelected: boolean }) => void
  onDeleteTag: (address: string) => void
  onRefresh: () => void
  handleToggleStatus: ({ status }: { status: CopyTradeStatusEnum }) => void
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
  copyStatusFilters: CopyTradeStatusEnum[]
  handleSelectAllTraders?: () => void
  isLoadingOutsource?: boolean
  handleSelectTrader: (trader: string) => void
}) {
  const hasSelectedTraders = !!selectedTraders.length
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

  const onSelect = (data?: CopyTradeData) => {
    copyTradeData.current = data
  }

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
  const toggleStatus = ({ id, currentStatus }: { id: string; currentStatus: CopyTradeStatusEnum }) => {
    updateCopyTrade({
      copyTradeId: id,
      data: {
        status:
          currentStatus === CopyTradeStatusEnum.RUNNING ? CopyTradeStatusEnum.STOPPED : CopyTradeStatusEnum.RUNNING,
      },
    })
  }
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

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyTradeData>>()
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

  const columns = useMemo(() => {
    const handleOpenDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDrawer(true)
    }

    const handleOpenCloneDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenCloneDrawer(true)
    }

    const handleOpenDeleteModal = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDeleteModal(true)
    }

    const toggleStatusCopyTrade = (item: CopyTradeData) => {
      if (isMutating) return
      onSelect(item)
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        toggleStatus({ id: item.id, currentStatus: item.status })
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        setOpenConfirmStopModal(true)
        return
      }
    }

    const result: ColumnData<CopyTradeData>[] = [
      {
        title: (
          <Box as="span" pl={3}>
            On/Off
          </Box>
        ),
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '80px' },
        render: (item) => (
          <Box pl={3}>
            <SwitchInput
              isManual
              defaultActive={item.status === CopyTradeStatusEnum.RUNNING}
              onChange={() => {
                // onSelect(item)
                toggleStatusCopyTrade(item)
              }}
              isLoading={copyTradeData.current?.id === item.id && isMutating}
            />
          </Box>
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '180px' },
        render: (item) => (
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption
              maxWidth={`calc(165px ${item.reverseCopy ? '- 20px' : ''} ${item.enableStopLoss ? '- 28px' : ''} ${
                !!item.maxVolMultiplier ? '- 28px' : ''
              })`}
              color="neutral1"
              sx={{ ...overflowEllipsis(), display: 'block' }}
              data-tooltip-id={`${item.id}_${item.title}`}
            >
              {item.title ? item.title : '--'}
            </Type.Caption>
            {item.title && (
              <Tooltip id={`${item.id}_${item.title}`} place="top" type="dark" effect="solid">
                <Type.Caption sx={{ maxWidth: 350 }}>{item.title}</Type.Caption>
              </Tooltip>
            )}
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              {item.reverseCopy && (
                <>
                  <IconBox
                    icon={<ArrowUUpLeft size={16} />}
                    color="orange2"
                    sx={{ bg: '#FFC24B4D', p: '2px', borderRadius: 'sm' }}
                    data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}_${item.id}`}
                  />
                  <Tooltip
                    id={`${TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}_${item.id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
                      Reverse Copy
                    </Type.Caption>
                  </Tooltip>
                </>
              )}
              {item.enableStopLoss && (
                <>
                  <IconBox
                    icon={<Plugs size={16} />}
                    color="#FA5547"
                    sx={{ bg: '#FA55474D', p: '2px', borderRadius: 'sm' }}
                    data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
                  />
                  <Tooltip
                    id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                      Stoploss:{' '}
                      <Box as="span" color="red1">
                        ${`${formatNumber(item.stopLossAmount, 2, 2)}`}
                      </Box>
                    </Type.Caption>
                  </Tooltip>
                </>
              )}
              {!!item.maxVolMultiplier && (
                <>
                  <IconBox
                    icon={<Radical size={16} />}
                    color="primary1"
                    sx={{ bg: '#97CFFD4D', p: '2px', borderRadius: 'sm' }}
                    data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
                  />
                  <Tooltip
                    id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                      Max Volume Multiplier:{' '}
                      <Box as="span" color="red1">
                        {`${formatNumber(item.maxVolMultiplier, 0, 0)}`} times
                      </Box>
                    </Type.Caption>
                  </Tooltip>
                </>
              )}
            </Flex>
          </Flex>
        ),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '120px' },
        // TODO: 2
        render: (item) => renderTrader(item.account, item.protocol),
      },
      {
        title: 'Balance',
        dataIndex: 'bingXBalance',
        key: 'bingXBalance',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Type.Caption color="neutral1">${formatNumber(item.bingXBalance)}</Type.Caption>,
      },
      {
        title: 'Available Margin',
        dataIndex: 'bingXAvailableMargin',
        key: 'bingXAvailableMargin',
        style: { minWidth: '110px', textAlign: 'right' },
        render: (item) => <Type.Caption color="neutral1">${formatNumber(item.bingXAvailableMargin)}</Type.Caption>,
      },
      {
        title: 'Vol/Order',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '80px', textAlign: 'center' },
        render: (item) => <Type.Caption color="neutral1">${formatNumber(item.volume)}</Type.Caption>,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '80px', textAlign: 'center' },
        render: (item) => <Type.Caption color="neutral1">x{formatNumber(item.leverage)}</Type.Caption>,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>7D PnL</Trans>,
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: (item) => <SignedText value={item.pnl7D} maxDigit={2} minDigit={2} prefix="$" />,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>30D PnL</Trans>,
        key: 'pnl30D',
        dataIndex: 'pnl30D',
        sortBy: 'pnl30D',
        render: (item) => <SignedText value={item.pnl30D} maxDigit={2} minDigit={2} prefix="$" />,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>Total PnL</Trans>,
        key: 'pnl',
        dataIndex: 'pnl',
        sortBy: 'pnl',
        render: (item) => <SignedText value={item.pnl} maxDigit={2} minDigit={2} prefix="$" />,
      },
      {
        title: <Box pr={3}>Status</Box>,
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item) => (
          <Flex width="100%" height="100%" justifyContent="right">
            <Tag width={70} status={item.status} bg="neutral5" />
          </Flex>
        ),
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', textAlign: 'right', pr: 2 },
        render: (item) => (
          <Flex justifyContent="end">
            <Dropdown
              hasArrow={false}
              menuSx={{
                bg: 'neutral7',
                width: 100,
              }}
              menu={
                <>
                  <ActionItem
                    title={<Trans>Edit</Trans>}
                    icon={<PencilSimpleLine size={18} />}
                    onSelect={() => handleOpenDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Clone</Trans>}
                    icon={<CopySimple size={18} />}
                    onSelect={() => handleOpenCloneDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Remove</Trans>}
                    icon={<Trash size={18} />}
                    onSelect={() => handleOpenDeleteModal(item)}
                  />
                </>
              }
              sx={{}}
              buttonSx={{
                border: 'none',
                height: '100%',
                p: 0,
                // '&:hover,&:focus,&:active': {
                //   bg: 'neutral7',
                // },
              }}
              placement="topRight"
            >
              <IconButton
                size={24}
                type="button"
                icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
                variant="ghost"
                sx={{
                  color: 'neutral3',
                }}
              />
            </Dropdown>
          </Flex>
        ),
      },
    ]
    return result
  }, [isMutating])

  if (!hasSelectedTraders)
    return (
      <NoDataOrSelect
        type="noSelectTraders"
        actionButton={
          handleSelectAllTraders ? (
            <Button variant="primary" mt={3} onClick={handleSelectAllTraders} isLoading={isLoadingOutsource}>
              Select All Traders
            </Button>
          ) : null
        }
      />
    )

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex px={12} pt={16} mb={1} sx={{ gap: 3 }}>
        <Flex flex={1} sx={{ gap: 12, overflow: 'auto hidden', pb: 2 }}>
          {selectedTraders.map((traderAccount) => {
            return (
              <SelectedTag
                key={traderAccount}
                title={addressShorten(traderAccount)}
                handleDelete={() => onDeleteTag(traderAccount)}
              />
            )
          })}
        </Flex>
        <Dropdown
          buttonSx={{ p: 0, mt: 1, border: 'none', color: 'primary1', position: 'relative' }}
          menuSx={{ p: 3 }}
          hasArrow={false}
          menuDismissable
          dismissable={false}
          menu={
            <>
              <Type.Body mb={3}>Status</Type.Body>
              <Checkbox
                checked={checkIsStatusChecked(CopyTradeStatusEnum.RUNNING)}
                onChange={() => handleToggleStatus({ status: CopyTradeStatusEnum.RUNNING })}
              >
                <Type.Caption color="green1">{COPY_TRADE_STATUS_TRANS[CopyTradeStatusEnum.RUNNING]}</Type.Caption>
              </Checkbox>
              <Box mb={12} />
              <Checkbox
                checked={checkIsStatusChecked(CopyTradeStatusEnum.STOPPED)}
                onChange={() => handleToggleStatus({ status: CopyTradeStatusEnum.STOPPED })}
              >
                <Type.Caption color="red2">{COPY_TRADE_STATUS_TRANS[CopyTradeStatusEnum.STOPPED]}</Type.Caption>
              </Checkbox>
            </>
          }
        >
          <Funnel size={24} />
          <Box
            sx={{
              width: 16,
              height: 16,
              lineHeight: '16px',
              textAlign: 'center',
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              bg: 'red2',
              color: 'neutral1',
              borderRadius: '50%',
            }}
          >
            {copyStatusFilters.length}
          </Box>
        </Dropdown>
      </Flex>
      <Box flex="1 0 0" overflow="hidden">
        <Table
          restrictHeight
          data={sortedData}
          columns={columns}
          isLoading={isLoading}
          isSelectedAll={isSelectedAll}
          handleSelectAll={handleSelectAll}
          checkIsSelected={checkIsSelected}
          handleSelect={handleSelect}
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
          // footer={
          //   <Pagination
          //     totalPage={data?.meta?.totalPages ?? 0}
          //     currentPage={currentPage}
          //     onPageChange={changeCurrentPage}
          //   />
          //}
        />
      </Box>

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
            traderAddress && handleSelectTrader(traderAddress)
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

function ActionItem({
  title,
  icon,
  onSelect,
}: {
  title: ReactNode
  icon: ReactNode
  onSelect: (data?: CopyTradeData) => void
}) {
  return (
    <DropdownItem onClick={() => onSelect()}>
      <Flex alignItems="center" sx={{ gap: 10 }}>
        <IconBox icon={icon} color="neutral3" />
        <Type.Caption>{title}</Type.Caption>
      </Flex>
    </DropdownItem>
  )
}
