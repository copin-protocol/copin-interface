import { Trans } from '@lingui/macro'
import { ArrowFatDown, ArrowFatUp, Square } from '@phosphor-icons/react'
import { ReactNode, useMemo } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import { OrderData } from 'entities/trader.d'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

type ExternalSource = {
  totalOrders: number
}

type ObjectTypes = {
  [key: string]: {
    text: ReactNode
    icon: ReactNode
  }
}

const ORDER_TYPES: ObjectTypes = {
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

export default function ListOrderTable({
  protocol,
  data,
  isLoading,
}: {
  protocol: ProtocolEnum
  data: OrderData[]
  isLoading: boolean
}) {
  let orders = data.sort((x, y) =>
    x.blockTime < y.blockTime ? 1 : x.blockTime > y.blockTime ? -1 : x.logId < y.logId ? 1 : x.logId > y.logId ? -1 : 0
  )
  if (protocol === ProtocolEnum.GMX) {
    orders = orders.filter((e) => e.type !== OrderTypeEnum.CLOSE)
  }
  const tableData = useMemo(() => {
    return { data: orders, meta: { limit: orders.length, offset: 0, total: orders.length, totalPages: 1 } }
  }, [orders])

  const columns = useMemo(() => {
    const result: ColumnData<OrderData, ExternalSource>[] = [
      {
        title: 'Timestamp',
        dataIndex: 'blockTime',
        key: 'blockTime',
        style: { minWidth: '150px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral1">
              <LocalTimeText date={item.blockTime} />
            </Type.Caption>

            <ExplorerLogo
              protocol={protocol}
              explorerUrl={`${PROTOCOL_PROVIDER[protocol].explorerUrl}/tx/${item.txHash}`}
              size={18}
            />
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
        title: 'Collateral Delta',
        dataIndex: 'collateralDelta',
        key: 'collateralDelta',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <DeltaText
            color="neutral1"
            type={item.type}
            delta={item.type === OrderTypeEnum.LIQUIDATE ? item.collateral : item.collateralDelta}
          />
        ),
      },
      {
        title: 'Size Delta',
        dataIndex: 'sizeDelta',
        key: 'sizeDelta',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <DeltaText
            color="neutral1"
            type={item.type}
            delta={item.type === OrderTypeEnum.LIQUIDATE ? item.size : item.sizeDelta}
          />
        ),
      },
      {
        title: 'Market Price',
        dataIndex: 'price',
        key: 'price',
        style: { minWidth: '120px', textAlign: 'right', pr: 3 },
        render: (item) => (
          <Type.Caption color="neutral1" width="100%" textAlign="right">
            {formatNumber(item.type === OrderTypeEnum.LIQUIDATE ? item.averagePrice : item.price)}
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
        }}
        data={tableData?.data}
        columns={columns}
        isLoading={isLoading}
        externalSource={externalSource}
        tableBodyWrapperSx={{ overflow: 'auto' }}
        renderRowBackground={() => 'transparent'}
      />
    </Box>
  )
}
