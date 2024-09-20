import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ComponentProps, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getOpenInterestMarketApi } from 'apis/positionApis'
import { ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import { OpenInterestMarketData } from 'entities/statistic'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { TableProps, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT, getTokenTradeList } from 'utils/config/trades'

import { NoMarketFound } from '../OpenInterestByMarket'
import RouteWrapper from '../RouteWrapper'
import { TimeDropdown, useTimeFilter } from '../TopOpenIntrest/Filters'
import useSearchParamsState from '../useSearchParamsState'
import { ListForm, TableForm } from './ListMarkets'

export default function OpenInterestByMarkets({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  return (
    <RouteWrapper protocolFilter={protocolFilter}>
      <OpenInterestByMarketsPage />
    </RouteWrapper>
  )
}
function OpenInterestByMarketsPage() {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  const { sm } = useResponsive()

  const { searchParams, setSearchParams } = useSearchParams()

  const { setMarketsPageParams } = useSearchParamsState()
  useEffect(() => {
    setMarketsPageParams(searchParams as any)
  }, [searchParams])

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

  const { symbol, protocol = DEFAULT_PROTOCOL } = useParams<{
    symbol: string | undefined
    protocol: ProtocolEnum | undefined
  }>()

  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_OPEN_INTEREST_BY_MARKET, protocol, from, to, time],
    () => getOpenInterestMarketApi({ protocol, from, to, timeframe: time.value }),
    {
      keepPreviousData: true,
    }
  )

  const tokenTradeList = getTokenTradeList(protocol)
  const symbolInfo = symbol && tokenTradeList.find((token) => token.symbol === symbol)
  const sortedData = data?.length
    ? [...data]
        .map((_data) => ({
          ..._data,
          totalInterest: _data.totalLong + _data.totalShort,
          protocol,
        }))
        .filter((_data) =>
          symbolInfo ? TOKEN_TRADE_SUPPORT[protocol][_data.indexToken]?.symbol === symbolInfo?.symbol : true
        )
        .filter(
          (_data) =>
            !!tokenTradeList.find((_token) => _token.symbol === TOKEN_TRADE_SUPPORT[protocol][_data.indexToken]?.symbol)
        )
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
        height="48px"
        px={3}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
        }}
      >
        <Filter currentTimeOption={time} onChangeTime={onChangeTime} />
        <PythWatermark />
      </Flex>
      {symbol && !symbolInfo ? (
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
      ) : (
        <>
          {sm ? (
            <Box flex="1 0 0">
              <TableForm
                symbol={symbol}
                isFetching={isFetching}
                data={sortedData}
                timeOption={time}
                protocol={protocol}
                currentSort={symbolInfo ? undefined : currentSort}
                changeCurrentSort={symbolInfo ? undefined : onChangeSort}
              />
            </Box>
          ) : (
            <Box flex="1 0 0" overflow="hidden">
              <ListForm
                symbol={symbol}
                isFetching={isFetching}
                data={sortedData}
                timeOption={time}
                protocol={protocol}
                currentSort={currentSort}
                changeCurrentSort={onChangeSort}
              />
            </Box>
          )}
        </>
      )}
    </Flex>
  )
}
function Filter({ currentTimeOption, onChangeTime }: ComponentProps<typeof TimeDropdown>) {
  return (
    <Flex sx={{ gap: '6px' }}>
      <Type.CaptionBold>In</Type.CaptionBold>
      <TimeDropdown currentTimeOption={currentTimeOption} onChangeTime={onChangeTime} />
    </Flex>
  )
}
