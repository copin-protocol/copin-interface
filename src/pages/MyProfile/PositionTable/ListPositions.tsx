import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ReverseTag from 'components/@ui/ReverseTag'
import Table from 'components/@ui/Table'
import { ColumnData, TableProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { TOOLTIP_CONTENT } from 'utils/config/options'

import {
  renderCloseTime,
  renderCloseType,
  renderCopyTitle,
  renderEntry,
  renderLeverage,
  renderOpenTime,
  renderPnL,
  renderSize,
  renderSizeMobile,
  renderSource,
  renderStatus,
  renderTrader,
} from '../renderProps'
import { ExternalSource } from './PositionsContainer'

export function TableForm({
  tableProps,
  externalSource,
}: {
  tableProps: TableProps<CopyPositionData, ExternalSource>
  externalSource?: ExternalSource
}) {
  return (
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
        restrictHeight={tableProps?.restrictHeight ?? true}
        externalSource={externalSource}
        onClickRow={externalSource?.handleSelectCopyItem}
      />
    </Box>
  )
}
export function SimpleTableForm({
  tableProps,
  externalSource,
}: {
  tableProps: TableProps<CopyPositionData, ExternalSource>
  externalSource?: ExternalSource
}) {
  return (
    <Box width="100%" height="100%" overflow="hidden">
      <Table
        {...(tableProps ?? {})}
        containerSx={{ bg: 'neutral8' }}
        wrapperSx={{
          table: {
            '& th': {
              border: 'none',
              pb: 0,
            },
            '& td': {
              py: 2,
            },
            '& th:last-child, td:last-child': {
              pr: 3,
            },
            '& td:last-child': {
              pr: 3,
            },
            '& th:first-child, td:first-child': {
              pl: 3,
            },
          },
          ...(tableProps?.wrapperSx ?? {}),
        }}
        restrictHeight={tableProps?.restrictHeight ?? true}
        externalSource={externalSource}
        onClickRow={externalSource?.handleSelectCopyItem}
      />
    </Box>
  )
}

export function ListForm({
  data,
  externalSource,
}: {
  data: CopyPositionData[] | undefined
  externalSource?: ExternalSource
}) {
  return (
    <Flex py={2} sx={{ width: '100%', height: '100%', overflow: 'hidden auto', flexDirection: 'column', gap: 2 }}>
      {data?.map((positionData) => {
        return (
          <Box
            key={positionData.id}
            sx={{ px: 3, py: 2, bg: 'neutral6', position: 'relative' }}
            onClick={() => externalSource?.handleSelectCopyItem?.(positionData)}
          >
            {positionData.isReverse && (
              <Box sx={{ position: 'absolute', top: 16, left: 8 }}>
                <ReverseTag />
              </Box>
            )}
            <Flex>
              <Box flex="1" sx={{ '& *': { fontWeight: 'bold' }, ...(positionData.isReverse ? { pl: 2 } : {}) }}>
                {renderCopyTitle(positionData)}
              </Box>
              <Box sx={{ flexShrink: 0 }}>{renderStatus(positionData)}</Box>
            </Flex>
            <Divider my={2} color="neutral5" />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <ListHistoryRow
                label={<Trans>Trader</Trans>}
                value={renderTrader(positionData.copyAccount, positionData.protocol)}
              />
              <ListHistoryRow
                label={<Trans>Source Position</Trans>}
                value={renderSource(positionData, undefined, externalSource, true)}
              />
              <ListHistoryRow label={<Trans>Entry</Trans>} value={renderEntry(positionData)} />
              <ListHistoryRow label={<Trans>Size</Trans>} value={renderSizeMobile(positionData)} />
              <ListHistoryRow label={<LabelPnL />} value={renderPnL(positionData, externalSource?.prices)} />
              <ListHistoryRow label={<Trans>Closed Type</Trans>} value={renderCloseType(positionData)} />
              <ListHistoryRow label={<Trans>Open</Trans>} value={renderOpenTime(positionData)} />
              <ListHistoryRow label={<Trans>Close</Trans>} value={renderCloseTime(positionData)} />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

function ListHistoryRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ width: '100%', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      {value}
    </Flex>
  )
}

export const simpleOpeningColumns: ColumnData<CopyPositionData, ExternalSource>[] = [
  {
    title: 'Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '60px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <RelativeShortTimeText date={item.createdAt} suffix="ago" />
      </Type.Caption>
    ),
  },
  // {
  //   title: 'Trader',
  //   dataIndex: 'copyAccount',
  //   key: 'copyAccount',
  //   style: { minWidth: '160px' },
  //   render: (item) => <Type.Caption>{addressShorten(item.copyAccount)}</Type.Caption>,
  // },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item),
  },
  {
    title: <LabelPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '40px', maxWidth: '40px', textAlign: 'right' },
    render: () => <IconBox icon={<CaretRight size={16} />} color="neutral2" />,
  },
]
export const openingColumns: ColumnData<CopyPositionData, ExternalSource>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '90px' },
    render: (item) => (
      <Type.Caption color="neutral1">
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
    title: <LabelPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={1}>Source</Box>,
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '70px', textAlign: 'right' },
    render: renderSource,
  },
]

export const historyColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '172px', width: 172 },
    render: (item) => (
      <Box sx={{ position: 'relative' }}>
        {item.isReverse && <ReverseTag sx={{ top: '-12px', left: '-16px' }} />}
        {renderOpenTime(item)}
      </Box>
    ),
  },
  {
    title: 'Close Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '156px', width: 156 },
    render: renderCloseTime,
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '180px', width: 180 },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px', width: 130 },
    render: renderCopyTitle,
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', width: 100, textAlign: 'center' },
    render: (item, index, externalSource) => renderSource(item, index, externalSource, true),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '150px', width: 150 },
    render: renderEntry,
  },
  {
    title: 'Size',
    dataIndex: 'totalSizeDelta',
    key: 'totalSizeDelta',
    style: { minWidth: '100px', width: 100, textAlign: 'right' },
    render: renderSize,
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    style: { minWidth: '80px', width: 80, textAlign: 'right' },
    render: renderLeverage,
  },
  {
    title: <LabelPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '100px', width: 100, textAlign: 'right' },
    render: (item, _, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box>Closed Type</Box>,
    dataIndex: 'closeType',
    key: 'closeType',
    sortBy: 'closeType',
    style: { minWidth: '120px', width: 120, textAlign: 'left', pl: 2 },
    render: renderCloseType,
  },
  {
    title: <Box pr={2}>Status</Box>,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '80px', width: 80, textAlign: 'left' },
    render: renderStatus,
  },
]

export function LabelPnL() {
  return (
    <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
      ePnL
    </LabelWithTooltip>
  )
}
