import { Trans } from '@lingui/macro'

import { OrderDirectionFilterIcon } from 'components/@dailyTrades/DirectionFilterIcon'
import { OrderActionFilterIcon } from 'components/@dailyTrades/OrderActionFilterIcon'
import { OrderPairFilterIcon } from 'components/@dailyTrades/OrderPairFilterIcon'
import OrderRangeFilterIcon from 'components/@dailyTrades/OrderRangeFilterIcon'
import { ORDER_RANGE_KEYS } from 'components/@dailyTrades/configs'
import {
  renderOrderCollateral,
  renderOrderFee,
  renderOrderLeverage,
  renderOrderPrice,
} from 'components/@position/TraderPositionDetails/ListOrderTable'
import { ORDER_TYPES } from 'components/@position/configs/order'
import { AccountInfo } from 'components/@ui/AccountInfo'
import Market from 'components/@ui/MarketGroup/Market'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { OrderData } from 'entities/trader'
import { ColumnData } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { COLLATERAL_TOKEN_PROTOCOLS } from 'utils/config/constants'
import { OrderTypeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import OrderTime from './OrderTime'

export const orderColumns: ColumnData<OrderData>[] = [
  {
    title: <TimeColumnTitleWrapper>Timestamp</TimeColumnTitleWrapper>,
    dataIndex: 'blockTime',
    key: 'blockTime',
    style: { flex: [1, 1, 1, 2] },
    render: (item) => <OrderTime data={item} />,
  },
  {
    title: <Trans>ACCOUNT</Trans>,
    dataIndex: 'account',
    key: 'account',
    style: { flex: [2, 2, 1.8, 2] },
    render: (item) => (
      <AccountInfo address={item.account} protocol={item.protocol} avatarSize={24} textSx={{ color: 'neutral1' }} />
    ),
  },
  {
    title: <Trans>MARKET</Trans>,
    dataIndex: 'pair',
    key: 'pair',
    style: { flex: 1 },
    filterComponent: <OrderPairFilterIcon />,
    render: (item) => <Market symbol={getSymbolFromPair(item.pair)} hasName symbolNameSx={{ fontSize: '12px' }} />,
  },
  {
    filterComponent: <OrderActionFilterIcon />,
    title: <Trans>ACTION</Trans>,
    dataIndex: 'type',
    key: 'type',
    style: { flex: 1.5 },
    render: (item) => {
      let orderType = item.type
      if (orderType === OrderTypeEnum.INCREASE && item.isOpen) orderType = OrderTypeEnum.OPEN
      if (orderType === OrderTypeEnum.DECREASE && item.isClose) orderType = OrderTypeEnum.CLOSE
      return (
        <Flex alignItems="center" sx={{ gap: 2 }}>
          {ORDER_TYPES[orderType]?.icon}
          <Type.Caption color="neutral1">{ORDER_TYPES[orderType]?.text}</Type.Caption>
        </Flex>
      )
    },
  },
  {
    filterComponent: <OrderDirectionFilterIcon />,
    title: <Trans>DIRECTION</Trans>,
    dataIndex: 'isLong',
    key: 'isLong',
    style: { flex: [1, 1, 1.2, 1, 1.2] },
    render: (item) => (
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.isLong ? 'LONG' : 'SHORT'}</Type.Caption>
      </Flex>
    ),
  },
  {
    filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.leverage as any} />,
    title: <Trans>LEVERAGE</Trans>,
    dataIndex: 'leverage',
    key: 'leverage',
    style: {
      textAlign: 'right',
      flex: 1,
      justifyContent: 'end',
      gap: 1,
      display: ['none', 'none', 'none', 'none', 'flex'],
    },
    render: renderOrderLeverage,
  },
  {
    filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.collateralDeltaNumber as any} />,
    title: <Trans>COLLATERAL</Trans>,
    dataIndex: 'collateralDeltaNumber',
    key: 'collateralDeltaNumber',
    style: { textAlign: 'right', flex: 1.5, display: ['none', 'none', 'none', 'none', 'flex'], justifyContent: 'end' },
    render: (item) => {
      return COLLATERAL_TOKEN_PROTOCOLS.includes(item.protocol) ? (
        renderOrderCollateral(item, 'USDT')
      ) : (
        <Type.Caption>
          {item.collateralDeltaNumber != null ? `$${formatNumber(item.collateralDeltaNumber, 2, 2)}` : `--`}
        </Type.Caption>
      )
    },
  },
  {
    filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.sizeDeltaNumber as any} />,
    title: <Trans>VALUE</Trans>,
    dataIndex: 'sizeDeltaNumber',
    key: 'sizeDeltaNumber',
    style: { textAlign: 'right', flex: 1, justifyContent: 'end', gap: 1 },
    render: (item) => <Type.Caption>${formatNumber(item.sizeDeltaNumber, 2, 2)}</Type.Caption>,
  },
  {
    title: <Trans>MARKET PRICE</Trans>,
    dataIndex: 'priceNumber',
    key: 'priceNumber',
    style: { textAlign: 'right', flex: 1.3, pr: 3 },
    render: renderOrderPrice,
  },
  {
    title: <Trans>PAID FEE</Trans>,
    dataIndex: 'feeNumber',
    key: 'feeNumber',
    style: { textAlign: 'right', flex: 1, pr: 3, display: ['none', 'none', 'none', 'none', 'flex'] },
    render: renderOrderFee,
  },
]

export const ORDER_FILTER_TYPE_MAPPING: { [key in OrderTypeEnum]?: any } = {
  [OrderTypeEnum.OPEN]: { field: 'type', match: OrderTypeEnum.OPEN },
  [OrderTypeEnum.INCREASE]: { field: 'type', match: OrderTypeEnum.INCREASE },
  [OrderTypeEnum.DECREASE]: { field: 'type', match: OrderTypeEnum.DECREASE },
  [OrderTypeEnum.CLOSE]: { field: 'type', match: OrderTypeEnum.CLOSE },
  [OrderTypeEnum.LIQUIDATE]: { field: 'type', match: OrderTypeEnum.LIQUIDATE },
  [OrderTypeEnum.MARGIN_TRANSFERRED]: { field: 'type', match: OrderTypeEnum.MARGIN_TRANSFERRED },
}
