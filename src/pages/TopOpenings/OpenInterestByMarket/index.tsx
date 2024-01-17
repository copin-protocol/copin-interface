import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import PageHeader from 'components/@ui/PageHeader'
import { ProtocolPageWrapper } from 'components/RouteWrapper'
import useSearchParams from 'hooks/router/useSearchParams'
import Breadcrumb from 'theme/Breadcrumbs'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Select from 'theme/Select'
import { Box, Flex, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getTokenTradeList } from 'utils/config/trades'
import { generateOIByMarketRoute, generateOIMarketsRoute, generateOIRoute } from 'utils/helpers/generateRoute'

import { MarketLink, TopOpenLink } from '../Navigators'
import PositionsSection from '../PositionsSection'
import Filters, { useFilters } from '../TopOpenIntrest/Filters'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'

export default function OpenInterestByMarket() {
  return (
    <ProtocolPageWrapper>
      <OpenInterestByMarketPage />
    </ProtocolPageWrapper>
  )
}

function OpenInterestByMarketPage() {
  const { sm, lg } = useResponsive()
  const { symbol, protocol } = useParams<{ symbol: string | undefined; protocol: ProtocolEnum }>()

  const tokenOptions = getTokenTradeList(protocol)

  const tokenInfo = tokenOptions.find((token) => token.symbol === symbol)

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()
  const { searchParams } = useSearchParams()

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

  const tokenSelectOptions = tokenOptions.map((option) => ({ value: option.symbol, label: option.symbol }))
  const selectOption = tokenSelectOptions.find((option) => option.value === symbol)
  const onChangeToken = (newValue: any) => {
    history.push(generateOIByMarketRoute({ protocol, symbol: newValue.value, params: searchParams }))
  }

  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <PageHeader
          pageTitle={`${symbol ?? ''} Open Interest on ${protocol}`}
          headerText={
            <Flex as="span" sx={{ width: '100%', alignItems: 'center', gap: 2 }}>
              <Box as="span" sx={{ flexShrink: 0 }}>
                <Trans>OPEN INTEREST</Trans>
              </Box>
              <Box
                sx={{
                  '.select__single-value': {
                    fontSize: '16px',
                    color: `${themeColors.primary1} !important`,
                  },
                  '.select__control': {
                    width: 100,
                    input: { width: '100% !important', margin: '0 !important' },
                  },
                }}
              >
                <Select variant="ghost" value={selectOption} options={tokenSelectOptions} onChange={onChangeToken} />
              </Box>
            </Flex>
          }
          icon={Pulse}
          showOnMobile
          routeSwitchProtocol
        />
        {sm ? (
          <Flex justifyContent="space-between" p={3} height="48px">
            <Flex>
              <Filters
                currentSort={sort}
                currentLimit={limit}
                onChangeSort={onChangeSort}
                onChangeLimit={onChangeLimit}
                currentTimeOption={time}
                onChangeTime={onChangeTime}
              />
            </Flex>
            <Flex sx={{ gap: 24 }}>
              <MarketLink text={<Trans>All Markets</Trans>} />
              <TopOpenLink />
            </Flex>
          </Flex>
        ) : (
          <Box px={3} py={12} sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            <Breadcrumb items={breadcrumbItems(symbol ?? '', protocol, searchParams)} />
            <Flex alignItems="end">
              <Filters
                currentSort={sort}
                currentLimit={limit}
                onChangeSort={onChangeSort}
                onChangeLimit={onChangeLimit}
                currentTimeOption={time}
                onChangeTime={onChangeTime}
              />
            </Flex>
          </Box>
        )}

        {tokenInfo ? (
          <>
            {isLoading && (
              <Box sx={wrapperSx}>
                <Loading />
              </Box>
            )}
            {!isLoading && !data?.length && (
              <Box sx={wrapperSx}>
                <NoMarketFound message={<Trans>{symbol} market data was not found</Trans>} />
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
                  <Box flex={[1, 1, 1, '0 0 650px']}>
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
                {symbol} market does not exist on {protocol}
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

function NoMarketFound({ message, actionButton }: { message: ReactNode; actionButton?: any }) {
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

const breadcrumbItems = (symbol: string, protocol: ProtocolEnum, params: Record<string, any>) => [
  { title: <Trans>Overall</Trans>, path: generateOIRoute({ protocol, params }) },
  { title: <Trans>Markets</Trans>, path: generateOIMarketsRoute({ protocol, params }) },
  { title: <Trans>{symbol}</Trans> },
]
