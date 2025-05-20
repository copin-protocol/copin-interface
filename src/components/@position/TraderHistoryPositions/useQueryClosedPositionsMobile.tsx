import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getTraderHistoryApi, getTraderTokensStatistic } from 'apis/traderApis'
import { QueryFilter } from 'apis/types'
import { PositionData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ALL_OPTION, ALL_TOKENS_ID } from 'utils/config/trades'
import { getPairFromSymbol, getSymbolFromPair, pageToOffset } from 'utils/helpers/transform'

const defaultSort: TableSortProps<PositionData> = {
  sortBy: 'closeBlockTime',
  sortType: SortTypeEnum.DESC,
}

export default function useQueryClosedPositionsMobile({
  address,
  protocol,
}: {
  address: string
  protocol: ProtocolEnum
}) {
  const {
    requiredPlanToUnlimitedPosition,
    isEnableTokenStats,
    isEnablePosition,
    isUnlimitedPosition: isUnlimited,
    maxPositionHistory: maxAllowedRecords,
  } = useTraderProfilePermission({ protocol })
  const isAllowedFetch = isEnablePosition && (isUnlimited || (!isUnlimited && maxAllowedRecords !== 0))

  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE,
    limitName: URL_PARAM_KEYS.TRADER_HISTORY_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })

  const { data: tokensStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, address],
    () => getTraderTokensStatistic({ protocol, account: address }),
    { enabled: !!address && !!protocol && isEnableTokenStats }
  )
  const tokenOptions = useMemo(() => {
    if (tokensStatistic?.data?.length) {
      const statisticSymbolOptions = tokensStatistic.data.map((e) => {
        const symbol = getSymbolFromPair(e.pair)
        return {
          id: symbol,
          label: symbol,
          value: symbol,
        }
      })
      return [ALL_OPTION, ...statisticSymbolOptions]
    }
    return [ALL_OPTION]
  }, [tokensStatistic])
  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: URL_PARAM_KEYS.CURRENCY,
    options: tokenOptions,
    callback: () => {
      changeCurrentPage(1)
    },
  })
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  // if (!!address) {
  //   queryFilters.push({ fieldName: 'account', value: address })
  // }
  if (currencyOption?.id && currencyOption?.id !== ALL_TOKENS_ID) {
    queryFilters.push({ fieldName: 'pair', value: getPairFromSymbol(currencyOption.id) })
  }

  const limit = isUnlimited ? currentLimit : Math.min(maxAllowedRecords, currentLimit)
  const { data, isFetching: isLoading } = useQuery<ApiListResponse<PositionData>>(
    [QUERY_KEYS.GET_POSITIONS_HISTORY, address, currentPage, limit, currencyOption?.id, protocol, isAllowedFetch],
    () => {
      return getTraderHistoryApi({
        limit,
        offset: pageToOffset(currentPage, limit),
        sort: defaultSort,
        account: address,
        protocol,
        queryFilters,
      })
    },
    {
      enabled: !!address && isAllowedFetch,
      retry: 0,
      keepPreviousData: true,
    }
  )

  return useMemo(
    () => ({
      tokenOptions,
      currencyOption,
      changeCurrency,
      currentPage,
      changeCurrentPage,
      currentLimit,
      changeCurrentLimit,
      closedPositions: data,
      isLoadingClosed: isLoading,
      maxAllowedRecords,
      isUnlimited,
      requiredPlanToUnlimitedPosition,
    }),
    [
      tokenOptions,
      currencyOption,
      changeCurrency,
      currentPage,
      changeCurrentPage,
      currentLimit,
      changeCurrentLimit,
      data,
      isLoading,
      maxAllowedRecords,
      isUnlimited,
      requiredPlanToUnlimitedPosition,
    ]
  )
}
