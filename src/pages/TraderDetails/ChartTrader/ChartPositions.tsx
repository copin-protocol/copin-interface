import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, Coins } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderTokensStatistic } from 'apis/traderApis'
import ChartPositions from 'components/@charts/ChartPositions'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { PositionData } from 'entities/trader.d'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox } from 'theme/base'
import { DEFAULT_PROTOCOL, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TokenOptionProps } from 'utils/config/trades'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { ListTokenStatistic, TableTokenStatistic } from './TokenStatistic'
import { useQueryInfinitePositions } from './useQueryInfinitePositions'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}

const TraderChartPositions = memo(function TraderChartPositionsMemo({
  account,
  protocol,
  isExpanded,
  handleExpand,
}: {
  account: string
  protocol: ProtocolEnum
  isExpanded: boolean
  handleExpand: () => void
}) {
  const [currentPair, setCurrentPair] = useState<string | undefined>()
  const currencyOption = useMemo(() => {
    if (!currentPair) return undefined
    const symbol = getSymbolFromPair(currentPair)
    const result: TokenOptionProps = {
      id: symbol,
      label: symbol,
      value: symbol,
    }
    return result
  }, [currentPair])
  const { data: tokensStatistic, isLoading: loadingTokenStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, account],
    () => getTraderTokensStatistic({ protocol, account }),
    {
      enabled: !!account && !!protocol,
      retry: 0,
      keepPreviousData: true,
      // onSuccess(data) {
      //   if (!data.data.length) return
      //   const firstData = data.data[0]
      //   setCurrentPair(firstData?.pair)
      // },
    }
  )

  const { openingPositions, closedPositions, isLoadingClosed, handleFetchClosedPositions, hasNextClosedPositions } =
    useQueryInfinitePositions({
      address: account,
      protocol,
      currentPair,
      limit: MAX_PAGE_LIMIT,
    })

  const { xl } = useResponsive()

  useEffect(() => {
    const existOpening = !!openingPositions?.find((e) => e.id === currentPair)
    const existClosed = !!closedPositions?.find((e) => e.id === currentPair)
    const existToken = !!tokensStatistic?.data?.find((e) => e.pair === currentPair)
    if (currentPair && (existOpening || existClosed || existToken)) return
    if (!!openingPositions?.length) {
      setCurrentPair(openingPositions[0].pair)
      return
    }
    if (!!closedPositions?.length) {
      setCurrentPair(closedPositions[0].pair)
      return
    }
    if (!!tokensStatistic?.data?.length) {
      setCurrentPair(tokensStatistic?.data[0].pair)
      return
    }
  }, [closedPositions, currentPair, openingPositions, tokensStatistic?.data])

  return (
    <Flex sx={{ flexDirection: 'column', height: '100%', width: '100%' }}>
      <Flex
        height={44}
        px={3}
        sx={{
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isExpanded ? 'small' : 'smallDashed',
          borderBottomColor: 'neutral4',
        }}
      >
        <SectionTitle icon={Coins} title={<Trans>TOKEN PREFERENCES</Trans>} sx={{ mb: 0 }} />
        {xl && (
          <IconBox
            icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
            role="button"
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'sm',
              color: 'neutral2',
              '&:hover': { color: 'neutral1' },
            }}
            onClick={handleExpand}
          />
        )}
      </Flex>
      {loadingTokenStatistic ? (
        <Loading />
      ) : !tokensStatistic?.data?.length ? (
        <NoDataFound message="No token preference statistic" />
      ) : (
        <Flex
          sx={{
            flex: '1 0 0',
            flexDirection: isExpanded ? 'row' : 'column',
            width: '100%',
            bg: isExpanded ? 'neutral7' : 'transparent',
          }}
        >
          <ChartPositions
            sx={{
              flex: '1 0 0',
              overflow: 'hidden',
              height: '100%',
              order: isExpanded ? 2 : 1,
            }}
            protocol={protocol ?? DEFAULT_PROTOCOL}
            timeframeOption={TIME_FILTER_OPTIONS[1]}
            currencyOption={currencyOption}
            openingPositions={openingPositions ?? []}
            closedPositions={closedPositions ?? []}
            fetchNextPage={handleFetchClosedPositions}
            hasNextPage={hasNextClosedPositions}
            isLoadingClosed={isLoadingClosed}
            account={account}
            handleExpand={handleExpand}
            isExpanded={isExpanded}
          />
          <Box
            width={isExpanded ? 500 : 'auto'}
            height={isExpanded ? '100%' : 70}
            order={isExpanded ? 1 : 2}
            sx={{
              flexShrink: 0,
              bg: 'neutral8',
              ...(isExpanded
                ? {
                    borderRight: 'small',
                    borderRightColor: 'neutral4',
                  }
                : {}),
            }}
          >
            {isExpanded ? (
              <TableTokenStatistic data={tokensStatistic?.data} currentPair={currentPair} changePair={setCurrentPair} />
            ) : (
              <ListTokenStatistic data={tokensStatistic?.data} currentPair={currentPair} changePair={setCurrentPair} />
            )}
          </Box>
        </Flex>
      )}
    </Flex>
  )
})

export default TraderChartPositions
