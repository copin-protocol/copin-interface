import { useMemo } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { OrderData } from 'entities/trader.d'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, FEE_WITH_FUNDING_PROTOCOLS, NO_TX_HASH_PROTOCOLS } from 'utils/config/constants'
import { MarginModeEnum, OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatLeverage } from 'utils/helpers/format'

import { ORDER_TYPES } from '../configs/order'

type ExternalSource = {
  totalOrders: number
  highlightTxHash?: string
}

export default function ListOrderTable({
  protocol,
  data,
  isLoading,
  highlightTxHash,
}: {
  protocol: ProtocolEnum
  data: OrderData[]
  isLoading: boolean
  highlightTxHash?: string
}) {
  const orders = [...(data ?? [])].reverse()

  const tableData = useMemo(() => {
    return { data: orders, meta: { limit: orders.length, offset: 0, total: orders.length, totalPages: 1 } }
  }, [orders])

  const isFeeWithFunding = FEE_WITH_FUNDING_PROTOCOLS.includes(protocol)

  const columns = useMemo(() => {
    const result: ColumnData<OrderData, ExternalSource>[] = [
      {
        title: 'Timestamp',
        dataIndex: 'blockTime',
        key: 'blockTime',
        style: { minWidth: '182px' },
        render: (item) => renderOrderBlockTime(item),
      },
      {
        title: 'Action',
        dataIndex: 'type',
        key: 'type',
        style: { minWidth: '120px' },
        render: (item, index, externalSource) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            {item.isOpen || (externalSource && externalSource.totalOrders && index === externalSource.totalOrders - 1)
              ? ORDER_TYPES[OrderTypeEnum.OPEN].icon
              : item.isClose && item.type !== OrderTypeEnum.LIQUIDATE
              ? ORDER_TYPES[OrderTypeEnum.CLOSE].icon
              : ORDER_TYPES[item.type].icon}
            <Type.Caption color="neutral1">
              {item.isOpen || (externalSource && externalSource.totalOrders && index === externalSource.totalOrders - 1)
                ? ORDER_TYPES[OrderTypeEnum.OPEN].text
                : item.isClose && item.type !== OrderTypeEnum.LIQUIDATE
                ? ORDER_TYPES[OrderTypeEnum.CLOSE].text
                : ORDER_TYPES[item.type].text}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '70px', textAlign: 'right' },
        render: renderOrderLeverage,
      },
      {
        title: 'Collateral Delta',
        dataIndex: 'collateralDeltaNumber',
        key: 'collateralDeltaNumber',
        style: { minWidth: '105px', textAlign: 'right' },
        render: (item) => renderOrderCollateral(item),
      },
      {
        title: 'Size Delta',
        dataIndex: 'sizeDeltaNumber',
        key: 'sizeDeltaNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item) => renderOrderSize(item),
      },
      {
        title: 'Market Price',
        dataIndex: 'priceNumber',
        key: 'priceNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: renderOrderPrice,
      },
      {
        title: isFeeWithFunding ? 'Fee & Funding' : 'Paid Fee',
        dataIndex: 'feeNumber',
        key: 'feeNumber',
        style: { minWidth: isFeeWithFunding ? '120px' : '85px', textAlign: 'right', pr: 3 },
        render: renderOrderFee,
      },
    ]
    return result
  }, [protocol])

  const externalSource: ExternalSource = {
    totalOrders: tableData.meta.total,
  }
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Table
        wrapperSx={{
          display: 'block !important',
          pr: 0,
          table: {
            '& th:first-child, td:first-child': {
              pl: 3,
            },
          },
        }}
        data={tableData?.data}
        columns={columns}
        isLoading={isLoading}
        externalSource={externalSource}
        tableBodyWrapperSx={{ overflow: 'auto' }}
        renderRowBackground={(data, _) =>
          !!data.txHash && !!highlightTxHash && data.txHash === highlightTxHash
            ? 'rgba(78, 174, 253, 0.2)'
            : 'transparent'
        }
      />
    </Box>
  )
}

export const renderOrderBlockTime = (item: OrderData, format = DAYJS_FULL_DATE_FORMAT) => (
  <Flex alignItems="center" sx={{ gap: 2 }}>
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.blockTime} format={format} hasTooltip={false} />
    </Type.Caption>
    {/* TODO: Check when add new protocol like Hyperliquid */}
    {!NO_TX_HASH_PROTOCOLS.includes(item.protocol) && (
      <ExplorerLogo
        protocol={item.protocol}
        explorerUrl={`${PROTOCOL_PROVIDER[item.protocol]?.explorerUrl}/tx/${item.txHash}`}
        size={18}
      />
    )}
  </Flex>
)

export const renderOrderLeverage = (item: OrderData) => (
  <Type.Caption color="neutral1" textAlign="right">
    {item.type === OrderTypeEnum.MARGIN_TRANSFERRED ||
    (item.marginMode === MarginModeEnum.ISOLATED && (item.leverage == null || item.leverage < 0))
      ? '--'
      : formatLeverage(item.marginMode, item.leverage)}
  </Type.Caption>
)
export const renderOrderCollateral = (item: OrderData, defaultToken?: string) => (
  <Flex justifyContent="flex-end" alignItems="center">
    <ValueOrToken
      protocol={item.protocol}
      indexToken={item.collateralToken}
      value={item.collateralDeltaNumber}
      valueInToken={item.collateralDeltaInTokenNumber}
      defaultToken={defaultToken}
      component={
        <DeltaText
          color="neutral1"
          type={item.type}
          delta={item.collateralDeltaNumber ? item.collateralDeltaNumber : item.collateralDeltaInTokenNumber}
          maxDigit={item.collateralToken ? 2 : undefined}
          minDigit={item.collateralToken ? 2 : undefined}
        />
      }
    />
  </Flex>
)
export const renderOrderSize = (item: OrderData, defaultToken?: string) =>
  item.type === OrderTypeEnum.MARGIN_TRANSFERRED ? (
    <Type.Caption color="neutral1">--</Type.Caption>
  ) : (
    <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'end' }}>
      <ValueOrToken
        protocol={item.protocol}
        indexToken={item.collateralToken}
        value={item.sizeDeltaNumber}
        valueInToken={item.sizeDeltaInTokenNumber}
        defaultToken={defaultToken}
        component={
          <DeltaText
            color="neutral1"
            type={item.type}
            delta={Math.abs(item.sizeDeltaNumber ?? item.sizeDeltaInTokenNumber)}
          />
        }
      />
    </Flex>
  )

export const renderOrderPrice = (item: OrderData) => (
  <Type.Caption color="neutral1" width="100%" textAlign="right">
    {item.type === OrderTypeEnum.MARGIN_TRANSFERRED ? (
      <>--</>
    ) : (
      <PriceTokenText value={item.priceNumber} maxDigit={2} minDigit={2} />
    )}
  </Type.Caption>
)

export const renderOrderFee = (item: OrderData) => {
  const isFeeWithFunding = FEE_WITH_FUNDING_PROTOCOLS.includes(item.protocol)

  return (
    <Type.Caption color="neutral1" width="100%" textAlign="right" sx={{ display: 'flex', justifyContent: 'end' }}>
      <ValueOrToken
        protocol={isFeeWithFunding ? undefined : item.protocol}
        indexToken={isFeeWithFunding ? undefined : item.collateralToken}
        value={isFeeWithFunding ? (item.feeNumber ?? 0) * -1 : item.feeNumber}
        valueInToken={isFeeWithFunding ? undefined : item.feeInTokenNumber}
        maxDigit={2}
        minDigit={2}
        hasPrefix={false}
      />
    </Type.Caption>
  )
}
