import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { getTokenTradeList } from 'utils/config/trades'

import PositionsSection from '../PositionsSection'
import RouteWrapper from '../RouteWrapper'
import Filters, { useFilters } from '../TopOpenIntrest/Filters'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import useSearchParamsState from '../useSearchParamsState'

export default function OpenInterestByMarket() {
  return (
    <RouteWrapper>
      <OpenInterestByMarketPage />
    </RouteWrapper>
  )
}

function OpenInterestByMarketPage() {
  const { lg } = useResponsive()
  const { symbol, protocol } = useParams<{ symbol: string | undefined; protocol: ProtocolEnum }>()

  const tokenOptions = getTokenTradeList(protocol)

  const tokenInfo = tokenOptions.find((token) => token.symbol === symbol)

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()
  const { searchParams } = useSearchParams()

  const { setMarketPageParams } = useSearchParamsState()
  useEffect(() => {
    setMarketPageParams(searchParams as any)
  }, [searchParams])

  const { data, isLoading, isFetching } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, protocol, limit, from, to, sort.key, symbol],
    () =>
      getTopOpeningPositionsApi({
        protocol,
        limit,
        offset: 0,
        sortBy: sort.key,
        sortType: SortTypeEnum.DESC,
        from,
        to,
        indexToken: tokenInfo?.address ?? '',
      }).then((data) => data.data),
    {
      retry: 0,
      enabled: !!tokenInfo?.address,
    }
  )

  const history = useHistory<{ prevProtocol: ProtocolEnum | undefined }>()
  const prevProtocol = history.location.state?.prevProtocol

  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Flex
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
                      <VisualizeSection protocol={protocol} data={data} isLoading={isFetching} />
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
                      isLoading={isFetching}
                    />
                  </Box>
                </Flex>
              </Box>
            )}
          </>
        ) : (
          <NoMarketFound
            message={
              <Trans>
                {symbol} market does not exist on {PROTOCOL_OPTIONS_MAPPING[protocol].text}
              </Trans>
            }
            actionButton={
              <Button
                variant="primary"
                onClick={() => (prevProtocol ? history.goBack() : history.push('/'))}
                width={150}
              >
                {prevProtocol ? <Trans>Back to {prevProtocol}</Trans> : <Trans>Back to home</Trans>}
              </Button>
            }
          />
        )}
      </Flex>
    </>
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
