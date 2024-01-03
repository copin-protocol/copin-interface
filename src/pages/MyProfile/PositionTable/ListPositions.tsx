import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import ReverseTag from 'components/@ui/ReverseTag'
import Table from 'components/@ui/Table'
import { ColumnData, TableProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import { Box, Flex, Type } from 'theme/base'

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
  renderValue,
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
        restrictHeight
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
              <ListHistoryRow label={<Trans>PNL</Trans>} value={renderPnL(positionData, externalSource?.prices)} />
              <ListHistoryRow label={<Trans>Closed Type</Trans>} value={renderCloseType(positionData)} />
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Flex sx={{ gap: 1 }}>
                  <Type.Caption color="neutral3">
                    <Trans>Open:</Trans>
                  </Type.Caption>
                  {renderOpenTime(positionData)}
                </Flex>
                <Flex sx={{ gap: 1 }}>
                  <Type.Caption color="neutral3">
                    <Trans>Closed:</Trans>
                  </Type.Caption>
                  {renderCloseTime(positionData)}
                </Flex>
              </Flex>
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
    title: 'PnL',
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
    style: { minWidth: '120px' },
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
    style: { minWidth: '110px' },
    render: renderCloseTime,
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '180px' },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px' },
    render: renderCopyTitle,
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', textAlign: 'center' },
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
    title: 'Value',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '200px', width: 200, textAlign: 'right' },
    render: renderValue,
  },
  {
    title: 'Size',
    dataIndex: 'totalSizeDelta',
    key: 'totalSizeDelta',
    style: { minWidth: '130px', width: 130, textAlign: 'right' },
    render: renderSize,
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    style: { minWidth: '100px', textAlign: 'right' },
    render: renderLeverage,
  },
  {
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '130px', width: 130, textAlign: 'right' },
    render: (item, _, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={1}>Closed Type</Box>,
    dataIndex: 'closeType',
    key: 'closeType',
    sortBy: 'closeType',
    style: { minWidth: '100px', textAlign: 'right' },
    render: renderCloseType,
  },
  {
    title: <Box pr={2}>Status</Box>,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '100px', textAlign: 'right' },
    render: renderStatus,
  },
]
