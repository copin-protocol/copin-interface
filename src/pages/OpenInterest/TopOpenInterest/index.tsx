import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/topOpeningPositions'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import useInternalRole from 'hooks/features/useInternalRole'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import Maintain from 'pages/DailyTrades/Maintain'
import { Box, Flex } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { transformGraphqlFilters } from 'utils/helpers/graphql'

import PositionsSection from '../PositionsSection'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import FilterPositionButton from './FilterPositionButton'
import FilterPositionRangesTags from './FilterPositionRangeTags'
import Filters, { useFilters } from './Filters'
import useGetFilterRange from './useGetFilterRange'

export default function TopOpenInterest() {
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { ranges } = useGetFilterRange()
  const { lg, sm } = useResponsive()
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

  const { hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.positions'
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query: any = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
    ]
    if (hasExcludingPairs) {
      query.push({
        field: 'pair',
        nin: excludedPairs.map((pair) => `${pair}-USDT`),
      })
    } else {
      query.push({
        field: 'pair',
        in: pairs.map((pair) => `${pair}-USDT`),
      })
    }
    const rangeFilters = transformGraphqlFilters(ranges.map((v) => ({ gte: v.gte, lte: v.lte, fieldName: v.field })))
    rangeFilters.forEach((values) => query.push(values))

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index, body, protocols: selectedProtocols ?? [] }
  }, [sort.key, from, to, pairs, limit, selectedProtocols, excludedPairs, ranges])

  const isInternal = useInternalRole()
  const {
    data: topOpeningPositionsData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_TOP_OPENING_POSITIONS_QUERY, {
    skip: selectedProtocols == null || !isInternal,
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const rawPositionData =
    topOpeningPositionsData?.searchTopOpeningPosition.data || previousData?.searchTopOpeningPosition.data

  const data = useMemo(() => {
    return rawPositionData?.map((position) => normalizePositionData(position))
  }, [rawPositionData])

  // const { listMaintenancePage } = useGetPageStatus()
  // if (listMaintenancePage?.includes(SystemStatusPageEnum.OPEN_INTEREST) && !isInternal) {
  //   return <Maintain />
  // }
  if (!isInternal) return <Maintain />

  if (selectedProtocols == null) return null

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
          pairs={pairs ?? []}
          onChangePairs={onChangePairs}
          excludedPairs={excludedPairs}
        />
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          {sm && <FilterPositionRangesTags />}
          {!sm && <FilterPositionButton />}
          {sm && <PythWatermark />}
        </Flex>
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
            {data && <PositionsSection data={data} total={Math.min(limit, data?.length ?? 0)} isLoading={isLoading} />}
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
