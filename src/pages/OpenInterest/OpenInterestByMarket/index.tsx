import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/topOpeningPositions'
import { ReactNode, useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'
import { getPairFromSymbol } from 'utils/helpers/transform'

import PositionsSection from '../PositionsSection'
import RouteWrapper from '../RouteWrapper'
import Filters, { useFilters } from '../TopOpenInterest/Filters'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'

export default function OpenInterestByMarket() {
  return (
    <RouteWrapper>
      <OpenInterestByMarketPage />
    </RouteWrapper>
  )
}

function OpenInterestByMarketPage() {
  const { lg, sm } = useResponsive()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)

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

  const queryVariables = useMemo(() => {
    const index = 'copin.positions'
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
      {
        field: 'pair',
        in: pairs.filter((pair) => !excludedPairs.includes(pair)).map((pair) => getPairFromSymbol(pair)),
      },
      { field: 'protocol', in: selectedProtocols ?? [] },
    ]

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index, body, protocols: selectedProtocols }
  }, [sort.key, from, to, pairs, selectedProtocols, limit, excludedPairs])

  const {
    data: topOpeningPositionsData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_TOP_OPENING_POSITIONS_QUERY, {
    skip: selectedProtocols == null,
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const rawPositionData =
    topOpeningPositionsData?.searchTopOpeningPosition.data || previousData?.searchTopOpeningPosition.data

  const data = rawPositionData?.map((position) => normalizePositionData(position))

  if (selectedProtocols == null) return null

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
          pairs={pairs}
          onChangePairs={onChangePairs}
          excludedPairs={excludedPairs}
        />
        {sm && <PythWatermark />}
      </Flex>
      <>
        {isLoading && (
          <Box sx={wrapperSx}>
            <Loading />
          </Box>
        )}
        {!isLoading && !data?.length && (
          <Box sx={wrapperSx}>
            <NoMarketFound message={<Trans>Mrket data was not found</Trans>} />
          </Box>
        )}
        {!isLoading && !!data?.length && (
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
                  <PositionsSection data={data} total={Math.min(limit, data?.length ?? 0)} isLoading={isLoading} />
                )}
              </Box>
            </Flex>
          </Box>
        )}
      </>
    </Flex>
  )
}

export function NoMarketFound({ message, actionButton }: { message: ReactNode; actionButton?: any }) {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        ...wrapperSx,
      }}
    >
      <Image mt={64} mb={2} src={tokenNotFound} width={190} height={190} alt="token" />
      <Type.Caption color="neutral3" mb={24}>
        {message}
      </Type.Caption>
      {actionButton}
    </Flex>
  )
}

const wrapperSx = {
  flex: 1,
  width: '100%',
  height: '100%',
  borderTop: 'small',
  borderTopColor: 'neutral4',
}
