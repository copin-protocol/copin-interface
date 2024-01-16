import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import PageHeader from 'components/@ui/PageHeader'
import { ProtocolPageWrapper } from 'components/RouteWrapper'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { MarketLink } from '../Navigators'
import PositionsSection from '../PositionsSection'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import Filters, { useFilters } from './Filters'

export default function TopOpenings() {
  return (
    <ProtocolPageWrapper>
      <TopOpeningsPage />
    </ProtocolPageWrapper>
  )
}

function TopOpeningsPage() {
  const { protocol } = useParams<{ protocol: ProtocolEnum }>()

  const { sm, lg } = useResponsive()

  const { sort, onChangeSort, limit, onChangeLimit, time, from, to, onChangeTime } = useFilters()

  const {
    data,
    isFetching: isLoading,
    // isRefetching,
  } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, protocol, limit, time.id, sort.key],
    () =>
      getTopOpeningPositionsApi({
        protocol,
        limit,
        offset: 0,
        sortBy: sort.key,
        sortType: SortTypeEnum.DESC,
        from,
        to,
      }).then((data) => data.data),
    {
      retry: 0,
      // keepPreviousData: true,
      // refetchInterval: 5000,
    }
  )
  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <PageHeader
          pageTitle={`Open Interest on ${protocol}`}
          headerText={<Trans>OPEN INTEREST</Trans>}
          icon={Pulse}
          showOnMobile
          routeSwitchProtocol
          keepSearchOnSwitchProtocol
        />
        {sm ? (
          <Flex justifyContent="space-between" p={12} height="48px">
            <Filters
              currentSort={sort}
              currentLimit={limit}
              onChangeSort={onChangeSort}
              onChangeLimit={onChangeLimit}
              currentTimeOption={time}
              onChangeTime={onChangeTime}
            />
            <MarketLink text={<Trans>By Markets</Trans>} />
          </Flex>
        ) : (
          <Box px={3} py={12} sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            <Flex mb={12} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Type.CaptionBold>
                <Trans>Overall</Trans>
              </Type.CaptionBold>
              <MarketLink text={<Trans>By Markets</Trans>} />
            </Flex>
            <Filters
              currentSort={sort}
              currentLimit={limit}
              onChangeSort={onChangeSort}
              onChangeLimit={onChangeLimit}
              currentTimeOption={time}
              onChangeTime={onChangeTime}
            />
          </Box>
        )}
        <Box sx={{ flex: '1 0 0' }}>
          <Flex height="100%" flexDirection={lg ? 'row' : 'column'}>
            {lg ? (
              <Box flex="1">
                <VisualizeSection protocol={protocol} data={data} isLoading={isLoading} />
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
                isLoading={isLoading}
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
