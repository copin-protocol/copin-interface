import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { SEARCH_DAILY_ORDERS_QUERY, SEARCH_ORDERS_FUNCTION_NAME } from 'graphql/query'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import { renderOrderLeverage, renderOrderPrice } from 'components/@position/TraderPositionDetails/ListOrderTable'
import { ORDER_TYPES } from 'components/@position/configs/order'
import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import ToastBody from 'components/@ui/ToastBody'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { OrderData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import OrderTime from 'pages/DailyTrades/Orders/OrderTime'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { OrderTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { compactNumber } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'

interface OrdersSectionProps {
  token: string
  sizeFilter: { gte: string | undefined; lte: string | undefined } | null
  selectedAccounts: string[] | null
  isLong: boolean
}

const orderColumns: ColumnData<OrderData>[] = [
  {
    title: <TimeColumnTitleWrapper>Timestamp</TimeColumnTitleWrapper>,
    dataIndex: 'blockTime',
    key: 'blockTime',
    style: { minWidth: 175, flex: 1.75 },
    render: (item) => <OrderTime data={item} />,
  },
  {
    title: <Trans>ACCOUNT</Trans>,
    dataIndex: 'account',
    key: 'account',
    style: { minWidth: 180, flex: 1.8 },
    render: (item) => (
      <AccountInfo
        address={item.account}
        protocol={item.protocol}
        wrapperSx={{ width: 'max-content' }}
        avatarSize={24}
        textSx={{ color: 'neutral1' }}
      />
    ),
  },

  {
    title: <Trans>ACTION</Trans>,
    dataIndex: 'type',
    key: 'type',
    style: { minWidth: 100, flex: 0.8 },
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
    title: <Trans>DIRECTION</Trans>,
    dataIndex: 'isLong',
    key: 'isLong',
    style: { minWidth: 80, flex: 0.8, textAlign: 'right' },
    render: (item) => (
      <Flex alignItems="center" sx={{ gap: 2, justifyContent: 'flex-end' }}>
        <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.isLong ? 'LONG' : 'SHORT'}</Type.Caption>
      </Flex>
    ),
  },

  {
    // filterComponent: <OrderRangeFilterIcon valueKey={ORDER_RANGE_KEYS.sizeDeltaNumber} />,
    title: <Trans>VALUE</Trans>,
    dataIndex: 'sizeDeltaNumber',
    key: 'sizeDeltaNumber',
    style: { textAlign: 'right', minWidth: 90, flex: 0.9, justifyContent: 'end', gap: 1 },
    render: (item) => <Type.Caption color="neutral1">${compactNumber(item.sizeDeltaNumber, 2)}</Type.Caption>,
  },
  {
    title: <Trans>LEVERAGE</Trans>,
    dataIndex: 'leverage',
    key: 'leverage',
    style: {
      textAlign: 'right',
      minWidth: 100,
      flex: 1,
      justifyContent: 'end',
      gap: 1,
      '@media (max-width: 1500px)': {
        display: 'none',
      },
    },
    render: renderOrderLeverage,
  },
  {
    title: <Trans>MARKET PRICE</Trans>,
    dataIndex: 'priceNumber',
    key: 'priceNumber',
    style: { textAlign: 'right', minWidth: 120, flex: 1.2, pr: 3 },
    render: renderOrderPrice,
  },
]

export default function OrdersSection({ token, sizeFilter, selectedAccounts, isLong }: OrdersSectionProps) {
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `${isLong ? 'long' : 'short'}OrdersPage`,
    limitName: `${isLong ? 'long' : 'short'}OrdersLimit`,
    defaultLimit: 20,
  })
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)

  const queryVariables = useMemo(() => {
    const filter = {
      and: [
        { field: 'pair', match: `${token}-USDT` },
        { field: 'protocol', in: selectedProtocols ?? [] },
        { field: 'isLong', match: isLong.toString() },
      ],
    }
    if (sizeFilter) {
      filter.and.push({ field: 'sizeDeltaNumber', gte: sizeFilter.gte, lte: sizeFilter.lte } as any)
    }
    if (selectedAccounts) {
      filter.and.push({ field: 'account', in: selectedAccounts } as any)
    }
    return {
      index: 'copin.orders',
      body: {
        filter,
        sorts: [{ field: 'blockTime', direction: SortTypeEnum.DESC }],
        paging: { size: currentLimit, from: pageToOffset(currentPage, currentLimit) },
      },
    }
  }, [token, selectedProtocols, currentPage, currentLimit, sizeFilter, selectedAccounts, isLong])

  const {
    data: ordersData,
    loading,
    previousData,
  } = useApolloQuery<{ [SEARCH_ORDERS_FUNCTION_NAME]: { data: OrderData[]; meta: any } }>(SEARCH_DAILY_ORDERS_QUERY, {
    skip: selectedProtocols == null,
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
    pollInterval: 10000,
  })

  const rawOrderData =
    ordersData?.[SEARCH_ORDERS_FUNCTION_NAME]?.data || previousData?.[SEARCH_ORDERS_FUNCTION_NAME]?.data

  const orders = useMemo(() => {
    return rawOrderData ?? []
  }, [rawOrderData])

  if (loading && !previousData) {
    return (
      <Box p={4}>
        <Loading />
      </Box>
    )
  }

  if (!orders || orders.length === 0) {
    return <NoDataFound message={<Trans>No orders found for {token}</Trans>} />
  }

  return (
    <Box height="100%">
      <Table
        columns={orderColumns}
        data={orders}
        isLoading={loading && !ordersData}
        restrictHeight
        footer={
          <Box color="neutral1">
            <PaginationWithLimit
              currentPage={currentPage}
              currentLimit={currentLimit}
              onPageChange={changeCurrentPage}
              onLimitChange={changeCurrentLimit}
              apiMeta={ordersData?.[SEARCH_ORDERS_FUNCTION_NAME]?.meta}
            />
          </Box>
        }
      />
    </Box>
  )
}
