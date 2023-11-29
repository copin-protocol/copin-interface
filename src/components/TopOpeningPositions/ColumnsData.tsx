import { CaretRight } from '@phosphor-icons/react'
import React from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { DualTimeText } from 'components/@ui/DecoratedText/TimeText'
import { renderEntry, renderOpeningPnL, renderOpeningRoi, renderSizeOpening } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import FavoriteButton from 'components/FavoriteButton'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Box, Flex, Type } from 'theme/base'

export type ExternalSource = {
  prices: UsdPrices
}
export const topOpeningColumns: ColumnData<PositionData, ExternalSource>[] = [
  {
    title: 'Open Time',
    dataIndex: 'openBlockTime',
    key: 'openBlockTime',
    sortBy: 'openBlockTime',
    style: { minWidth: '140px' },
    render: (item) => <DualTimeText color="neutral1" date={item.openBlockTime} />,
  },
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    style: { minWidth: '180px' },
    render: (item) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <AccountInfo isOpenPosition={true} address={item.account} protocol={item.protocol} />
        <FavoriteButton address={item.account} />
      </Flex>
    ),
  },
  {
    title: 'Entry',
    dataIndex: 'indexToken',
    key: 'indexToken',
    style: { minWidth: '180px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    sortBy: 'size',
    style: { minWidth: '200px' },
    render: (item) => renderSizeOpening(item),
  },
  {
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    sortBy: 'pnl',
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    render: (item) => renderOpeningPnL(item, true),
  },
  {
    title: 'Fee',
    dataIndex: 'fee',
    key: 'fee',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        <SignedText value={-item.fee} maxDigit={0} />
      </Type.Caption>
    ),
  },
  {
    title: 'ROI',
    dataIndex: 'roi',
    key: 'roi',
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    render: (item) => renderOpeningRoi(item),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { width: '20px', textAlign: 'right' },
    render: () => (
      <Box sx={{ position: 'relative', top: '3px' }}>
        <CaretRight />
      </Box>
    ),
  },
]
