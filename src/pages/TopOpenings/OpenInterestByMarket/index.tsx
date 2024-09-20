import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/topOpeningPositions'
import { ReactNode, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
// import { getTopOpeningPositionsApi } from 'apis/positionApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import { ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
// import { QUERY_KEYS } from 'utils/config/keys'
import { getTokenTradeList } from 'utils/config/trades'

import PositionsSection from '../PositionsSection'
import RouteWrapper from '../RouteWrapper'
import Filters, { useFilters } from '../TopOpenIntrest/Filters'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import useSearchParamsState from '../useSearchParamsState'

export default function OpenInterestByMarket({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  return (
    <RouteWrapper protocolFilter={protocolFilter}>
      <OpenInterestByMarketPage selectedProtocols={protocolFilter.selectedProtocols} />
    </RouteWrapper>
  )
}

function OpenInterestByMarketPage({ selectedProtocols }: { selectedProtocols: ProtocolEnum[] }) {
  const { lg } = useResponsive()
  const { symbol, protocol } = useParams<{ symbol: string | undefined; protocol: ProtocolEnum }>()

  const tokenOptions = getTokenTradeList(protocol)

  const tokenInfo = tokenOptions?.filter((token) => token.symbol === symbol)?.map((e) => e.address)

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()
  const { searchParams } = useSearchParams()

  const { setMarketPageParams } = useSearchParamsState()
  useEffect(() => {
    setMarketPageParams(searchParams as any)
  }, [searchParams])

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.positions'
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
      { field: 'indexTokens', in: tokenInfo },
    ]

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index, protocols: selectedProtocols, body }
  }, [sort, limit, from, to, tokenInfo])

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

  const history = useHistory<{ prevProtocol: ProtocolEnum | undefined }>()
  const prevProtocol = history.location.state?.prevProtocol
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

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

      {tokenInfo ? (
        <>
          {isLoading && (
            <Box sx={wrapperSx}>
              <Loading />
            </Box>
          )}
          {!isLoading && !data?.length && (
            <Box sx={wrapperSx}>
              <NoMarketFound message={symbol && <Trans>{symbol} market data was not found</Trans>} />
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
          )}
        </>
      ) : (
        <NoMarketFound
          message={
            <Trans>
              {symbol} market does not exist on {protocolOptionsMapping[protocol]?.text}
            </Trans>
          }
          actionButton={
            <Button variant="primary" onClick={() => (prevProtocol ? history.goBack() : history.push('/'))} width={150}>
              {prevProtocol ? <Trans>Back to {prevProtocol}</Trans> : <Trans>Back to home</Trans>}
            </Button>
          }
        />
      )}
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
