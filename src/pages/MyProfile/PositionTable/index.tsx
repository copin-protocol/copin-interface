import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMyCopySourcePositionDetailApi } from 'apis/copyPositionApis'
import Container from 'components/@ui/Container'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Table from 'components/@ui/Table'
import { ColumnData, TableProps } from 'components/@ui/Table/types'
import ToastBody from 'components/@ui/ToastBody'
import CopyTradePositionDetails from 'components/CopyTradePositionDetails'
import PositionDetails from 'components/PositionDetails'
import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useSearchParams from 'hooks/router/useSearchParams'
import useUsdPrices, { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { generateClosedPositionRoute, generateOpeningPositionRoute } from 'utils/helpers/generateRoute'

import { renderEntry, renderPnL, renderSource, renderTrader } from '../renderProps'
import ClosePositionModal from './ClosePositionModal'

type ExternalSource = {
  prices: UsdPrices
  submitting?: boolean
  currentId?: string
  onViewSource: (data: CopyPositionData, event?: any) => void
}
export default function PositionTable({
  onClosePositionSuccess,
  ...tableProps
}: {
  onClosePositionSuccess: () => void
} & TableProps<CopyPositionData, ExternalSource>) {
  const isMobile = useIsMobile()
  const { prices } = useUsdPrices()
  const [openSourceDrawer, setOpenSourceDrawer] = useState(false)
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [openCloseModal, setOpenCloseModal] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData | undefined>()
  const [sourcePosition, setSourcePosition] = useState<PositionData | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const handleSelectSourceItem = useCallback(
    async (data: CopyPositionData, event?: any) => {
      event?.stopPropagation()
      setCurrentCopyPosition(data)
      const isOpen = data.status === PositionStatusEnum.OPEN
      try {
        setSubmitting(true)
        const positionDetail = await getMyCopySourcePositionDetailApi({
          copyId: data?.id ?? '',
          isOpen,
        })
        setSubmitting(false)
        if (
          !positionDetail ||
          (positionDetail.status && positionDetail.status !== PositionStatusEnum.OPEN && isOpen) ||
          (((!positionDetail.status && !positionDetail.id) || positionDetail.status === PositionStatusEnum.OPEN) &&
            !isOpen)
        )
          throw Error(`Can't find data`)
        setSourcePosition(positionDetail)
        if (isOpen) {
          setOpenSourceDrawer(true)
          window.history.replaceState(null, '', generateOpeningPositionRoute(positionDetail))
        } else {
          setOpenSourceDrawer(true)
          window.history.replaceState(
            null,
            '',
            generateClosedPositionRoute({
              protocol: positionDetail.protocol,
              id: positionDetail.id,
              nextHours: nextHoursParam,
            })
          )
        }
      } catch (error: any) {
        if (error?.message?.includes(`Can't find data`)) {
          if (isOpen) {
            setOpenCloseModal(true)
          } else {
            toast.error(
              <ToastBody
                title={<Trans>Warning</Trans>}
                message={<Trans>No link to the trader’s original position was found.</Trans>}
              />
            )
          }
        }
        setSubmitting(false)
      }
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenSourceDrawer(false)
    setSourcePosition(undefined)
    setCurrentCopyPosition(undefined)
  }

  const handleSelectCopyItem = async (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }

  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
    setCurrentCopyPosition(undefined)
  }

  return (
    <Box width="100%" height="100%">
      <Box width="100%" height="100%" overflow="hidden">
        <Table
          {...(tableProps ?? {})}
          wrapperSx={{
            table: {
              '& th:last-child, td:last-child': {
                pr: 2,
              },
              '& td:last-child': {
                pr: 2,
              },
            },
            ...(tableProps?.wrapperSx ?? {}),
          }}
          restrictHeight
          externalSource={{
            prices,
            submitting,
            currentId: currentCopyPosition?.id,
            onViewSource: handleSelectSourceItem,
          }}
          onClickRow={handleSelectCopyItem}
        />
      </Box>
      {openSourceDrawer && sourcePosition && (
        <Drawer
          isOpen={openSourceDrawer}
          onDismiss={handleDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral6"
        >
          <Container sx={{ position: 'relative' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3 }}
              onClick={handleDismiss}
            />
            <PositionDetails
              protocol={sourcePosition.protocol}
              id={sourcePosition?.id}
              account={sourcePosition?.account}
              indexToken={sourcePosition?.indexToken}
              dataKey={sourcePosition?.key}
              isShow={openSourceDrawer}
            />
          </Container>
        </Drawer>
      )}
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
            <CopyTradePositionDetails id={currentCopyPosition?.id} />
          </Container>
        </Drawer>
      )}
      {openCloseModal && currentCopyPosition?.id && (
        <ClosePositionModal
          copyId={currentCopyPosition?.id}
          onDismiss={() => setOpenCloseModal(false)}
          onSuccess={onClosePositionSuccess}
        />
      )}
    </Box>
  )
}

export const openingColumns: ColumnData<CopyPositionData, ExternalSource>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '90px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Copy Address',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '160px' },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={1}>Source</Box>,
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '70px', textAlign: 'right' },
    render: renderSource,
  },
]
export const historyTabColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '115px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Closed Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        {item.status === PositionStatusEnum.CLOSE ? <LocalTimeText date={item.lastOrderAt} /> : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px' },
    render: (item) => (
      <Type.Caption color="neutral1" sx={{ maxWidth: '110px', ...overflowEllipsis(), display: 'block' }}>
        {item.copyTradeTitle}
      </Type.Caption>
    ),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '150px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Size ($)',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta) * item.entryPrice, 0)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta) * item.entryPrice, 0)
          : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    sortBy: 'leverage',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>,
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', textAlign: 'right' },
    render: renderSource,
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    sortBy: 'pnl',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '100px', textAlign: 'center' },
    render: (item) => (
      <Flex width="100%" alignItems="center" justifyContent="center">
        <Tag width={70} status={item.status} />
      </Flex>
    ),
  },
]

export const historyColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '120px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Closed Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        {item.status === PositionStatusEnum.CLOSE ? <LocalTimeText date={item.lastOrderAt} /> : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '180px' },
    // TODO: 2
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px' },
    render: (item) => (
      <Type.Caption color="neutral1" sx={{ maxWidth: '110px', ...overflowEllipsis(), display: 'block' }}>
        {item.copyTradeTitle}
      </Type.Caption>
    ),
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', textAlign: 'center' },
    render: renderSource,
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '150px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Value',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta), 4, 4)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta), 4, 4)
          : '--'}{' '}
        {TOKEN_TRADE_SUPPORT[item.protocol][item.indexToken].symbol}
      </Type.Caption>
    ),
  },
  {
    title: 'Size ($)',
    dataIndex: 'totalSizeDelta',
    key: 'totalSizeDelta',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta) * item.entryPrice, 0)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta) * item.entryPrice, 0)
          : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>,
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={3}>Status</Box>,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Flex width="100%" alignItems="center" justifyContent="right">
        <Tag width={70} status={item.status} />
      </Flex>
    ),
  },
]
