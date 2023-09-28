import { Trans } from '@lingui/macro'
import { CopySimple, DotsThreeOutlineVertical, PencilSimpleLine, Plugs, Radical, Trash } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

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
import Dropdown from 'theme/Dropdown'
import SwitchInput from 'theme/SwitchInput'
// import Pagination from 'theme/Pagination'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'

import ConfirmStopModal from './ConfirmStopModal'
import ActionItem from './MyCopies/ActionItem'
import ReverseTag from './MyCopies/ReverseTag'
import SelectedTraders from './MyCopies/SelectedTraders'
import NoDataOrSelect from './NoDataOrSelect'
// import { pageToOffset } from 'utils/helpers/transform'
import { renderTrader } from './renderProps'

export default function MyCopies({
  selectedTraders,
  data,
  isLoading,
  onRefresh,
  handleToggleStatus,
  checkIsStatusChecked,
  handleSelectAllTraders,
  isLoadingOutsource,
  handleSelectTrader,
}: {
  selectedTraders: string[]
  data: CopyTradeData[] | undefined
  isLoading: boolean
  onDeleteTag: (address: string) => void
  onRefresh: () => void
  handleToggleStatus: ({ status }: { status: CopyTradeStatusEnum }) => void
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
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
            Run/Stop
          </Box>
        ),
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        sortType: SortTypeEnum.ASC,
        style: { minWidth: '110px' },
        render: (item) => (
          <Box pl={3} sx={{ position: 'relative' }}>
            {item.reverseCopy && <ReverseTag />}
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
        style: { minWidth: '120px', pr: 3 },
        render: (item) => (
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption
              maxWidth={104}
              color={item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3'}
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
          </Flex>
        ),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '120px' },
        // TODO: 2
        render: (item) =>
          renderTrader(item.account, item.protocol, {
            textSx: {
              color: item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3',
            },
            sx: {
              filter: item.status === CopyTradeStatusEnum.RUNNING ? 'none' : 'grayscale(1)',
            },
          }),
      },
      {
        title: 'Vol/Order',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color={item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3'}>
            ${formatNumber(item.volume)}
          </Type.Caption>
        ),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color={item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3'}>
            x{formatNumber(item.leverage)}
          </Type.Caption>
        ),
      },
      {
        title: 'Risk Control',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '80px', textAlign: 'left', pl: 3 },
        render: (item) => (
          <Flex
            sx={{
              alignItems: 'center',
              gap: 2,
              filter: item.status === CopyTradeStatusEnum.RUNNING ? undefined : 'grayscale(1)',
            }}
          >
            {item.enableStopLoss && (
              <>
                <IconBox
                  icon={<Plugs size={16} />}
                  color="#FA5547"
                  sx={{ bg: '#FA55474D', p: '2px', borderRadius: 'sm' }}
                  data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
                />
                <Tooltip id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`} place="top" type="dark" effect="solid">
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
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>7D PnL</Trans>,
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: (item) => (
          <SignedText
            value={item.pnl7D}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              item.status === CopyTradeStatusEnum.RUNNING
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>30D PnL</Trans>,
        key: 'pnl30D',
        dataIndex: 'pnl30D',
        sortBy: 'pnl30D',
        render: (item) => (
          <SignedText
            value={item.pnl30D}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              item.status === CopyTradeStatusEnum.RUNNING
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
        ),
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>Total PnL</Trans>,
        key: 'pnl',
        dataIndex: 'pnl',
        sortBy: 'pnl',
        render: (item) => (
          <SignedText
            value={item.pnl}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            sx={
              item.status === CopyTradeStatusEnum.RUNNING
                ? undefined
                : {
                    color: 'neutral3',
                  }
            }
          />
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
      <Flex p={2} pr={3} sx={{ gap: 3, borderBottom: 'small', borderColor: 'neutral5' }}>
        <Flex flex={1} sx={{ gap: 12, alignItems: 'center' }}>
          {!!sortedData && sortedData?.length > 0 && (
            <>
              <SelectedTraders
                selectedTraders={selectedTraders}
                traders={sortedData?.map((item) => item.account)}
                protocol={sortedData[0].protocol}
                handleToggleTrader={(key) => {
                  console.log(key)
                }}
              />
              <Flex sx={{ gap: 2 }}>
                <Type.Caption color="neutral1">
                  <Trans>Available Margin</Trans>:
                </Type.Caption>
                <Type.CaptionBold color="neutral1">
                  ${formatNumber(sortedData[0].bingXAvailableMargin)}
                </Type.CaptionBold>
              </Flex>
            </>
          )}
          <Flex ml="auto" alignItems="center" sx={{ gap: 3 }}>
            <Checkbox
              checked={checkIsStatusChecked(CopyTradeStatusEnum.RUNNING)}
              onChange={() => handleToggleStatus({ status: CopyTradeStatusEnum.RUNNING })}
            >
              <Type.Caption lineHeight="16px">{COPY_TRADE_STATUS_TRANS[CopyTradeStatusEnum.RUNNING]}</Type.Caption>
            </Checkbox>
            <Checkbox
              checked={checkIsStatusChecked(CopyTradeStatusEnum.STOPPED)}
              onChange={() => handleToggleStatus({ status: CopyTradeStatusEnum.STOPPED })}
            >
              <Type.Caption lineHeight="16px">{COPY_TRADE_STATUS_TRANS[CopyTradeStatusEnum.STOPPED]}</Type.Caption>
            </Checkbox>
          </Flex>
          {/* {selectedTraders.map((traderAccount) => {
            return (
              <SelectedTag
                key={traderAccount}
                title={addressShorten(traderAccount)}
                handleDelete={() => onDeleteTag(traderAccount)}
              />
            )
          })} */}
        </Flex>
      </Flex>
      <Box flex="1 0 0" overflow="hidden">
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
          // footer={
          //   <Pagination
          //     totalPage={data?.meta?.totalPages ?? 0}
          //     currentPage={currentPage}
          //     onPageChange={changeCurrentPage}
          //   />
          //}
        />
        <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
          <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
            Reverse Copy
          </Type.Caption>
        </Tooltip>
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
