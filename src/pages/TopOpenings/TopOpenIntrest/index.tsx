import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/topOpeningPositions'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
import { ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { useProtocolFromUrl } from 'utils/helpers/graphql'

import PositionsSection from '../PositionsSection'
import RouteWrapper from '../RouteWrapper'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import useSearchParamsState from '../useSearchParamsState'
import Filters, { useFilters } from './Filters'

export default function TopOpenings({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  const { searchParams } = useSearchParams()
  const { setOverallPageParams } = useSearchParamsState()

  useEffect(() => {
    setOverallPageParams(searchParams as any)
  }, [searchParams])

  return (
    <RouteWrapper protocolFilter={protocolFilter}>
      <TopOpeningsPage />
    </RouteWrapper>
  )
}

function TopOpeningsPage() {
  const { lg, sm } = useResponsive()
  const { searchParams, pathname } = useSearchParams()
  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)
  const {
    sort,
    onChangeSort,
    limit,
    onChangeLimit,
    time,
    from,
    to,
    onChangeTime,
    pairs,
    onChangePairs,
    excludedPairs,
  } = useFilters()

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.positions'
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
      { field: 'pair', in: pairs.filter((pair) => !excludedPairs.includes(pair)).map((pair) => `${pair}-USDT`) },
    ]

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index, body, protocols: foundProtocolInUrl }
  }, [sort.key, from, to, pairs, limit, foundProtocolInUrl, excludedPairs])

  const {
    data: topOpeningPositionsData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_TOP_OPENING_POSITIONS_QUERY, {
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const rawPositionData =
    topOpeningPositionsData?.searchTopOpeningPosition.data || previousData?.searchTopOpeningPosition.data

  const data = rawPositionData?.map((position) => normalizePositionData(position))

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        p={3}
        height={TAB_HEIGHT}
        sx={{
          borderBottom: ['small', 'small', 'small', 'none'],
          borderBottomColor: ['neutral4', 'neutral4', 'neutral4', 'none'],
        }}
      >
        <Filters
          currentSort={sort}
          currentLimit={limit}
          onChangeSort={onChangeSort}
          onChangeLimit={onChangeLimit}
          currentTimeOption={time}
          onChangeTime={onChangeTime}
          pairs={pairs}
          onChangePairs={onChangePairs}
          excludedPairs={excludedPairs}
        />
        {sm && <PythWatermark />}
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>
        <Flex height="100%" flexDirection={lg ? 'row' : 'column'}>
          {lg ? (
            <Box flex="1">
              <VisualizeSection data={data} isLoading={isLoading} />
            </Box>
          ) : (
            <Box p={3}>
              <VisualizeSectionMobile data={data} />
            </Box>
          )}
          <Box flex={[1, 1, 1, '0 0 720px']}>
            {data && (
              <PositionsSection
                data={data}
                sort={sort.key}
                total={Math.min(limit, data?.length ?? 0)}
                isLoading={isLoading}
              />
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
