import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getOpenInterestMarketApi } from 'apis/positionApis'
import PageHeader from 'components/@ui/PageHeader'
import { TableProps, TableSortProps } from 'components/@ui/Table/types'
import { ProtocolPageWrapper } from 'components/RouteWrapper'
import { OpenInterestMarketData } from 'entities/statistic'
import useSearchParams from 'hooks/router/useSearchParams'
import Breadcrumb from 'theme/Breadcrumbs'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generateOIRoute } from 'utils/helpers/generateRoute'

import { TopOpenLink } from '../Navigators'
import { TimeDropdown, useTimeFilter } from '../TopOpenIntrest/Filters'
import { ListForm, TableForm } from './ListMarkets'

export default function OpenInterestByMarkets() {
  return (
    <ProtocolPageWrapper>
      <OpenInterestByMarketsPage />
    </ProtocolPageWrapper>
  )
}
function OpenInterestByMarketsPage() {
  const { sm } = useResponsive()

  const { searchParams, setSearchParams } = useSearchParams()
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

  const { protocol } = useParams<{ protocol: ProtocolEnum }>()

  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_OPEN_INTEREST_BY_MARKET, protocol, from, to],
    () => getOpenInterestMarketApi({ protocol, from, to }),
    {
      keepPreviousData: true,
    }
  )
  const sortedData = data?.length
    ? [...data].map((_data) => ({
        ..._data,
        totalInterest: _data.totalLong + _data.totalShort,
        protocol,
      }))
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
      <PageHeader
        pageTitle={`Open Interest By Markets On ${protocol}`}
        headerText={<Trans>OPEN INTEREST BY MARKETS</Trans>}
        icon={Pulse}
        showOnMobile
        routeSwitchProtocol
      />
      {sm ? (
        <Flex
          justifyContent="space-between"
          p={3}
          height="48px"
          sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}
        >
          <Filter currentTimeOption={time} onChangeTime={onChangeTime} />
          <TopOpenLink />
        </Flex>
      ) : (
        <Box px={3} py={12} sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
          <Breadcrumb
            items={[
              { title: <Trans>Overall</Trans>, path: generateOIRoute({ protocol, params: searchParams }) },
              { title: <Trans>Markets</Trans> },
            ]}
          />
          <Filter currentTimeOption={time} onChangeTime={onChangeTime} />
        </Box>
      )}
      <Box flex="1 0 0">
        {sm ? (
          <Box sx={{ height: '100%', pt: 2 }}>
            <TableForm
              isFetching={isFetching}
              data={sortedData}
              timeOption={time}
              protocol={protocol}
              currentSort={currentSort}
              changeCurrentSort={onChangeSort}
            />
          </Box>
        ) : (
          <ListForm
            isFetching={isFetching}
            data={sortedData}
            timeOption={time}
            protocol={protocol}
            currentSort={currentSort}
            changeCurrentSort={onChangeSort}
          />
        )}
      </Box>
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
