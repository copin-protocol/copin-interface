import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ComponentProps, ReactNode, useState } from 'react'
import { useQuery } from 'react-query'

import { getOpenInterestMarketApi } from 'apis/positionApis'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import FilterItemWrapper from 'components/@ui/FilterItemWrapper'
import { MarketFilter } from 'components/@ui/MarketFilter'
import PythWatermark from 'components/@ui/PythWatermark'
import { OpenInterestMarketData } from 'entities/statistic'
import useOIFilterPermission from 'hooks/features/subscription/useOIPermission'
import useOIPermission from 'hooks/features/subscription/useOIPermission'
import useSearchParams from 'hooks/router/useSearchParams'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { TableProps, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { getSymbolFromPair } from 'utils/helpers/transform'

import FilterMenuWrapper from '../FilterMenuWrapper'
import RouteWrapper from '../RouteWrapper'
import { TimeDropdown } from '../TimeFilterDropdown'
import { useFilters } from '../TopOpenInterest/Filters'
import { ListForm, TableForm } from './ListMarkets'

export default function OpenInterestByMarkets() {
  return (
    <RouteWrapper>
      <OpenInterestByMarketsPage />
    </RouteWrapper>
  )
}
function OpenInterestByMarketsPage() {
  const { isAuthenticated, loading } = useAuthContext()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { sm } = useResponsive()
  const { setSearchParams, searchParams } = useSearchParams()
  const { from, to, onChangeTime, time, pairs, onChangePairs, excludedPairs, hasFilter, resetFilters } = useFilters({
    isOverviewPage: true,
  })

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

  const { allowedFilter, planToFilter, isEnabled } = useOIPermission()
  // const { allowedSelectProtocols } = useProtocolPermission()

  const isNotLogin = !loading && !isAuthenticated
  let noDataMessage: ReactNode | undefined = undefined
  {
    if (!allowedFilter) {
      const requiredPlanText = SUBSCRIPTION_PLAN_TRANSLATION[planToFilter]

      let title: ReactNode = undefined
      let noLoginTitle: ReactNode = undefined
      let noLoginDescription: ReactNode = undefined
      // if (
      //   (selectedProtocols?.length &&
      //     allowedSelectProtocols?.length &&
      //     selectedProtocols.length > allowedSelectProtocols.length) ||
      //   selectedProtocols.some((p) => !allowedSelectProtocols.includes(p))
      // ) {
      //   title = <Trans>Protocol not allowed</Trans>
      // }

      if (hasFilter) {
        title = <Trans>This URL contains filters available from the {requiredPlanText} plan</Trans>
      } else {
        if (isNotLogin && !isEnabled) {
          noLoginTitle = <Trans>Login to view Open Interest</Trans>
          noLoginDescription = <Trans>Unlock more powerful features and gain deeper market insights</Trans>
        }
      }

      if (!!title || noLoginTitle) {
        noDataMessage = (
          <Flex
            sx={{ flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', position: 'relative' }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                left: 2,
                right: 2,
                bottom: 2,
                backgroundImage: `url(/images/subscriptions/live-trade-non-login-permission.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
                filter: 'blur(10px)',
              }}
            />
            <Box sx={{ maxWidth: 450, pt: [100, 100, 200] }}>
              {noLoginTitle ? (
                <PlanUpgradePrompt
                  requiredPlan={SubscriptionPlanEnum.FREE}
                  noLoginDescription={noLoginDescription}
                  noLoginTitle={noLoginTitle}
                  requiredLogin={!!noLoginTitle}
                  showNoLoginTitleIcon={!!noLoginTitle}
                />
              ) : (
                <PlanUpgradePrompt
                  title={title}
                  description={<Trans>Please upgrade to explore open interest with advanced filters</Trans>}
                  requiredPlan={planToFilter}
                  useLockIcon
                  showTitleIcon
                  onCancel={isNotLogin ? undefined : resetFilters}
                  cancelText={isNotLogin ? undefined : <Trans>Reset Filters</Trans>}
                />
              )}
            </Box>
          </Flex>
        )
      }
    }
  }

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_OPEN_INTEREST_BY_MARKET, selectedProtocols, from, to, time],
    () => getOpenInterestMarketApi({ protocols: selectedProtocols ?? [], from, to, timeframe: time.value }),
    {
      enabled: selectedProtocols != null && !noDataMessage,
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
          const symbol = getSymbolFromPair(_data.pair)
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

  if (selectedProtocols == null) return null

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
        {sm && <PythWatermark sx={{ ml: 2 }} />}
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
      {isLoading ? (
        <Loading />
      ) : noDataMessage ? (
        noDataMessage
      ) : (
        <>
          {sm ? (
            <Box flex="1 0 0">
              <TableForm
                isFetching={isLoading}
                data={sortedData}
                timeOption={time}
                currentSort={currentSort}
                changeCurrentSort={onChangeSort}
              />
            </Box>
          ) : (
            <Box flex="1 0 0" overflow="hidden">
              <ListForm
                isFetching={isLoading}
                data={sortedData}
                timeOption={time}
                currentSort={currentSort}
                changeCurrentSort={onChangeSort}
              />
            </Box>
          )}
        </>
      )}
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
  const { isEnabled, allowedFilter, planToFilter } = useOIFilterPermission()

  return (
    <Flex sx={{ gap: '6px', justifyContent: !lg ? 'space-between' : 'flex-start', width: !lg ? '100%' : 'auto' }}>
      <Flex sx={{ gap: '6px' }}>
        {sm && <Type.CaptionBold>SELECTED</Type.CaptionBold>}
        <FilterItemWrapper
          permissionIconSx={{ transform: 'translateX(-8px)' }}
          allowedFilter={allowedFilter}
          planToFilter={planToFilter}
        >
          <MarketFilter
            pairs={pairs}
            onChangePairs={onChangePairs}
            excludedPairs={excludedPairs}
            menuWrapper={FilterMenuWrapper}
            menuSx={isEnabled ? {} : { width: 220 }}
            iconSize={allowedFilter ? undefined : 0}
            allowedFilter={allowedFilter}
          />
        </FilterItemWrapper>
      </Flex>
      <Flex sx={{ gap: '6px' }}>
        <Type.CaptionBold>OPEN FROM</Type.CaptionBold>
        <TimeDropdown
          currentTimeOption={currentTimeOption}
          onChangeTime={onChangeTime}
          allowedFilter={allowedFilter}
          planToFilter={planToFilter}
        />
      </Flex>
    </Flex>
  )
}
