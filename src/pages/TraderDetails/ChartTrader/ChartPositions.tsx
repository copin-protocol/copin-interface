import { ArrowsIn, ArrowsOutSimple, Coins } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderTokensStatistic } from 'apis/traderApis'
import NoDataFound from 'components/@ui/NoDataFound'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import ChartPositions from 'components/Charts/ChartPositions'
import { PositionData } from 'entities/trader.d'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT, TokenOptionProps, getTokenOptions } from 'utils/config/trades'

import { useInfiniteQueryPositions } from '../useQueryOptions'
import { ListTokenStatistic, TableTokenStatistic } from './TokenStatistic'

const CLOSED_POSITION_LIMIT = 50

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
  // Sort local
  // const { searchParams } = useSearchParams()
  // const [currentSort, setCurrentSort] = useState<TableSortProps<TraderTokenStatistic> | undefined>(() => {
  //   const initSortBy = searchParams?.sort_by ?? 'totalTrade'
  //   const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
  //   if (!initSortBy) return undefined
  //   return {
  //     sortBy: initSortBy as TableSortProps<TraderTokenStatistic>['sortBy'],
  //     sortType: initSortType as SortTypeEnum,
  //   }
  // })
  const { data: tokensStatistic, isLoading: loadingTokenStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, account],
    () => getTraderTokensStatistic({ protocol, account }),
    { enabled: !!account && !!protocol, retry: 0, keepPreviousData: true }
  )

  const currencyOptions: TokenOptionProps[] = useMemo(() => {
    if (tokensStatistic?.data?.length) {
      const statisticSymbols = tokensStatistic.data.map((e) => TOKEN_TRADE_SUPPORT[protocol][e.indexToken]?.symbol)
      return getTokenOptions({ protocol }).filter((option) => statisticSymbols.includes(option.label))
    }
    return []
  }, [protocol, tokensStatistic])

  const [currentPage, changeCurrentPage] = useState(1)
  const [currencyOption, changeCurrency] = useState(currencyOptions[0])
  useEffect(() => {
    if (!tokensStatistic) return
    if (tokensStatistic?.data?.length) {
      changeCurrency(
        currencyOptions.find((option) => option.id === tokensStatistic.data[0].indexToken) ?? currencyOptions[0]
      )
    } else {
      changeCurrency(currencyOptions[0])
    }
  }, [tokensStatistic])

  // const { openingPositions, closedPositions, isLoadingClosed, handleFetchClosedPositions, hasNextClosedPositions } =
  //   useQueryPositions({
  //     address: account,
  //     protocol,
  //     currencyOption,
  //     currentSort: undefined,
  //     currentPage,
  //     changeCurrentPage,
  //   })
  const { openingPositions, closedPositions, isLoadingClosed, handleFetchClosedPositions, hasNextClosedPositions } =
    useInfiniteQueryPositions({
      address: account,
      protocol,
      currencyOption,
      currentSort: undefined,
      currentPage,
      changeCurrentPage,
      limit: CLOSED_POSITION_LIMIT,
    })

  const { xl } = useResponsive()

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
        <Flex sx={{ gap: 2, alignItems: 'center' }}>
          <IconBox color="neutral3" icon={<Coins size={24} />} />
          <Type.BodyBold>Token Preference</Type.BodyBold>
        </Flex>
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
              // border: 'small',
              // borderColor: 'neutral4',
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
            bg: isExpanded ? 'neutral5' : 'transparent',
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
              <TableTokenStatistic
                data={tokensStatistic?.data}
                currencyOption={currencyOption}
                currencyOptions={currencyOptions}
                changeCurrency={changeCurrency}
                // currentSort={currentSort}
                // changeCurrentSort={setCurrentSort}
              />
            ) : (
              <ListTokenStatistic
                data={tokensStatistic?.data}
                currencyOption={currencyOption}
                currencyOptions={currencyOptions}
                changeCurrency={changeCurrency}
              />
            )}
          </Box>
        </Flex>
      )}
    </Flex>
  )
})

export default TraderChartPositions
