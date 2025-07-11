import { BaseGraphQLResponse } from 'graphql/entities/base.graph'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { normalizeTraderData } from 'apis/normalize'
import { getPnlStatisticsApi } from 'apis/traderApis'
import { getAllNoteLabelsApi } from 'apis/traderNoteApis'
import { RequestBodyApiData } from 'apis/types'
import { ResponseTraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useIsIF } from 'hooks/features/subscription/useSubscriptionRestrict'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { MAX_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { hideField } from 'utils/config/hideFileld'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { extractFiltersFromFormValues } from 'utils/helpers/graphql'
import { pageToOffset } from 'utils/helpers/transform'

import { FilterTabEnum } from '../ConditionFilter/configs'
import { formatIFLabelsRanges, formatLabelsRanges, formatRankingRanges } from '../helpers/formatRanges'
import { TradersContextData } from '../useTradersContext'
import useMapPermissionData from './useMapPermissionData'
import useTimeFilterData from './useTimeFilterData'

export default function useQueryTraders({
  tab,
  timeRange,
  timeOption,
  isRangeSelection,
  accounts,
  filterTab,
  selectedProtocols,
  isFavTraders = false,
  traderFavorites,
  rankingFilters,
  filters,
  labelsFilters,
  ifLabelsFilters,
  currentPage,
  currentLimit,
  currentSort,
  enabled = true,
}: Pick<
  TradersContextData,
  | 'tab'
  | 'timeRange'
  | 'timeOption'
  | 'isRangeSelection'
  | 'accounts'
  | 'filterTab'
  | 'filters'
  | 'rankingFilters'
  | 'labelsFilters'
  | 'ifLabelsFilters'
  | 'currentPage'
  | 'currentLimit'
  | 'currentSort'
> & {
  selectedProtocols: ProtocolEnum[] | null
  isFavTraders?: boolean
  traderFavorites?: string[]
  enabled?: boolean
}) {
  const { getData } = useMapPermissionData()
  const { userPermission } = useExplorerPermission()
  const { searchParams } = useSearchParams()
  const isIF = useIsIF()
  const pnlWithFeeEnabled = useUserPreferencesStore((state) => state.pnlWithFeeEnabled)
  const { data: allIFLabels } = useQuery(QUERY_KEYS.GET_ALL_NOTE_LABELS, () => getAllNoteLabelsApi(), {
    enabled: !!isIF,
  })

  const requestData = useMemo<RequestBodyApiData>(() => {
    const request: Record<string, any> = {
      sortBy: currentSort?.sortBy,
      sortType: currentSort?.sortType,
      pagination: {
        limit: currentLimit,
        offset: pageToOffset(currentPage ?? 0, currentLimit ?? 0),
      },
    }

    if (filterTab === FilterTabEnum.RANKING && userPermission?.isEnableRankingFilter) {
      request.ranges = formatRankingRanges(extractFiltersFromFormValues(rankingFilters))
    } else if (filterTab === FilterTabEnum.LABELS && isIF) {
      request.ranges = formatLabelsRanges(labelsFilters, pnlWithFeeEnabled)
    } else if (filterTab === FilterTabEnum.IF_LABELS && userPermission?.isEnableRankingFilter) {
      request.ranges = formatIFLabelsRanges(ifLabelsFilters.filter((label) => allIFLabels?.includes(label)))
    } else {
      request.ranges = extractFiltersFromFormValues(filters)
    }
    if (accounts) transformRequestWithAccounts(request, accounts, isFavTraders)
    return request
  }, [
    accounts,
    currentLimit,
    currentPage,
    currentSort?.sortBy,
    currentSort?.sortType,
    ifLabelsFilters,
    allIFLabels,
    filterTab,
    filters,
    isFavTraders,
    rankingFilters,
    pnlWithFeeEnabled,
    labelsFilters,
    isIF,
    userPermission,
  ])

  // const { rangeTraders, loadingRangeTraders, loadingRangeProgress } = useRangeFilterData({
  //   protocol,
  //   tab,
  //   requestData,
  //   timeRange,
  //   isRangeSelection,
  // })

  const { traders: timeTraders, loading: loadingTimeTraders } = useTimeFilterData({
    requestData,
    timeOption,
    selectedProtocols,
    enabled: !!userPermission && enabled,
  })

  let timeTradersData = timeTraders

  if (!loadingTimeTraders && timeTraders) {
    const formattedTimeTraders = timeTraders.data.map((trader) => {
      const newData = hideField(trader)
      const normalized = normalizeTraderData(newData, pnlWithFeeEnabled) as ResponseTraderData
      return getData(normalized)
    })
    const data = { ...timeTraders, data: formattedTimeTraders } as BaseGraphQLResponse<ResponseTraderData>
    timeTradersData = data
  }

  const { timeFilterOptions, defaultTimeOption } = useGetTimeFilterOptions()
  const urlTimeParamKey = isFavTraders ? URL_PARAM_KEYS.FAVORITE_TIME_FILTER : URL_PARAM_KEYS.HOME_TIME
  const urlTime = searchParams[urlTimeParamKey] as TimeFilterByEnum | undefined
  const selectedTimeOption = timeFilterOptions.find((option) => option.id === urlTime) ?? defaultTimeOption

  const timeFrame = [TimeFilterByEnum.S1_DAY, TimeFilterByEnum.LAST_24H].includes(selectedTimeOption.id)
    ? TimeFilterByEnum.S7_DAY
    : selectedTimeOption.id

  // let data = isRangeSelection ? rangeTraders : timeTradersData
  let data = timeTradersData

  if (accounts && data) {
    const protocolAccounts = traderFavorites ?? accounts

    const accountsWithInfo = data.data.map((trader) => trader.account)

    const extraAccounts = protocolAccounts
      .filter((account) => {
        const [address, protocol] = account.split('-')
        return !accountsWithInfo.includes(address) && selectedProtocols?.includes(protocol as ProtocolEnum)
      })
      .map((account) => {
        const [address, protocol] = account.split('-')
        return {
          account: address,
          protocol: protocol as ProtocolEnum,
        } as ResponseTraderData
      })

    data = {
      data: [...data.data, ...extraAccounts],
      meta: {
        limit: isFavTraders ? MAX_LIMIT : accounts.length,
        offset: 0,
        total: isFavTraders ? data.data.length + extraAccounts.length : accounts.length,
        totalPages: 1,
      },
    }
  }
  // const isLoading = isRangeSelection ? loadingRangeTraders : loadingTimeTraders
  // const isRangeProgressing =
  //   isRangeSelection && isLoading && loadingRangeProgress?.status !== CheckAvailableStatus.FINISH

  // return { data, isLoading, isRangeProgressing, loadingRangeProgress }

  const allAccounts =
    data?.data?.map((trader) => ({
      account: trader.account,
      protocol: trader.protocol,
    })) || []

  const { data: pnlDataAll, isLoading: loadingPnl } = useQuery<Record<string, any>>(
    [QUERY_KEYS.GET_PNL_STATISTICS, allAccounts.map((a) => a.account).join(','), timeFrame],
    () => {
      if (allAccounts.length === 0) return {}
      const payload = {
        accounts: allAccounts,
        statisticType: timeFrame,
      }
      return getPnlStatisticsApi(payload)
    },
    { enabled: !loadingTimeTraders && (data?.data?.length ?? 0) > 0 }
  )

  // Merge PnL to trader
  if (data && !loadingPnl && pnlDataAll) {
    data = {
      ...data,
      data: data.data.map((trader) => {
        const key = `${trader.account}-${trader.protocol}`
        return {
          ...trader,
          pnlStatistics: pnlDataAll[key] || null,
        }
      }),
    }
  }

  const isLoading = loadingTimeTraders

  return { data, isLoading }
}

function transformRequestWithAccounts(request: RequestBodyApiData, accounts: string[], isFavTrader: boolean) {
  request.ranges = [
    {
      fieldName: 'account',
      in: accounts,
    },
  ]
  request.pagination = {
    limit: isFavTrader ? MAX_LIMIT : accounts.length,
    offset: 0,
  }
  return request
}
