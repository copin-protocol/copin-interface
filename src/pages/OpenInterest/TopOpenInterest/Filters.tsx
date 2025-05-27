import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { ReactNode, useMemo } from 'react'

import { MarketFilter } from 'components/@ui/MarketFilter'
import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import { PositionData } from 'entities/trader'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { getDropdownProps } from 'pages/Home/configs'
import Dropdown, { CheckableDropdownItem, DropdownItem } from 'theme/Dropdown'
import { Flex, Type } from 'theme/base'
import { PairFilterEnum, SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'
import { parsePairsFromQueryString, stringifyPairsQuery } from 'utils/helpers/transform'

import ItemWrapper from '../FilterItemWrapper'
import FilterMenuWrapper from '../FilterMenuWrapper'
import { TimeDropdown, TimeDropdownProps } from '../TimeFilterDropdown'

export default function Filters({
  currentSort,
  currentLimit,
  onChangeSort,
  onChangeLimit,
  currentTimeOption,
  onChangeTime,
  pairs,
  onChangePairs,
  excludedPairs,
  planToFilter,
  allowedFilter,
}: {
  currentSort: SortOption
  currentLimit: number
  onChangeSort: (optionKey: SortOption['key']) => void
  onChangeLimit: (limit: number) => void
  pairs: string[]
  onChangePairs: (pairs: string[], excludePairs: string[]) => void
  excludedPairs: string[]
  planToFilter: SubscriptionPlanEnum
  allowedFilter: boolean
} & TimeDropdownProps) {
  const { sm } = useResponsive()

  return (
    <Flex sx={{ gap: ['10px', '6px'] }} alignItems="center">
      {sm && <Type.Caption>SELECTED</Type.Caption>}
      <ItemWrapper
        permissionIconSx={{ transform: 'translateX(-8px)' }}
        allowedFilter={allowedFilter}
        planToFilter={planToFilter}
      >
        <MarketFilter
          pairs={pairs}
          onChangePairs={onChangePairs}
          excludedPairs={excludedPairs}
          menuWrapper={FilterMenuWrapper}
          iconSize={allowedFilter ? undefined : 0}
          allowedFilter={true}
        />
      </ItemWrapper>
      <Type.Caption>TOP</Type.Caption>
      <ItemWrapper allowedFilter={allowedFilter} planToFilter={planToFilter}>
        <Dropdown
          buttonVariant="ghostPrimary"
          inline
          iconSize={allowedFilter ? undefined : 0}
          {...getDropdownProps({ menuSx: allowedFilter ? {} : { width: 250 } })}
          menu={
            allowedFilter ? (
              <FilterMenuWrapper>
                {LIMITS.map((option) => (
                  <DropdownItem key={option} isActive={option === currentLimit} onClick={() => onChangeLimit(option)}>
                    {option}
                  </DropdownItem>
                ))}
              </FilterMenuWrapper>
            ) : (
              <></>
            )
          }
        >
          <Type.Caption>{currentLimit}</Type.Caption>
        </Dropdown>
      </ItemWrapper>
      {sm && <Type.Caption ml={2}>BY</Type.Caption>}
      <ItemWrapper allowedFilter={allowedFilter} planToFilter={planToFilter}>
        <Dropdown
          buttonVariant="ghostPrimary"
          inline
          iconSize={allowedFilter ? undefined : 0}
          {...getDropdownProps({ menuSx: allowedFilter ? {} : { width: 250 } })}
          menu={
            allowedFilter ? (
              <FilterMenuWrapper>
                {SORTS.map((option) => (
                  <CheckableDropdownItem
                    key={option.key}
                    selected={option.key === currentSort.key}
                    text={option.text}
                    onClick={() => onChangeSort(option.key)}
                  />
                ))}
              </FilterMenuWrapper>
            ) : (
              <></>
            )
          }
        >
          <Type.Caption>{currentSort.text}</Type.Caption>
        </Dropdown>
      </ItemWrapper>
      {sm && <Type.Caption ml={2}>OPEN FROM</Type.Caption>}
      <TimeDropdown
        currentTimeOption={currentTimeOption}
        onChangeTime={onChangeTime}
        allowedFilter={allowedFilter}
        planToFilter={planToFilter}
      />
    </Flex>
  )
}
export function useTimeFilter() {
  const { searchParams, setSearchParams } = useSearchParams()
  let time = DEFAULT_TIME

  if (searchParams.time) {
    const foundTime = ALL_TIME_FILTER_OPTIONS.find(
      (option) => option.id === (searchParams.time as unknown as TimeFilterByEnum)
    )
    if (foundTime) time = foundTime
  }
  const onChangeTime = (option: TimeFilterByEnum) => {
    setSearchParams({ time: option.toString(), ['page']: '1' })
  }
  const { from, to } = useMemo(() => {
    return getTimePeriod(time.value)
  }, [time.value])

  return { time, from, to, onChangeTime }
}

export function useFilters(args?: { isOverviewPage?: boolean }) {
  const { searchParams, setSearchParams, setSearchParamsOnly } = useSearchParams()

  const { getListSymbol } = useMarketsConfig()
  const defaultAllPairs = getListSymbol?.()

  let limit = DEFAULT_LIMIT
  let sort = DEFAULT_SORT

  // Get all selected pairs from query params
  const pairsFromQuery = searchParams.pairs as string | undefined
  const isAllPairs = pairsFromQuery === PairFilterEnum.ALL

  const pairs = useMemo(() => {
    if (!pairsFromQuery || isAllPairs) {
      if (!defaultAllPairs?.length) return []
      return defaultAllPairs
    }
    return parsePairsFromQueryString(pairsFromQuery)
  }, [pairsFromQuery, isAllPairs, defaultAllPairs])

  const excludedPairs =
    typeof searchParams.excludedPairs === 'string' ? parsePairsFromQueryString(searchParams.excludedPairs) : []

  if (searchParams.top && LIMITS.includes(Number(searchParams.top))) {
    limit = Number(searchParams.top)
  }
  if (searchParams.sort) {
    const foundSort = SORTS.find((sort) => sort.key === searchParams.sort?.toString())
    if (foundSort) sort = foundSort
  }

  const onChangeSort = (optionKey: SortOption['key']) => {
    setSearchParams({ sort: optionKey, ['page']: '1' })
  }
  const onChangeLimit = (limit: number) => {
    setSearchParams({ top: limit.toString(), ['page']: '1' })
  }

  const onChangePairs = (pairs: string[], excludedPairs: string[]) => {
    if (pairs.length == defaultAllPairs?.length) {
      setSearchParams({ pairs: PairFilterEnum.ALL, excludedPairs: stringifyPairsQuery(excludedPairs), ['page']: '1' })
      return
    }
    setSearchParams({
      pairs: stringifyPairsQuery(pairs),
      excludedPairs: stringifyPairsQuery(excludedPairs),
      ['page']: '1',
    })
  }

  const { time, from, to, onChangeTime } = useTimeFilter()

  const { hasExcludingPairs, isCopyAll } = useFilterPairs({ pairs, excludedPairs })

  const hasFilter = args?.isOverviewPage
    ? !!excludedPairs.length || (!isCopyAll && !!pairs.length) || time.id !== DEFAULT_TIME.id
    : !!excludedPairs.length ||
      (!isCopyAll && !!pairs.length) ||
      limit !== DEFAULT_LIMIT ||
      time.id !== DEFAULT_TIME.id ||
      sort.key !== DEFAULT_SORT.key

  const resetFilters = () => setSearchParamsOnly({})

  return {
    limit,
    sort,
    onChangeSort,
    onChangeLimit,
    time,
    from,
    to,
    onChangeTime,
    onChangePairs,
    pairs,
    isCopyAll,
    hasExcludingPairs,
    excludedPairs,
    hasFilter,
    resetFilters,
  }
}

const LIMITS = [100, 200, 500]

export type SortOption = {
  text: ReactNode
  key: keyof PositionData
}
const SORTS: SortOption[] = [
  {
    text: 'Latest',
    key: 'openBlockTime',
  },
  {
    text: 'PnL',
    key: 'pnl',
  },
  {
    text: 'Volume',
    key: 'size',
  },
]
const DEFAULT_SORT = SORTS[2]
const DEFAULT_LIMIT = LIMITS[0]
const DEFAULT_TIME = ALL_TIME_FILTER_OPTIONS[1]

function getTimePeriod(timeValue: number | undefined) {
  if (!timeValue) return { from: undefined, to: undefined }
  const to = dayjs()
  const from = to.subtract(timeValue, 'days')
  return { from: from.toISOString(), to: to.toISOString() }
}
