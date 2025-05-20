import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import {
  SEARCH_POSITIONS_INDEX,
  SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME,
  SEARCH_TOP_OPENING_POSITIONS_QUERY,
} from 'graphql/query'
import { ReactNode, useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { normalizePositionPayload } from 'apis/positionApis'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import PythWatermark from 'components/@ui/PythWatermark'
import ToastBody from 'components/@ui/ToastBody'
import { ResponsePositionData } from 'entities/trader'
import useOIPermission from 'hooks/features/subscription/useOIPermission'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { transformGraphqlFilters } from 'utils/helpers/graphql'
import { getPairFromSymbol } from 'utils/helpers/transform'

import PositionsSection from '../PositionsSection'
import VisualizeSection, { VisualizeSectionMobile } from '../VisualizeSection'
import FilterPositionButton from './FilterPositionButton'
import FilterPositionRangesTags from './FilterPositionRangeTags'
import Filters, { useFilters } from './Filters'
import useGetFilterRange from './useGetFilterRange'

export default function TopOpenInterest() {
  const { isAuthenticated, loading } = useAuthContext()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)

  const { ranges } = useGetFilterRange()
  const { lg, sm } = useResponsive()
  const {
    sort,
    onChangeSort,
    limit,
    onChangeLimit,
    time,
    from,
    to,
    onChangeTime,
    pairs,
    onChangePairs,
    excludedPairs,
    hasFilter,
    resetFilters,
    hasExcludingPairs,
    isCopyAll,
  } = useFilters()

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const { sortBy } = normalizePositionPayload({ sortBy: sort.key })

    const query: any = [
      { field: 'status', match: 'OPEN' },
      { field: 'openBlockTime', gte: from, lte: to },
    ]
    if (hasExcludingPairs) {
      query.push({
        field: 'pair',
        nin: excludedPairs.map((pair) => getPairFromSymbol(pair)),
      })
    } else if (!isCopyAll) {
      query.push({
        field: 'pair',
        in: pairs.map((pair) => getPairFromSymbol(pair)),
      })
    }
    const rangeFilters = transformGraphqlFilters(ranges.map((v) => ({ gte: v.gte, lte: v.lte, fieldName: v.field })))
    rangeFilters.forEach((values) => query.push(values))

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: SortTypeEnum.DESC }],
      paging: { size: limit, from: 0 },
    }

    return { index: SEARCH_POSITIONS_INDEX, body, protocols: selectedProtocols ?? [] }
  }, [sort.key, from, to, pairs, limit, selectedProtocols, excludedPairs, ranges, isCopyAll])

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
      // const protocols = queryVariables.protocols
      // if (
      //   (protocols?.length && allowedSelectProtocols?.length && protocols.length > allowedSelectProtocols.length) ||
      //   protocols.some((p) => !allowedSelectProtocols.includes(p))
      // ) {
      //   title = <Trans>Protocol not allowed</Trans>
      // }

      const hasRangeFilter = !!ranges.length
      if (hasFilter || hasRangeFilter) {
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

  const {
    data: topOpeningPositionsData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_TOP_OPENING_POSITIONS_QUERY, {
    skip: selectedProtocols == null || !!noDataMessage || loading || isAuthenticated == null,
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const rawPositionData =
    topOpeningPositionsData?.[SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME].data ||
    previousData?.[SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME].data

  const data = useMemo(() => {
    return rawPositionData?.map((position) => normalizePositionData(position))
  }, [rawPositionData])

  if (selectedProtocols == null) return null

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        p={3}
        height={TAB_HEIGHT}
        sx={{
          borderBottom: ['small', 'small', 'small', 'none'],
          borderBottomColor: ['neutral4', 'neutral4', 'neutral4', 'none'],
        }}
      >
        <Filters
          currentSort={sort}
          currentLimit={limit}
          onChangeSort={onChangeSort}
          onChangeLimit={onChangeLimit}
          currentTimeOption={time}
          onChangeTime={onChangeTime}
          pairs={pairs ?? []}
          onChangePairs={onChangePairs}
          excludedPairs={excludedPairs}
          allowedFilter={allowedFilter}
          planToFilter={planToFilter}
        />
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          {sm && <FilterPositionRangesTags allowedFilter={allowedFilter} />}
          {!sm && allowedFilter && <FilterPositionButton />}
          {sm && <PythWatermark />}
        </Flex>
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>
        {isLoading ? (
          <Loading />
        ) : noDataMessage ? (
          noDataMessage
        ) : (
          <Flex height="100%" flexDirection={lg ? 'row' : 'column'}>
            {lg ? (
              <Box flex="1">
                <VisualizeSection data={data} isLoading={isLoading} />
              </Box>
            ) : (
              <Box p={3}>
                <VisualizeSectionMobile data={data} />
              </Box>
            )}
            <Box flex={[1, 1, 1, '0 0 720px']}>
              {data && (
                <PositionsSection data={data} total={Math.min(limit, data?.length ?? 0)} isLoading={isLoading} />
              )}
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
