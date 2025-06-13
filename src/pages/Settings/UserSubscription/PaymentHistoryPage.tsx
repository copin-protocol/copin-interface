import { Trans } from '@lingui/macro'
import React from 'react'
import { useQuery } from 'react-query'

import { getSubscriptionPaymentHistoryApi } from 'apis/subscription'
import SubscriptionIcon from 'components/@subscription/SubscriptionIcon'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PaymentDetailsData } from 'entities/subscription'
import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import Breadcrumb from 'theme/Breadcrumbs'
import { PaginationWithLimit } from 'theme/Pagination'
import Status from 'theme/Status'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'

const getColor = (status: string) => {
  if (status === 'SUCCESS') return 'green1'
  if (status === 'PENDING') return 'orange1'
  if (status === 'EXPIRED') return 'red1'
  return 'neutral1'
}

const columns: ColumnData<PaymentDetailsData, unknown>[] = [
  {
    title: <Trans>Purchase Time</Trans>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: {
      width: '180px',
    },
    render: (data: PaymentDetailsData) => (
      <Type.Caption>
        <LocalTimeText date={data.createdAt} format={DAYJS_FULL_DATE_FORMAT} />
      </Type.Caption>
    ),
  },
  {
    title: <Trans>Plan</Trans>,
    dataIndex: 'plan',
    key: 'plan',
    style: {},
    render: (data: PaymentDetailsData) => (
      <Flex alignItems="center" sx={{ gap: 1 }}>
        <SubscriptionIcon plan={data.plan} />
        <Type.Caption>{data.plan}</Type.Caption>
      </Flex>
    ),
  },

  {
    title: <Trans>Duration</Trans>,
    dataIndex: 'planDurationInDays',
    key: 'planDurationInDays',
    style: {
      textAlign: 'right',
      width: '100px',
    },
    render: (data: PaymentDetailsData) => {
      const duration = (data.planDurationInDays / 30) * data.period
      return (
        <Type.Caption>
          {duration} {duration > 1 ? 'months' : 'month'}
        </Type.Caption>
      )
    },
  },

  {
    title: <Trans>Price</Trans>,
    dataIndex: 'totalPaid',
    key: 'totalPaid',
    style: {
      textAlign: 'right',
      width: '100px',
    },
    render: (data: PaymentDetailsData) => <Type.Caption>${formatNumber(data.totalPaid, 2)}</Type.Caption>,
  },
  {
    title: <Trans>Payment</Trans>,
    dataIndex: 'totalPaidInCurrency',
    key: 'totalPaidInCurrency',
    style: {
      textAlign: 'right',
      width: '150px',
    },
    render: (data: PaymentDetailsData) => (
      <Type.Caption>
        {formatNumber(data.totalPaidInCurrency, 8)} {data.currency}
      </Type.Caption>
    ),
  },
  {
    title: <Trans>Status</Trans>,
    dataIndex: 'status',
    key: 'status',
    style: {
      textAlign: 'center',
      width: '120px',
    },
    render: (data: PaymentDetailsData) => <Status status={data.status} getColorFn={getColor} />,
  },
]

const PaymentHistoryPage = () => {
  const { profile } = useAuthContext()
  // TODO common page and limit
  const { searchParams, setSearchParams } = useSearchParams()

  const currentPage = Number((searchParams['page'] as string) ?? 1)
  const currentLimit = Number((searchParams['limit'] as string) ?? DEFAULT_LIMIT)
  const changeCurrentPage = (page: number) => setSearchParams({ ['page']: page.toString() })
  const changeCurrentLimit = (limit: number) => setSearchParams({ ['limit']: limit.toString(), ['page']: undefined })
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_SUBSCRIPTION_PAYMENT_HISTORY, profile?.id, currentPage, currentLimit],
    () => getSubscriptionPaymentHistoryApi({ page: currentPage, limit: currentLimit }),
    {
      enabled: !!profile?.id,
    }
  )
  return (
    <Box>
      <Breadcrumb
        hasLine
        items={[
          { title: <Trans>MY SUBSCRIPTION</Trans>, path: ROUTES.USER_SUBSCRIPTION.path },
          { title: <Trans>PAYMENT HISTORY</Trans> },
        ]}
      />

      <Box
        my={3}
        mx="auto"
        maxWidth="802px"
        sx={{
          bg: 'neutral7',
          borderRadius: 'xs',
          border: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Box
          sx={{
            overflow: 'auto',
            width: '100%',
          }}
        >
          <Table
            data={data?.data || []}
            columns={columns}
            isLoading={isLoading}
            tableBodySx={{
              color: 'neutral1',
            }}
            wrapperSx={{
              minWidth: '800px',
              minHeight: 'calc(100svh - 220px)',
            }}
            restrictHeight
          />
        </Box>

        {!!data && (
          <Box py={1} sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
            <PaginationWithLimit
              currentPage={currentPage}
              currentLimit={currentLimit}
              onPageChange={changeCurrentPage}
              onLimitChange={changeCurrentLimit}
              apiMeta={data.meta}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PaymentHistoryPage
