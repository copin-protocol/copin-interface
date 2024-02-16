import { useResponsive } from 'ahooks'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import PythWatermark from 'components/@ui/PythWatermark'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import PositionsSection from '../PositionsSection'
import RouteWrapper from '../RouteWrapper'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import useSearchParamsState from '../useSearchParamsState'
import Filters, { useFilters } from './Filters'

export default function TopOpenings() {
  const { searchParams } = useSearchParams()
  const { setOverallPageParams } = useSearchParamsState()
  useEffect(() => {
    setOverallPageParams(searchParams as any)
  }, [searchParams])
  return (
    <RouteWrapper>
      <TopOpeningsPage />
    </RouteWrapper>
  )
}

function TopOpeningsPage() {
  const { protocol } = useParams<{ protocol: ProtocolEnum }>()

  const { sm, lg } = useResponsive()

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()

  const {
    data,
    isFetching: isLoading,
    // isRefetching,
  } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, protocol, limit, time.id, sort.key],
    () =>
      getTopOpeningPositionsApi({
        protocol,
        limit,
        offset: 0,
        sortBy: sort.key,
        sortType: SortTypeEnum.DESC,
        from,
        to,
      }).then((data) => data.data),
    {
      retry: 0,
      // keepPreviousData: true,
      // refetchInterval: 5000,
    }
  )
  return (
    <>
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
                <VisualizeSection protocol={protocol} data={data} isLoading={isLoading} />
              </Box>
            ) : (
              <Box p={3}>
                <VisualizeSectionMobile data={data} />
              </Box>
            )}
            <Box flex={[1, 1, 1, '0 0 680px']}>
              <PositionsSection
                data={data}
                sort={sort.key}
                total={Math.min(limit, data?.length ?? 0)}
                isLoading={isLoading}
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
