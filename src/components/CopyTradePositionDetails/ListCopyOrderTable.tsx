import { Trans } from '@lingui/macro'
import { ArrowFatDown, ArrowFatUp, Square } from '@phosphor-icons/react'
import { ReactNode, useMemo } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyOrderData } from 'entities/copyTrade.d'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { OrderTypeEnum } from 'utils/config/enums'
import { TokenTrade } from 'utils/config/trades'

type ExternalSource = {
  totalOrders: number
  symbol: string
  isOpening?: boolean
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
}

export default function ListCopyOrderTable({
  data,
  isLoading,
  isOpening,
  token,
}: {
  data: CopyOrderData[]
  isLoading: boolean
  isOpening?: boolean
  token: TokenTrade
}) {
  const orders = data.sort((x, y) => (x.createdAt < y.createdAt ? 1 : x.createdAt > y.createdAt ? -1 : 0))
  const tableData = { data: orders, meta: { limit: orders.length, offset: 0, total: orders.length, totalPages: 1 } }

  const columns = useMemo(() => {
    const result: ColumnData<CopyOrderData, ExternalSource>[] = [
      {
        title: 'Timestamp',
        dataIndex: 'createdAt',
        key: 'createdAt',
        style: { minWidth: '150px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral1">
              <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'isIncrease',
        key: 'isIncrease',
        style: { minWidth: '120px' },
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
        title: 'Collateral ($)',
        dataIndex: 'collateral',
        key: 'collateral',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) =>
          item.collateral ? (
            <DeltaText
              color="neutral1"
              type={item.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE}
              delta={item.collateral}
              maxDigit={2}
              minDigit={2}
            />
          ) : (
            '--'
          ),
      },
      {
        title: 'Size ($)',
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
            />
          ) : (
            '--'
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
            suffix={` ${externalSource?.symbol}`}
          />
        ),
      },
      {
        title: 'Market Price',
        dataIndex: 'price',
        key: 'price',
        style: { minWidth: '120px', textAlign: 'right', pr: 3 },
        render: (item) =>
          item.price ? (
            <Type.Caption color="neutral1" width="100%" textAlign="right">
              {PriceTokenText({
                value: item.price,
                maxDigit: 2,
                minDigit: 2,
              })}
            </Type.Caption>
          ) : (
            '--'
          ),
      },
    ]
    return result
  }, [])

  const externalSource: ExternalSource = {
    isOpening,
    totalOrders: tableData.meta.total,
    symbol: token.symbol,
  }
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Table
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
