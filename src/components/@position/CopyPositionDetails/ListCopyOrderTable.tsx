import { ArrowRight } from '@phosphor-icons/react'
import { useMemo } from 'react'

import { ORDER_TYPES } from 'components/@position/configs/order'
import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { CopyOrderData } from 'entities/copyTrade.d'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, NO_TX_HASH_PROTOCOLS } from 'utils/config/constants'
import { CopyTradePlatformEnum, OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { EXPLORER_PLATFORMS } from 'utils/config/platforms'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { getPairFromSymbol } from 'utils/helpers/transform'

type ExternalSource = {
  totalOrders: number
  symbol: string
  isOpening?: boolean
}

const getCopyTradingFee = () => 0.00025

export default function ListCopyOrderTable({
  data,
  isLoading,
  isOpening,
  symbol,
  platform,
  protocol,
}: {
  data: CopyOrderData[]
  isLoading: boolean
  isOpening?: boolean
  symbol: string
  platform?: CopyTradePlatformEnum
  protocol?: ProtocolEnum
}) {
  const orders = data.sort((x, y) => (x.createdAt < y.createdAt ? 1 : x.createdAt > y.createdAt ? -1 : 0))
  const tableData = { data: orders, meta: { limit: orders.length, offset: 0, total: orders.length, totalPages: 1 } }

  const columns = useMemo(() => {
    const result: ColumnData<CopyOrderData, ExternalSource>[] = [
      {
        title: 'Source',
        dataIndex: 'createdAt',
        key: 'createdAt',
        style: { minWidth: '200px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral1">
              <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
            </Type.Caption>
            {!!protocol && !NO_TX_HASH_PROTOCOLS.includes(protocol) && (
              <ExplorerLogo
                protocol={protocol}
                explorerUrl={`${PROTOCOL_PROVIDER[protocol]?.explorerUrl}/tx/${item.txHash}`}
                size={18}
              />
            )}
          </Flex>
        ),
      },
      ...(platform === CopyTradePlatformEnum.SYNTHETIX_V3 ||
      platform === CopyTradePlatformEnum.SYNTHETIX_V2 ||
      platform === CopyTradePlatformEnum.GNS_V8
        ? ([
            {
              title: 'Transaction',
              dataIndex: 'settleTxHash',
              key: 'settleTxHash',
              style: { minWidth: '120px' },
              render: (item) => (
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  {!!item.submitTxHash && (
                    <ExplorerLogo
                      exchange={platform}
                      explorerUrl={`${EXPLORER_PLATFORMS[platform]}/tx/${item.submitTxHash}`}
                      size={18}
                    />
                  )}
                  {!!item.submitTxHash && !!item.settleTxHash && <ArrowRight size={16} />}
                  {!!item.settleTxHash && (
                    <ExplorerLogo
                      exchange={platform}
                      explorerUrl={`${EXPLORER_PLATFORMS[platform]}/tx/${item.settleTxHash}`}
                      size={18}
                    />
                  )}
                </Flex>
              ),
            },
          ] as ColumnData<CopyOrderData, ExternalSource>[])
        : []),
      {
        title: 'Action',
        dataIndex: 'isIncrease',
        key: 'isIncrease',
        style: { minWidth: '100px' },
        render: (item, index, externalSource) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            {!externalSource?.isOpening && !item.isIncrease && index === 0
              ? ORDER_TYPES[OrderTypeEnum.CLOSE].icon
              : externalSource && externalSource.totalOrders && index === externalSource.totalOrders - 1
              ? ORDER_TYPES[OrderTypeEnum.OPEN].icon
              : ORDER_TYPES[item.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE].icon}
            <Type.Caption color="neutral1">
              {!externalSource?.isOpening && !item.isIncrease && index === 0
                ? ORDER_TYPES[OrderTypeEnum.CLOSE].text
                : externalSource && externalSource.totalOrders && index === externalSource.totalOrders - 1
                ? ORDER_TYPES[OrderTypeEnum.OPEN].text
                : ORDER_TYPES[item.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE].text}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item, index, externalSource) => (
          <DeltaText
            color="neutral1"
            type={item.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE}
            delta={item.size}
            maxDigit={4}
            minDigit={4}
            suffix={`${externalSource?.symbol}`}
            prefix="$"
          />
        ),
      },
      {
        title: 'Value',
        dataIndex: 'sizeUsd',
        key: 'sizeUsd',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) =>
          item.sizeUsd ? (
            <DeltaText
              color="neutral1"
              type={item.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE}
              delta={item.sizeUsd}
              maxDigit={0}
              prefix="$"
            />
          ) : (
            '--'
          ),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <Type.Caption color={item.leverage ? 'neutral1' : 'neutral3'}>
            {item.leverage ? `${formatNumber(item.leverage, 1, 1)}x` : '--'}
          </Type.Caption>
        ),
      },
      {
        title: 'Collateral',
        dataIndex: 'collateral',
        key: 'collateral',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) =>
          item.collateral ? (
            <DeltaText
              color="neutral1"
              type={
                platform === CopyTradePlatformEnum.SYNTHETIX_V3 ||
                platform === CopyTradePlatformEnum.SYNTHETIX_V2 ||
                platform === CopyTradePlatformEnum.GNS_V8
                  ? item.collateral > 0
                    ? OrderTypeEnum.INCREASE
                    : OrderTypeEnum.DECREASE
                  : item.isIncrease
                  ? OrderTypeEnum.INCREASE
                  : OrderTypeEnum.DECREASE
              }
              delta={Math.abs(item.collateral)}
              maxDigit={2}
              minDigit={2}
              prefix="$"
            />
          ) : (
            '--'
          ),
      },

      ...(platform === CopyTradePlatformEnum.GNS_V8
        ? ([
            {
              title: 'Copy Fee',
              dataIndex: 'fee',
              key: 'fee',
              style: { minWidth: '120px', textAlign: 'right' },
              render: (item) => (
                <Type.Caption color={item.sizeUsd ? 'neutral1' : 'neutral3'}>
                  {item.sizeUsd ? `${formatNumber(item.sizeUsd * getCopyTradingFee(), 2, 2)}` : '--'}
                </Type.Caption>
              ),
            },
          ] as ColumnData<CopyOrderData, ExternalSource>[])
        : []),

      ...(platform === CopyTradePlatformEnum.SYNTHETIX_V3
        ? ([
            {
              title: 'Funding',
              dataIndex: 'funding',
              key: 'funding',
              style: { minWidth: '120px', textAlign: 'right' },
              render: (item) =>
                item.funding ? (
                  <DeltaText
                    color="neutral1"
                    type={item.funding > 0 ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE}
                    delta={Math.abs(item.funding)}
                    maxDigit={2}
                    minDigit={2}
                  />
                ) : (
                  '--'
                ),
            },
            {
              title: 'Fee',
              dataIndex: 'fee',
              key: 'fee',
              style: { minWidth: '120px', textAlign: 'right' },
              render: (item) => (
                <Type.Caption color={item.fee ? 'neutral1' : 'neutral3'}>
                  {item.fee ? `${formatNumber(item.fee, 2, 2)}` : '--'}
                </Type.Caption>
              ),
            },
          ] as ColumnData<CopyOrderData, ExternalSource>[])
        : []),
      ...(platform === CopyTradePlatformEnum.SYNTHETIX_V3 || platform === CopyTradePlatformEnum.SYNTHETIX_V2
        ? ([
            {
              title: 'Fee',
              dataIndex: 'fee',
              key: 'fee',
              style: { minWidth: '120px', textAlign: 'right' },
              render: (item) => (
                <Type.Caption color={item.fee ? 'neutral1' : 'neutral3'}>
                  {item.fee ? `${formatNumber(item.fee, 2, 2)}` : '--'}
                </Type.Caption>
              ),
            },
          ] as ColumnData<CopyOrderData, ExternalSource>[])
        : []),
      {
        title: 'Market Price',
        dataIndex: 'price',
        key: 'price',
        style: { minWidth: '120px', textAlign: 'right', pr: 3 },
        render: (item) => {
          const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
          const hlDecimals = getHlSzDecimalsByPair?.(getPairFromSymbol(symbol))
          return item.price ? (
            <Type.Caption color="neutral1" width="100%" textAlign="right">
              {PriceTokenText({
                value: item.price,
                maxDigit: 2,
                minDigit: 2,
                hlDecimals,
              })}
            </Type.Caption>
          ) : (
            '--'
          )
        },
      },
    ]
    return result
  }, [])

  const externalSource: ExternalSource = {
    isOpening,
    totalOrders: tableData.meta.total,
    symbol,
  }
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Table
        tableBodyWrapperSx={{ overflow: 'auto', flex: 'auto' }}
        wrapperSx={{
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
        renderRowBackground={() => 'transparent'}
        restrictHeight
      />
    </Box>
  )
}
