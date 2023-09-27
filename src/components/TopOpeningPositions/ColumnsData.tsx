import { CaretRight } from '@phosphor-icons/react'
import React from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { DualTimeText } from 'components/@ui/DecoratedText/TimeText'
import { renderEntry, renderOpeningPnL, renderSizeOpening } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import FavoriteButton from 'components/FavoriteButton'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Box, Flex, Type } from 'theme/base'

import { SignedText } from '../@ui/DecoratedText/SignedText'

export type ExternalSource = {
  prices: UsdPrices
}
export const TopOpeningColumns: ColumnData<PositionData, ExternalSource>[] = [
  {
    title: 'Open Time',
    dataIndex: 'blockTime',
    key: 'blockTime',
    sortBy: 'blockTime',
    style: { minWidth: '140px' },
    render: (item) => <DualTimeText color="neutral1" date={item.blockTime} />,
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
    dataIndex: 'entryFundingRate',
    key: 'entryFundingRate',
    style: { minWidth: '180px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    sortBy: 'size',
    style: { minWidth: '200px' },
    render: (item, index, externalSource) =>
      externalSource?.prices ? renderSizeOpening(item, externalSource?.prices) : '--',
  },
  {
    title: 'PnL $',
    dataIndex: 'realisedPnl',
    key: 'realisedPnl',
    sortBy: 'pnl',
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    render: (item, index, externalSource) =>
      externalSource?.prices ? renderOpeningPnL(item, externalSource?.prices, true) : '--',
  },
  {
    title: 'Fee $',
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
    title: 'Net Pnl $',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    render: (item, index, externalSource) =>
      externalSource?.prices ? renderOpeningPnL(item, externalSource?.prices) : '--',
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
