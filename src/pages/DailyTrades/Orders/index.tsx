import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { ApiListResponse } from 'apis/api'
import DailyOrderListView from 'components/@dailyTrades/OrderListView'
import ToastBody from 'components/@ui/ToastBody'
import { OrderData } from 'entities/trader'
import { PaginationWithLimit } from 'theme/Pagination'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, Type } from 'theme/base'
import { MarginModeEnum, OrderTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { pageToOffset } from 'utils/helpers/transform'

import FilterProtocols from '../FilterProtocols'
import FilterOrderActionTag from '../FilterTags/FilterOrderActionTag'
import FilterOrderRangesTag from '../FilterTags/FilterOrderRangeTag'
import FilterPairTag from '../FilterTags/FilterPairTag'
import SearchTrader from '../SearchTrader'
import FilterOrderButton from './FilterOrderButton'
import { SEARCH_DAILY_ORDERS_QUERY, SEARCH_FUNCTION_NAME, SEARCH_ORDERS_INDEX, orderColumns } from './config'
import { DailyOrdersProvider, useDailyOrdersContext } from './useOrdersProvider'

export default function DailyOrders() {
  return (
    <DailyOrdersProvider>
      <DailyOrdersComponent />
    </DailyOrdersProvider>
  )
}
function DailyOrdersComponent() {
  const {
    ranges,
    pairs,
    changePairs,
    address,
    changeAddress,
    protocols,
    action,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
  } = useDailyOrdersContext()
  const [currentTime] = useState(dayjs().utc())

  // FETCH DATA
  const queryOpeningVariables = useMemo(() => {
    const lastTime = currentTime.subtract(1, 'day')
    const sorts: { field: keyof OrderData; direction: SortTypeEnum }[] = [
      { field: 'blockTime', direction: SortTypeEnum.DESC },
    ]
    const filter: { field: keyof OrderData; match?: any; in?: any; lte?: any; gte?: any }[] = [
      {
        field: 'blockTime',
        lte: currentTime.toISOString(),
        gte: lastTime.toISOString(),
      },
    ]
    if (pairs?.length) {
      filter.push({ field: 'pair', in: pairs })
    }
    if (action) {
      filter.push({
        field: 'type',
        in: [action],
      })
    } else {
      filter.push({
        field: 'type',
        in: [
          OrderTypeEnum.OPEN,
          OrderTypeEnum.INCREASE,
          OrderTypeEnum.DECREASE,
          OrderTypeEnum.CLOSE,
          OrderTypeEnum.LIQUIDATE,
        ],
      })
    }
    if (address) {
      filter.push({
        field: 'account',
        match: address,
      })
    }
    if (protocols) {
      filter.push({
        field: 'protocol',
        in: protocols,
      })
    }
    if (ranges.length) {
      //@ts-ignore
      ranges.forEach((values) => filter.push(values))
    }
    const parsedFilters = filter.map(({ field, ...rest }) => {
      const convertedRest = Object.fromEntries(
        Object.entries(rest)
          .filter(([_, value]) => value !== null && value !== undefined)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return [key, value]
            }
            return [key, String(value)]
          })
      )

      return {
        field,
        ...convertedRest,
      }
    })

    const body = {
      filter: { and: parsedFilters },
      sorts,
      paging: { size: currentLimit, from: pageToOffset(currentPage, currentLimit) },
    }

    return { index: SEARCH_ORDERS_INDEX, body }
  }, [currentTime, pairs, action, address, protocols, ranges, currentLimit, currentPage])

  const {
    data: ordersData,
    loading: isLoadingOrders,
    previousData,
  } = useApolloQuery<{ [SEARCH_FUNCTION_NAME]: ApiListResponse<OrderData> }>(SEARCH_DAILY_ORDERS_QUERY, {
    variables: queryOpeningVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })
  const data = isLoadingOrders ? previousData?.[SEARCH_FUNCTION_NAME] : ordersData?.[SEARCH_FUNCTION_NAME]
  const { md, lg } = useResponsive()
  return (
    <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      {md ? (
        <Flex
          sx={{
            height: 48,
            alignItems: 'center',
            gap: 3,
            px: 3,
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'nowrap', flex: '1 0 0', overflow: 'auto' }}>
            <Type.Caption pr={1}>Filter:</Type.Caption>
            <FilterPairTag pairs={pairs} onClear={() => changePairs(undefined)} />
            <FilterOrderActionTag />
            <FilterOrderRangesTag />
          </Flex>
          <Flex sx={{ height: '100%', alignItems: 'center' }}>
            <Box height="100%" sx={{ bg: 'neutral4', flexShrink: 0, width: '1px' }} />
            <SearchTrader address={address} setAddress={changeAddress} />
          </Flex>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40 }}>
          <Flex sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
            <Flex sx={{ alignItems: 'center', py: '2px' }}>
              <SearchTrader address={address} setAddress={changeAddress} />
            </Flex>
            <Flex sx={{ height: '100%', gap: 3, flexShrink: 0 }}>
              <Flex
                sx={{
                  alignItems: 'center',
                  borderLeft: 'small',
                  borderRight: 'small',
                  borderColor: 'neutral4',
                  px: 2,
                }}
              >
                <FilterOrderButton />
                {/* <SortPositionsDropdown /> */}
              </Flex>
            </Flex>
          </Flex>
          <FilterProtocols />
        </Flex>
      )}
      <Box flex="1 0 0" overflow="hidden" sx={{ '.row_wrapper, .row_header_wrapper': { pl: '16px !important' } }}>
        {md ? (
          <VirtualList
            data={data?.data?.map((v) => ({
              ...v,
              marginMode: PROTOCOLS_CROSS_MARGIN.includes(v.protocol) ? MarginModeEnum.CROSS : MarginModeEnum.ISOLATED, // Todo: need to improve
            }))}
            columns={orderColumns}
            isLoading={isLoadingOrders}
            dataMeta={data?.meta}
            hiddenFooter
          />
        ) : (
          <DailyOrderListView data={data?.data} isLoading={isLoadingOrders} scrollDep={data} />
        )}
      </Box>
      <Flex
        height={40}
        sx={{
          pl: 2,
          alignItems: 'center',
          width: '100%',
          borderTop: 'small',
          borderTopColor: 'neutral4',
          visibility: data?.meta?.total ? 'visible' : 'hidden',
          '& > *': { width: '100%' },
        }}
      >
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={data?.meta}
        />
      </Flex>
    </Flex>
  )
}
