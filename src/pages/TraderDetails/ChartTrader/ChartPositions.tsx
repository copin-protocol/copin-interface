import { ArrowsIn, ArrowsOutSimple, Coins } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderTokensStatistic } from 'apis/traderApis'
import NoDataFound from 'components/@ui/NoDataFound'
import { TableSortProps } from 'components/@ui/Table/types'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import ChartPositions from 'components/Charts/ChartPositions'
import { PositionData, TraderTokenStatistic } from 'entities/trader.d'
import useSearchParams from 'hooks/router/useSearchParams'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getTokenOptions } from 'utils/config/trades'

import { useInfiniteQueryPositions } from '../useQueryOptions'
import { ListTokenStatistic, TableTokenStatistic } from './TokenStatistic'

const CLOSED_POSITION_LIMIT = 50

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}
export default memo(TraderChartPositions)
function TraderChartPositions({
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
  const { searchParams } = useSearchParams()
  const [currentSort, setCurrentSort] = useState<TableSortProps<TraderTokenStatistic> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'totalTrade'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return {
      sortBy: initSortBy as TableSortProps<TraderTokenStatistic>['sortBy'],
      sortType: initSortType as SortTypeEnum,
    }
  })
  const { data: tokensStatistic, isLoading: loadingTokenStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, account, currentSort],
    () =>
      getTraderTokensStatistic({ protocol, account }, { sortBy: currentSort?.sortBy, sortType: currentSort?.sortType }),
    { enabled: !!account && !!protocol, retry: 0, keepPreviousData: true }
  )

  const currencyOptions = useMemo(() => {
    if (tokensStatistic?.data?.length) {
      const indexTokenMapping = tokensStatistic.data.reduce((result, _data) => {
        return { ...result, [_data.indexToken]: _data.indexToken }
      }, {} as Record<string, string>)
      return getTokenOptions({ protocol }).filter((option) => !!indexTokenMapping[option.id])
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
        px={3}
        py={2}
        pb={2}
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
              border: 'small',
              borderColor: 'neutral4',
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
        <NoDataFound />
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
            protocol={protocol ?? ProtocolEnum.GMX}
            timeframeOption={TIME_FILTER_OPTIONS[1]}
            currencyOption={currencyOption}
            openingPositions={openingPositions ?? []}
            closedPositions={closedPositions ?? []}
            fetchNextPage={handleFetchClosedPositions}
            hasNextPage={hasNextClosedPositions}
            isLoadingClosed={isLoadingClosed}
            account={account}
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
                currentSort={currentSort}
                changeCurrentSort={setCurrentSort}
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
}
