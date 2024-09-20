import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/topOpeningPositions'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData, normalizePositionResponse, normalizeTraderData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
import { ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

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
      <TopOpeningsPage selectedProtocols={protocolFilter.selectedProtocols} />
    </RouteWrapper>
  )
}

function TopOpeningsPage({ selectedProtocols }: { selectedProtocols: ProtocolEnum[] }) {
  const { lg } = useResponsive()

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.positions'
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
    ]

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index, protocols: selectedProtocols, body }
  }, [sort, limit, from, to, selectedProtocols])

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
        height="48px"
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
        />
        <PythWatermark />
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
          <Box flex={[1, 1, 1, '0 0 690px']}>
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
