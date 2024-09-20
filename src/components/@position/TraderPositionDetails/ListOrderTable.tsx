import { Trans } from '@lingui/macro'
import { ArrowFatDown, ArrowFatUp, Circle, Square } from '@phosphor-icons/react'
import { ReactNode, useMemo } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { OrderData } from 'entities/trader.d'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, ORDERBOOK_PROTOCOLS } from 'utils/config/constants'
import { MarginModeEnum, OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatLeverage } from 'utils/helpers/format'

type ExternalSource = {
  totalOrders: number
  highlightTxHash?: string
}

type ObjectTypes = {
  [key: string]: {
    text: ReactNode
    icon: ReactNode
  }
}

export const ORDER_TYPES: ObjectTypes = {
  [OrderTypeEnum.OPEN]: {
    text: <Trans>Open</Trans>,
    icon: <IconBox icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.CLOSE]: {
    text: <Trans>Close</Trans>,
    icon: <IconBox icon={<Square weight={'fill'} />} />,
  },
  [OrderTypeEnum.INCREASE]: {
    text: <Trans>Increase</Trans>,
    icon: <IconBox icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.DECREASE]: {
    text: <Trans>Decrease</Trans>,
    icon: <IconBox icon={<ArrowFatDown weight={'fill'} />} />,
  },
  [OrderTypeEnum.LIQUIDATE]: {
    text: <Trans>Liquidation</Trans>,
    icon: <IconBox color={'red2'} icon={<Square weight={'fill'} />} />,
  },
  [OrderTypeEnum.MARGIN_TRANSFERRED]: {
    text: <Trans>Modified Margin</Trans>,
    icon: <IconBox color={'orange1'} icon={<Circle weight={'fill'} />} />,
  },
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

  const isFeeWithFunding = protocol === ProtocolEnum.HYPERLIQUID

  const columns = useMemo(() => {
    const result: ColumnData<OrderData, ExternalSource>[] = [
      {
        title: 'Timestamp',
        dataIndex: 'blockTime',
        key: 'blockTime',
        style: { minWidth: '182px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral1">
              <LocalTimeText date={item.blockTime} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
            </Type.Caption>

            {/* TODO: Check when add new protocol like Hyperliquid */}
            {!ORDERBOOK_PROTOCOLS.includes(protocol) && (
              <ExplorerLogo
                protocol={protocol}
                explorerUrl={`${PROTOCOL_PROVIDER[protocol]?.explorerUrl}/tx/${item.txHash}`}
                size={18}
              />
            )}
          </Flex>
        ),
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
        render: (item) => (
          <Type.Caption color="neutral1" textAlign="right">
            {item.type === OrderTypeEnum.MARGIN_TRANSFERRED ||
            (item.marginMode === MarginModeEnum.ISOLATED && (item.leverage == null || item.leverage < 0))
              ? '--'
              : formatLeverage(item.marginMode, item.leverage)}
          </Type.Caption>
        ),
      },
      {
        title: 'Collateral Delta',
        dataIndex: 'collateralDeltaNumber',
        key: 'collateralDeltaNumber',
        style: { minWidth: '105px', textAlign: 'right' },
        render: (item) => (
          <Flex justifyContent="flex-end" alignItems="center">
            <ValueOrToken
              protocol={item.protocol}
              indexToken={item.collateralToken}
              value={item.collateralDeltaNumber}
              valueInToken={item.collateralDeltaInTokenNumber}
              component={
                <DeltaText
                  color="neutral1"
                  type={item.type}
                  delta={item.collateralToken ? item.collateralDeltaInTokenNumber : item.collateralDeltaNumber}
                  maxDigit={item.collateralToken ? 2 : undefined}
                  minDigit={item.collateralToken ? 2 : undefined}
                />
              }
            />
          </Flex>
        ),
      },
      {
        title: 'Size Delta',
        dataIndex: 'sizeDeltaNumber',
        key: 'sizeDeltaNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item) =>
          item.type === OrderTypeEnum.MARGIN_TRANSFERRED ? (
            <Type.Caption color="neutral1">--</Type.Caption>
          ) : (
            <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'end' }}>
              <ValueOrToken
                protocol={item.protocol}
                indexToken={item.collateralToken}
                value={item.sizeDeltaNumber}
                valueInToken={item.sizeDeltaInTokenNumber}
                component={
                  <DeltaText
                    color="neutral1"
                    type={item.type}
                    delta={Math.abs(item.sizeDeltaNumber ?? item.sizeDeltaInTokenNumber)}
                  />
                }
              />
            </Flex>
          ),
      },
      {
        title: 'Market Price',
        dataIndex: 'priceNumber',
        key: 'priceNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color="neutral1" width="100%" textAlign="right">
            {item.type === OrderTypeEnum.MARGIN_TRANSFERRED
              ? '--'
              : PriceTokenText({
                  value: item.priceNumber,
                  maxDigit: 2,
                  minDigit: 2,
                })}
          </Type.Caption>
        ),
      },
      {
        title: isFeeWithFunding ? 'Fee & Funding' : 'Paid Fee',
        dataIndex: 'feeNumber',
        key: 'feeNumber',
        style: { minWidth: isFeeWithFunding ? '120px' : '85px', textAlign: 'right', pr: 3 },
        render: (item) => (
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
        ),
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
