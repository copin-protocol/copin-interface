import React from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { ColumnData } from 'components/@ui/Table/types'
import { TraderData } from 'entities/trader'
import { Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export type ExternalSource = {
  keyword?: string
}
export const searchResultsColumn: ColumnData<TraderData, ExternalSource>[] = [
  {
    title: 'Trader',
    dataIndex: 'account',
    key: 'account',
    sortBy: 'account',
    style: { minWidth: '236px' },
    render: (item, _, externalSource) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <AccountInfo
          isOpenPosition={item.isOpenPosition}
          keyword={externalSource?.keyword}
          address={item.account}
          smartAccount={item.smartAccount}
          protocol={item.protocol}
          size={40}
          sx={{
            width: 168,
          }}
        />
      </Flex>
    ),
  },
  {
    title: 'Protocol',
    dataIndex: 'protocol',
    key: 'protocol',
    sortBy: 'protocol',
    style: { minWidth: '130px' },
    render: (item) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <ProtocolLogo protocol={item.protocol} isActive={true} size={24} />
      </Flex>
    ),
  },
  {
    title: 'Last Trade',
    dataIndex: 'lastTradeAt',
    key: 'lastTradeAt',
    sortBy: 'lastTradeAtTs',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral1">
        <RelativeTimeText date={item.lastTradeAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Win Rate',
    dataIndex: 'winRate',
    key: 'winRate',
    sortBy: 'winRate',
    style: { minWidth: '75px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        <Type.Caption>{item.winRate ? `${formatNumber(item.winRate, 0, 0)}%` : '--'}</Type.Caption>
      </Type.Caption>
    ),
  },
  {
    title: 'Total Trades',
    dataIndex: 'totalTrade',
    key: 'totalTrade',
    sortBy: 'totalTrade',
    style: { minWidth: '90px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalTrade, 0, 0)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    sortBy: 'totalVolume',
    style: { minWidth: '120px', textAlign: 'right', pr: 3 },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalVolume, 0, 0)}
      </Type.Caption>
    ),
  },
]
