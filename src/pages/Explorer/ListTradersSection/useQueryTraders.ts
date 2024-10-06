import { BaseGraphQLResponse } from 'graphql/entities/base.graph'
import { useMemo } from 'react'

import { normalizeTraderData } from 'apis/normalize'
import { RequestBodyApiData } from 'apis/types'
import { ResponseTraderData, TraderData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { DEFAULT_LIMIT, MAX_LIMIT } from 'utils/config/constants'
import { CheckAvailableStatus, ProtocolEnum } from 'utils/config/enums'
import { getInitNumberValue } from 'utils/helpers/geInitialValue'
import { extractFiltersFromFormValues } from 'utils/helpers/graphql'
import { pageToOffset } from 'utils/helpers/transform'

import { FilterTabEnum } from '../ConditionFilter/configs'
import { formatRankingRanges } from '../helpers/formatRankingRanges'
import { getInitFilters, getInitSort } from '../helpers/getInitValues'
import { TradersContextData } from '../useTradersContext'
import useRangeFilterData from './useRangeFilterData'
import useTimeFilterData from './useTimeFilterData'

export default function useQueryTraders({
  protocol,
  tab,
  timeRange,
  timeOption,
  isRangeSelection,
  accounts,
  filterTab,
  selectedProtocols,
  setSelectedProtocols,
  isFavTraders = false,
  traderFavorites,
}: Pick<
  TradersContextData,
  'protocol' | 'tab' | 'timeRange' | 'timeOption' | 'isRangeSelection' | 'accounts' | 'filterTab'
> & {
  selectedProtocols: ProtocolEnum[]
  setSelectedProtocols: (protocols: ProtocolEnum[]) => void
  isFavTraders?: boolean
  traderFavorites?: string[]
}) {
  const { searchParams } = useSearchParams()

  const requestData = useMemo<RequestBodyApiData>(() => {
    const page = getInitNumberValue(searchParams, 'page', 1)
    const limit = getInitNumberValue(searchParams, 'limit', DEFAULT_LIMIT)
    const { sortBy, sortType } = getInitSort(searchParams)

    const request: Record<string, any> = {
      sortBy,
      sortType,
      pagination: {
        limit,
        offset: pageToOffset(page ?? 0, limit ?? 0),
      },
    }

    const ranges = extractFiltersFromFormValues(
      getInitFilters({
        searchParams,
        accounts,
        filterTab,
      })
    )
    request.ranges = ranges
    if (filterTab === FilterTabEnum.RANKING) {
      request.ranges = formatRankingRanges(ranges)
    }
    if (accounts) transformRequestWithAccounts(request, accounts, isFavTraders)
    return request
  }, [accounts, filterTab, searchParams])

  const { rangeTraders, loadingRangeTraders, loadingRangeProgress } = useRangeFilterData({
    protocol,
    tab,
    requestData,
    timeRange,
    isRangeSelection,
  })

  const { traders: timeTraders, loading: loadingTimeTraders } = useTimeFilterData({
    requestData,
    timeOption,
    selectedProtocols,
    setSelectedProtocols,
  })

  let timeTradersData = timeTraders

  if (!loadingTimeTraders && timeTraders) {
    const formattedTimeTraders = timeTraders.data.map((trader) => normalizeTraderData(trader))
    const data = { ...timeTraders, data: formattedTimeTraders } as BaseGraphQLResponse<ResponseTraderData>
    timeTradersData = data
  }

  let data = isRangeSelection ? rangeTraders : timeTradersData

  if (accounts && data) {
    const protocolAccounts = traderFavorites ?? accounts

    const accountsWithInfo = data.data.map((trader) => trader.account)

    const extraAccounts = protocolAccounts
      .filter((account) => {
        const [address, protocol] = account.split('-')
        return !accountsWithInfo.includes(address) && selectedProtocols.includes(protocol as ProtocolEnum)
      })
      .map((account) => {
        const [address, protocol] = account.split('-')
        return {
          account: address,
          protocol: protocol as ProtocolEnum,
        } as TraderData
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
  const isLoading = isRangeSelection ? loadingRangeTraders : loadingTimeTraders
  const isRangeProgressing =
    isRangeSelection && isLoading && loadingRangeProgress?.status !== CheckAvailableStatus.FINISH

  return { data, isLoading, isRangeProgressing, loadingRangeProgress }
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
