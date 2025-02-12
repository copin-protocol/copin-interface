import { useResponsive } from 'ahooks'
import { ComponentProps, useState } from 'react'
import { useQuery } from 'react-query'

import { getOpenInterestMarketApi } from 'apis/positionApis'
import { MarketFilter } from 'components/@ui/MarketFilter'
import { ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import { OpenInterestMarketData } from 'entities/statistic'
import useProtocolFromUrl from 'hooks/router/useProtocolFromUrl'
import useSearchParams from 'hooks/router/useSearchParams'
import { TableProps, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import RouteWrapper from '../RouteWrapper'
import { TimeDropdown, useFilters, useTimeFilter } from '../TopOpenInterest/Filters'
import { ListForm, TableForm } from './ListMarkets'

export default function OpenInterestByMarkets({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  return (
    <RouteWrapper protocolFilter={protocolFilter}>
      <OpenInterestByMarketsPage />
    </RouteWrapper>
  )
}
function OpenInterestByMarketsPage() {
  const { sm } = useResponsive()
  const { setSearchParams, searchParams, pathname } = useSearchParams()
  const { protocols } = useProtocolFromUrl(searchParams, pathname)
  const { pairs, onChangePairs, excludedPairs } = useFilters()
  const { from, to, time, onChangeTime } = useTimeFilter()

  const [currentSort, setCurrentShort] = useState<TableSortProps<OpenInterestMarketData> | undefined>(() => {
    if (searchParams.sort_by) {
      return {
        sortBy: searchParams.sort_by as unknown as keyof OpenInterestMarketData,
        sortType: (searchParams.sort_type as unknown as SortTypeEnum) ?? SortTypeEnum.DESC,
      }
    }
    return { sortBy: 'totalInterest', sortType: SortTypeEnum.DESC }
  })

  const onChangeSort: TableProps<OpenInterestMarketData, any>['changeCurrentSort'] = (sort) => {
    setSearchParams({ sort_by: sort?.sortBy ?? null, sort_type: sort?.sortType ?? null })
    setCurrentShort(sort)
  }

  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_OPEN_INTEREST_BY_MARKET, protocols, from, to, time],
    () => getOpenInterestMarketApi({ protocols, from, to, timeframe: time.value }),
    {
      keepPreviousData: true,
    }
  )

  const sortedData = data?.length
    ? [...data]
        .map((_data) => ({
          ..._data,
          totalInterest: _data.totalVolumeLong + _data.totalVolumeShort,
        }))
        .filter((_data) => {
          const symbol = _data.pair.split('-')[0]
          return pairs.includes(symbol) && !excludedPairs.includes(symbol)
        })
    : []

  if (currentSort) {
    sortedData.sort((a, b) => {
      const x = (a[currentSort.sortBy] as number) ?? 0
      const y = (b[currentSort.sortBy] as number) ?? 0
      return (x - y) * (currentSort.sortType === SortTypeEnum.DESC ? -1 : 1)
    })
  }

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Flex
        height={TAB_HEIGHT}
        px={3}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
        }}
      >
        <Filter
          currentTimeOption={time}
          onChangeTime={onChangeTime}
          pairs={pairs}
          excludedPairs={excludedPairs}
          onChangePairs={onChangePairs}
        />
        {sm && <PythWatermark />}
      </Flex>
      {/* {symbol && !symbolInfo ? (
        <NoMarketFound
          message={
            <Trans>
              {symbol} market does not exist on {protocolOptionsMapping[protocol]?.text}
            </Trans>
          }
        />
      ) : !isFetching && !sortedData?.length ? (
        <Box>
          <NoMarketFound message={symbol && <Trans>{symbol} market data was not found</Trans>} />
        </Box>
      ) : ( */}
      <>
        {sm ? (
          <Box flex="1 0 0">
            <TableForm
              isFetching={isFetching}
              data={sortedData}
              timeOption={time}
              currentSort={currentSort}
              changeCurrentSort={onChangeSort}
            />
          </Box>
        ) : (
          <Box flex="1 0 0" overflow="hidden">
            <ListForm
              isFetching={isFetching}
              data={sortedData}
              timeOption={time}
              currentSort={currentSort}
              changeCurrentSort={onChangeSort}
            />
          </Box>
        )}
      </>
      {/* )} */}
    </Flex>
  )
}
function Filter({
  currentTimeOption,
  onChangeTime,
  pairs,
  excludedPairs,
  onChangePairs,
}: ComponentProps<typeof TimeDropdown> & {
  pairs: string[]
  excludedPairs: string[]
  onChangePairs: (pairs: string[], excludePairs: string[]) => void
}) {
  const { lg, sm } = useResponsive()
  return (
    <Flex sx={{ gap: '6px', justifyContent: !lg ? 'space-between' : 'flex-start', width: !lg ? '100%' : 'auto' }}>
      {sm && <Type.CaptionBold>SELECTED</Type.CaptionBold>}
      <MarketFilter pairs={pairs} onChangePairs={onChangePairs} excludedPairs={excludedPairs} />
      <Flex sx={{ gap: '6px' }}>
        <Type.CaptionBold>IN</Type.CaptionBold>
        <TimeDropdown currentTimeOption={currentTimeOption} onChangeTime={onChangeTime} />
      </Flex>
    </Flex>
  )
}
