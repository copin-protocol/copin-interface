import { gql } from '@apollo/client'
import { Trans } from '@lingui/macro'

import { OrderActionFilterTitle } from 'components/@dailyTrades/OrderActionFilterTitle'
import { OrderPairFilterTitle } from 'components/@dailyTrades/OrderPairFilterTitle'
import OrderRangeFilterIcon from 'components/@dailyTrades/OrderRangeFilterIcon'
import { ORDER_RANGE_KEYS } from 'components/@dailyTrades/configs'
import {
  renderOrderBlockTime,
  renderOrderCollateral,
  renderOrderFee,
  renderOrderLeverage,
  renderOrderPrice,
} from 'components/@position/TraderPositionDetails/ListOrderTable'
import { ORDER_TYPES } from 'components/@position/configs/order'
import Market from 'components/@ui/MarketGroup/Market'
import TraderAddress from 'components/@ui/TraderAddress'
import { OrderData } from 'entities/trader'
import { ColumnData } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

export const SEARCH_ORDERS_INDEX = 'copin.orders'
export const SEARCH_FUNCTION_NAME = 'searchOrders'

export const SEARCH_DAILY_ORDERS_QUERY = gql`
  query Search($index: String!, $body: SearchPayload!) {
    ${SEARCH_FUNCTION_NAME}(index: $index, body: $body) {
      data  {
        id
        account
        key
        protocol
        txHash
        indexToken
        collateralToken
        sizeDeltaNumber
        sizeNumber
        collateralDeltaNumber
        collateralNumber
        collateralDeltaInTokenNumber
        sizeDeltaInTokenNumber
        realisedPnlNumber
        priceNumber
        sizeTokenNumber
        averagePriceNumber
        feeNumber
        fundingNumber
        realisedPnl
        isLong
        isOpen
        isClose
        leverage
        type
        logId
        blockNumber
        protocol
        blockTime
        createdAt
        pair
      }
      meta {
        total
        limit
        offset
        totalPages
      }
    }
  }
`

export const orderColumns: ColumnData<OrderData>[] = [
  {
    title: <Trans>TIMESTAMP</Trans>,
    dataIndex: 'blockTime',
    key: 'blockTime',
    style: { flex: 2 },
    render: (item) => renderOrderBlockTime(item),
  },
  {
    title: <Trans>ACCOUNT</Trans>,
    dataIndex: 'account',
    key: 'account',
    style: { flex: 2 },
    render: (item) => <TraderAddress address={item.account} protocol={item.protocol} />,
  },
  {
    title: <OrderPairFilterTitle />,
    dataIndex: 'pair',
    key: 'pair',
    style: { flex: 1 },
    render: (item) => <Market symbol={getSymbolFromPair(item.pair)} hasName symbolNameSx={{ fontSize: '13px' }} />,
  },
  {
    title: <OrderActionFilterTitle />,
    dataIndex: 'type',
    key: 'type',
    style: { flex: 1 },
    render: (item) => (
      <Flex alignItems="center" sx={{ gap: 2 }}>
        {ORDER_TYPES[item.type]?.icon}
        <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{ORDER_TYPES[item.type]?.text}</Type.Caption>
      </Flex>
    ),
  },
  {
    filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.leverage as any} />,
    title: <Trans>LEVERAGE</Trans>,
    dataIndex: 'leverage',
    key: 'leverage',
    style: { textAlign: 'right', flex: 1, justifyContent: 'end', gap: 1 },
    render: renderOrderLeverage,
  },
  {
    title: <Trans>COLLATERAL</Trans>,
    dataIndex: 'collateralDeltaNumber',
    key: 'collateralDeltaNumber',
    style: { textAlign: 'right', flex: 1, display: ['none', 'none', 'none', 'none', 'block'] },
    render: (item) => renderOrderCollateral(item, 'USDT'),
  },
  {
    filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.sizeDeltaNumber as any} />,
    title: <Trans>SIZE ($)</Trans>,
    dataIndex: 'sizeDeltaNumber',
    key: 'sizeDeltaNumber',
    style: { textAlign: 'right', flex: 1, justifyContent: 'end', gap: 1 },
    render: (item) => <Type.Caption>{formatNumber(item.sizeDeltaNumber, 2, 2)}</Type.Caption>,
  },
  {
    title: <Trans>MARKET PRICE ($)</Trans>,
    dataIndex: 'priceNumber',
    key: 'priceNumber',
    style: { textAlign: 'right', flex: 1, pr: 3 },
    render: renderOrderPrice,
  },
  {
    title: <Trans>PAID FEE ($)</Trans>,
    dataIndex: 'feeNumber',
    key: 'feeNumber',
    style: { textAlign: 'right', flex: 1, pr: 3, display: ['none', 'none', 'none', 'none', 'block'] },
    render: renderOrderFee,
  },
]
