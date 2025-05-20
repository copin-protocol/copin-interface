import { BaseGraphQLResponse } from 'graphql/entities/base.graph'
import { useMemo } from 'react'

import { normalizeTraderData } from 'apis/normalize'
import { RequestBodyApiData } from 'apis/types'
import { ResponseTraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { MAX_LIMIT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { extractFiltersFromFormValues } from 'utils/helpers/graphql'
import { pageToOffset } from 'utils/helpers/transform'

import { FilterTabEnum } from '../ConditionFilter/configs'
import { formatRankingRanges } from '../helpers/formatRankingRanges'
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
    filterTab,
    filters,
    isFavTraders,
    rankingFilters,
    userPermission?.isEnableRankingFilter,
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
    const formattedTimeTraders = timeTraders.data.map((trader) => getData(normalizeTraderData(trader) as any))
    const data = { ...timeTraders, data: formattedTimeTraders } as BaseGraphQLResponse<ResponseTraderData>
    timeTradersData = data
  }

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
