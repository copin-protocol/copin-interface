import { useMemo } from 'react'

import { RequestBodyApiData } from 'apis/types'
import { getFiltersFromFormValues } from 'components/ConditionFilterForm/helpers'
import { TraderData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { CheckAvailableStatus } from 'utils/config/enums'
import { getInitNumberValue } from 'utils/helpers/geInitialValue'
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
}: Pick<
  TradersContextData,
  'protocol' | 'tab' | 'timeRange' | 'timeOption' | 'isRangeSelection' | 'accounts' | 'filterTab'
>) {
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
    request.ranges = getFiltersFromFormValues(
      getInitFilters({
        searchParams,
        accounts,
        filterTab,
      })
    )
    if (filterTab === FilterTabEnum.RANKING) {
      request.ranges = formatRankingRanges(request.ranges)
    }
    if (accounts) transformRequestWithAccounts(request, accounts)
    return request
  }, [accounts, filterTab, searchParams])

  const { rangeTraders, loadingRangeTraders, loadingRangeProgress } = useRangeFilterData({
    protocol,
    tab,
    requestData,
    timeRange,
    isRangeSelection,
  })

  const { timeTraders, loadingTimeTraders } = useTimeFilterData({
    protocol,
    tab,
    requestData,
    timeOption,
    isRangeSelection,
  })

  let data = isRangeSelection ? rangeTraders : timeTraders
  if (accounts && data) {
    const accountsWithInfo: string[] = []
    data.data.forEach((trader) => {
      accountsWithInfo.push(trader.account)
    })
    data = {
      data: [
        ...data.data,
        ...accounts
          .filter((account) => !accountsWithInfo.includes(account))
          .map(
            (account) =>
              ({
                account,
              } as TraderData)
          ),
      ],
      meta: {
        limit: accounts.length,
        offset: 0,
        total: accounts.length,
        totalPages: 1,
      },
    }
  }
  const isLoading = isRangeSelection ? loadingRangeTraders : loadingTimeTraders
  const isRangeProgressing =
    isRangeSelection && isLoading && loadingRangeProgress?.status !== CheckAvailableStatus.FINISH

  return { data, isLoading, isRangeProgressing, loadingRangeProgress }
}

function transformRequestWithAccounts(request: RequestBodyApiData, accounts: string[]) {
  request.ranges = [
    {
      fieldName: 'account',
      in: accounts,
    },
  ]
  request.pagination = {
    limit: accounts.length,
    offset: 0,
  }
  return request
}
