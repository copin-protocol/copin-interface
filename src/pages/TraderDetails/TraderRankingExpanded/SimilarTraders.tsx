import { Trans } from '@lingui/macro'
import { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getTradersApi } from 'apis/traderApis'
import defaultImage from 'assets/images/similar-trader.png'
import NoDataFound from 'components/@ui/NoDataFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TraderAddress from 'components/@ui/TraderAddress'
import { FilterValues, RankingFieldOption } from 'components/@widgets/ConditionFilterForm/types'
import { RestrictPremiumFeature } from 'components/@widgets/SubscriptionRestrictModal'
import { TraderData } from 'entities/trader'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { encodeRealised } from 'utils/helpers/handleRealised'

import ScoreChart, { ScoreChartData } from '../ScoreChart'
import { filterFoundData } from './helpers'

const MINIMUM_TOLERANCE = 10
const TOLERANCE_STEP = 5
const MINIMUM_RESULT = 5
const MAXIMUM_RETRY_TIME = 3
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
  const isPremiumUser = useIsPremium()
  const [retryTime, setRetryTime] = useState(0)
  const fieldNames = useMemo(() => rankingFieldOptions.map((option) => option.value), [rankingFieldOptions])
  const alterFieldNames = useMemo(() => {
    let minRanking = traderData[fieldNames[0]] ?? 0
    let name = fieldNames[0]
    fieldNames.forEach((value) => {
      const ranking = traderData[value] ?? 0
      if (ranking < minRanking) {
        name = value
        minRanking = ranking
      }
    })
    return fieldNames.filter((value) => value !== name)
  }, [fieldNames, traderData])
  const _fieldNames = retryTime === 1 ? alterFieldNames : fieldNames
  const tolerance = retryTime > 1 ? MINIMUM_TOLERANCE + (retryTime - 1) * TOLERANCE_STEP : MINIMUM_TOLERANCE
  const similarTradersFilter: FilterValues[] = _fieldNames.reduce(
    (result, option) => {
      const rankingValue = traderData.ranking[option]
      const minRanking = rankingValue - tolerance
      const maxRanking = rankingValue + tolerance
      if (!rankingValue) return result
      const filters = {
        fieldName: `ranking.${encodeRealised(option, [
          'avgRoi',
          'maxDrawdown',
          'maxRoi',
          'profitLossRatio',
          'profitRate',
        ])}`,
        gte: minRanking < 0 ? 0 : minRanking,
        lte: maxRanking > 100 ? 100 : maxRanking,
      }
      return [...result, filters]
    },
    [{ fieldName: 'lastTradeAtTs', lte: 14 }] as FilterValues[]
  )

  const queryBody = {
    queries: [{ fieldName: 'type', value: timeOption.id }],
    ranges: similarTradersFilter,
    sortBy: 'profit',
    pagination: { limit: 10, offset: 0 },
    returnRanking: true,
  }
  const [isFetching, setIsFetching] = useState(true)
  // TODO: Need new api for this
  const { data: similarTraders } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, timeOption.id, similarTradersFilter, retryTime],
    () =>
      Promise.all(
        RELEASED_PROTOCOLS.map((protocol) => {
          return getTradersApi({
            protocol,
            body: queryBody,
          })
        })
      ),
    {
      keepPreviousData: true,
      retry: 0,
      enabled: !!timeOption && retryTime <= MAXIMUM_RETRY_TIME,
      select: (result) => {
        return result.reduce((result, data) => {
          return [...result, ...filterFoundData(data.data, [traderData])]
        }, [] as TraderData[])
      },
      onSettled: (data, error) => {
        if (retryTime <= MAXIMUM_RETRY_TIME) {
          const tradersCount = data?.length ?? 0
          if (tradersCount < MINIMUM_RESULT || error) {
            setRetryTime((prev) => prev + 1)
            return
          }
        }
        setIsFetching(false)
      },
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

  if (isFetching)
    return (
      <Box pt={4}>
        <Loading />
      </Box>
    )

  return (
    <Box sx={{ width: '100%', minHeight: '100%', bg: 'neutral7' }}>
      {!isFetching && !similarTraders?.length && <NoDataFound />}
      {!isFetching && (
        <Box
          sx={{
            display: ['grid', 'grid', 'grid', 'block'],
            gridTemplateColumns: ['1fr 1fr', '1fr 1fr', '1fr 1fr', '1fr'],
            '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', p: 2 },
            '& > *:last-child': { borderBottom: 'none' },
            '& > *:nth-child(2n+1)': {
              borderRight: ['small', 'small', 'small', 'none'],
              borderRightColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
            },
          }}
        >
          {similarTraders?.map((traderData) => {
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
                  <TraderAddress address={traderData.account} protocol={traderData.protocol} />
                  <Button
                    variant="ghostPrimary"
                    onClick={() => onClickCompareButton(traderData)}
                    sx={{ fontWeight: 'normal' }}
                  >
                    <Trans>Compare</Trans>
                  </Button>
                </Flex>
                <Flex mt={0} sx={{ gap: 2, alignItems: 'center' }}>
                  <ScoreChart
                    data={formatChartData(traderData.ranking)}
                    outerRadius={55}
                    wrapperWidth={120}
                    width={120}
                    height={120}
                    hiddenAxisTitle
                    tooltipPosition={{ x: 120, y: 0 }}
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
      <Type.Caption color="neutral3" sx={{ width: 90, flexShrink: 0 }}>
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
  flex: 1;
`
