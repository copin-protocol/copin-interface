import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import DailyPositionListView from 'components/@dailyTrades/PositionListView'
import { PositionRangeFields } from 'components/@dailyTrades/configs'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import { dailyPositionColumns } from 'components/@position/configs/traderPositionRenderProps'
import ToastBody from 'components/@ui/ToastBody'
import { PositionData, ResponsePositionData } from 'entities/trader'
import { PaginationWithLimit } from 'theme/Pagination'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'
import { pageToOffset } from 'utils/helpers/transform'

import FilterProtocols from '../FilterProtocols'
import FilterPairTags from '../FilterTags/FilterPairTag'
import FilterPositionRangesTag from '../FilterTags/FilterPositionRangesTag'
import FilterPositionStatusTag from '../FilterTags/FilterPositionStatusTag'
import SearchTrader from '../SearchTrader'
import FilterPositionButton from './FilterPositionButton'
import SortPositionsDropdown from './SortPositionDropdown'
import { SEARCH_DAILY_POSITIONS_QUERY, SEARCH_POSITIONS_FUNCTION_NAME, SEARCH_POSITIONS_INDEX } from './config'
import { DailyPositionsProvider, useDailyPositionsContext } from './usePositionsProvider'

export default function DailyPositions() {
  return (
    <DailyPositionsProvider>
      <DailyPositionsComponent />
    </DailyPositionsProvider>
  )
}
function DailyPositionsComponent() {
  const {
    status,
    ranges,
    currentSortBy,
    currentSortType,
    pairs,
    address,
    currentPage,
    currentLimit,
    protocols,
    changeAddress,
    changeCurrentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changePairs,
  } = useDailyPositionsContext()

  const [currentTime] = useState(dayjs().utc())

  // FETCH DATA
  const queryOpeningVariables = useMemo(() => {
    const lastTime = currentTime.subtract(1, 'day')
    const sorts: { field: keyof PositionData; direction: SortTypeEnum }[] = [
      { field: currentSortBy, direction: currentSortType },
    ]
    const filter: { field: keyof PositionData; match?: any; in?: any; lte?: any; gte?: any }[] = [
      {
        //@ts-ignore
        or: [
          {
            field: 'openBlockTime',
            lte: currentTime.toISOString(),
            gte: lastTime.toISOString(),
          },
          {
            field: 'closeBlockTime',
            lte: currentTime.toISOString(),
            gte: lastTime.toISOString(),
          },
        ],
      },
    ]
    if (pairs?.length) {
      filter.push({ field: 'pair', in: pairs })
    }
    if (status) {
      filter.push({
        field: 'status',
        in: [status],
      })
    }
    if (address) {
      filter.push({
        field: 'account',
        match: address,
      })
    }
    if (ranges.length) {
      ranges.forEach((values) => {
        //@ts-ignore
        if (values.field === 'durationInSecond') {
          const newValues = { ...values }
          if (typeof newValues.gte === 'number') {
            newValues.gte = newValues.gte * 60
          }
          if (typeof newValues.lte === 'number') {
            newValues.lte = newValues.lte * 60
          }
          //@ts-ignore
          filter.push(newValues)
        } else {
          //@ts-ignore
          filter.push(values)
        }
      })
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

    return { index: SEARCH_POSITIONS_INDEX, body, protocols }
  }, [
    address,
    currentLimit,
    currentPage,
    currentSortBy,
    currentSortType,
    currentTime,
    pairs,
    protocols,
    ranges,
    status,
  ])

  const {
    data: positionsData,
    loading: isLoadingPositions,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_DAILY_POSITIONS_QUERY, {
    variables: queryOpeningVariables,
    defaultOptions: { context: {} },
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const data = isLoadingPositions
    ? previousData?.[SEARCH_POSITIONS_FUNCTION_NAME]
    : positionsData?.[SEARCH_POSITIONS_FUNCTION_NAME]

  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
  }

  const handleDismiss = () => {
    setOpenDrawer(false)
  }
  const { md } = useResponsive()

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
            <FilterPairTags pairs={pairs} onClear={() => changePairs(undefined)} />
            <FilterPositionStatusTag />
            <FilterPositionRangesTag />
          </Flex>
          <Flex sx={{ height: '100%', alignItems: 'center' }}>
            <Box height="100%" sx={{ bg: 'neutral4', flexShrink: 0, width: '1px' }} />
            <SearchTrader address={address} setAddress={changeAddress} />
          </Flex>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40 }}>
          <Flex mr={2} sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
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
                }}
              >
                <FilterPositionButton />
                <SortPositionsDropdown />
              </Flex>
            </Flex>
          </Flex>
          <FilterProtocols />
        </Flex>
      )}

      <Box flex="1 0 0" overflow="hidden" sx={{ '.row_wrapper, .row_header_wrapper': { pl: '16px !important' } }}>
        {md ? (
          <VirtualList
            columns={dailyPositionColumns}
            data={data?.data}
            isLoading={isLoadingPositions}
            hiddenFooter
            handleSelectItem={handleSelectItem}
            currentSort={{ sortBy: currentSortBy, sortType: currentSortType }}
            changeCurrentSort={changeCurrentSort}
          />
        ) : (
          <DailyPositionListView
            data={data?.data}
            isLoading={isLoadingPositions}
            scrollDep={data}
            onClickItem={handleSelectItem}
          />
        )}
      </Box>

      <Flex
        height={40}
        sx={{
          pl: 2,
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
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
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="opening-position-detail"
      />
    </Flex>
  )
}
