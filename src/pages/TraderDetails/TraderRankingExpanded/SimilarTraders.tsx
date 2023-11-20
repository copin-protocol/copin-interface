// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getTradersApi } from 'apis/traderApis'
import defaultImage from 'assets/images/similar-trader.png'
import NoDataFound from 'components/@ui/NoDataFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { FilterValues, RankingFieldOption } from 'components/ConditionFilterForm/types'
import { RestrictPremiumFeature } from 'components/SubscriptionRestrictModal'
import { TraderData } from 'entities/trader'
import useSubscriptionRestrict from 'hooks/features/useSubscriptionRestrict'
import { renderTrader } from 'pages/MyProfile/renderProps'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import ScoreChart, { ScoreChartData } from '../ScoreChart'

const RANKING_TOLERANCE = 10
export default function SimilarTraders({
  traderData,
  selectedTrader,
  rankingFieldOptions,
  timeOption,
  formatChartData,
  onClickCompareButton,
}: {
  traderData: TraderData
  selectedTrader: TraderData | null
  rankingFieldOptions: RankingFieldOption<TraderData>[]
  timeOption: TimeFilterProps
  formatChartData: (rankingData: TraderData['ranking']) => ScoreChartData[]
  onClickCompareButton: (data: TraderData) => void
}) {
  const { isPremiumUser } = useSubscriptionRestrict()
  const similarTradersFilter: FilterValues[] = rankingFieldOptions.reduce((result, option) => {
    const rankingValue = traderData.ranking[option.value]
    const minRanking = rankingValue - RANKING_TOLERANCE
    const maxRanking = rankingValue + RANKING_TOLERANCE
    if (!rankingValue) return result
    const filters = {
      fieldName: `ranking.${option.value}`,
      gte: minRanking < 0 ? 0 : minRanking,
      lte: maxRanking > 100 ? 100 : maxRanking,
    }
    return [...result, filters]
  }, [] as FilterValues[])
  const { data: similarTradersGMX, isFetching: isFetchingOnGMX } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, timeOption.id, similarTradersFilter, ProtocolEnum.GMX],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.GMX,
        body: {
          queries: [{ fieldName: 'type', value: timeOption.id }],
          ranges: similarTradersFilter,
          sortBy: 'profit',
          pagination: { limit: 10, offset: 0 },
          returnRanking: true,
        },
      }),
    {
      keepPreviousData: true,
      retry: 0,
      enabled: !!timeOption,
      select: (result) => ({ ...result, data: result.data.filter((_data) => _data.account !== traderData.account) }),
    }
  )
  const { data: similarTradersKwenta, isFetching: isFetchingOnKwenta } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, timeOption.id, similarTradersFilter, ProtocolEnum.KWENTA],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.KWENTA,
        body: {
          queries: [{ fieldName: 'type', value: timeOption.id }],
          ranges: similarTradersFilter,
          sortBy: 'profit',
          pagination: { limit: 10, offset: 0 },
          returnRanking: true,
        },
      }),
    {
      keepPreviousData: true,
      retry: 0,
      enabled: !!timeOption,
      select: (result) => ({ ...result, data: result.data.filter((_data) => _data.account !== traderData.account) }),
    }
  )

  if (!isPremiumUser) {
    return (
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage: `url(${defaultImage})`,
            backgroundSize: '100% auto',
          }}
        />
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            bg: 'modalBG',
            backdropFilter: 'blur(5px)',
            pt: [4, 4, 4, 5],
            pb: 4,
          }}
        >
          <RestrictPremiumFeature />
        </Flex>
      </Box>
    )
  }

  const similarTraders =
    similarTradersGMX && similarTradersKwenta ? [...similarTradersGMX.data, ...similarTradersKwenta.data] : []
  const isFetching = isFetchingOnGMX || isFetchingOnKwenta
  return (
    <Box sx={{ width: '100%', minHeight: '100%', bg: 'neutral6' }}>
      {isFetching && (
        <Box pt={4}>
          <Loading />
        </Box>
      )}
      {!isFetching && !similarTraders.length && <NoDataFound />}
      {!isFetching && (
        <Box
          sx={{
            display: ['grid', 'grid', 'grid', 'block'],
            gridTemplateColumns: ['1fr 1fr', '1fr 1fr', '1fr 1fr', '1fr'],
            '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', p: 3 },
            '& > *:last-child': { borderBottom: 'none' },
            '& > *:nth-child(2n+1)': {
              borderRight: ['small', 'small', 'small', 'none'],
              borderRightColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
            },
          }}
        >
          {similarTraders.map((traderData) => {
            return (
              <Box
                key={traderData.id}
                bg={
                  selectedTrader?.account === traderData.account && selectedTrader?.protocol === traderData.protocol
                    ? 'neutral5'
                    : 'transparent'
                }
              >
                <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                  {renderTrader(traderData.account, traderData.protocol)}
                  <Button
                    variant="ghostPrimary"
                    onClick={() => onClickCompareButton(traderData)}
                    sx={{ fontWeight: 'normal' }}
                  >
                    <Trans>Compare</Trans>
                  </Button>
                </Flex>
                <Flex mt={24} sx={{ gap: 24, alignItems: 'center' }}>
                  <ScoreChart
                    data={formatChartData(traderData.ranking)}
                    outerRadius={60}
                    wrapperWidth={120}
                    width={120}
                    height={120}
                    hiddenAxisTitle
                  />
                  <TraderDetailsWrapper>
                    {rankingFieldOptions.map((option, index) => {
                      const value = traderData[option.value]
                      return (
                        <SimilarTraderStats
                          key={index}
                          label={option.shortStatLabel ?? option.statLabel}
                          value={option.statFormat?.(value) ?? '--'}
                        />
                      )
                    })}
                  </TraderDetailsWrapper>
                </Flex>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

function SimilarTraderStats({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <StatWrapper>
      <Type.Caption color="neutral3" sx={{ width: 85, flexShrink: 0 }}>
        {label}:
      </Type.Caption>
      <Type.Caption>{value}</Type.Caption>
    </StatWrapper>
  )
}

const StatWrapper = styled(Flex)`
  flex-direction: column;
  @media all and (min-width: 1500px) {
    flex-direction: row;
    gap: 8px;
  }
`

const TraderDetailsWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 12px;
`
