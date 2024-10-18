import { CrownSimple } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { ReactNode, useMemo } from 'react'

import { MarketFilter } from 'components/@ui/MarketFilter'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import { PositionData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { getDropdownProps } from 'pages/Home/configs'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { PairFilterEnum, ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { getPairsByProtocols } from 'utils/helpers/graphql'

export default function Filters({
  currentSort,
  currentLimit,
  onChangeSort,
  onChangeLimit,
  currentTimeOption,
  onChangeTime,
  protocols,
  pairs,
  onChangePairs,
  excludedPairs,
}: {
  currentSort: SortOption
  currentLimit: number
  onChangeSort: (optionKey: SortOption['key']) => void
  onChangeLimit: (limit: number) => void
  protocols: ProtocolEnum[]
  pairs: string[]
  onChangePairs: (pairs: string[], excludePairs: string[]) => void
  excludedPairs: string[]
} & TimeDropdownProps) {
  const { sm } = useResponsive()

  return (
    <Flex sx={{ gap: ['10px', '6px'] }} alignItems="center">
      {sm && <Type.CaptionBold sx={{ mt: '-1px' }}>Selected</Type.CaptionBold>}
      <MarketFilter protocols={protocols} pairs={pairs} onChangePairs={onChangePairs} excludedPairs={excludedPairs} />
      <Type.CaptionBold sx={{ mt: '-1px' }}>Top</Type.CaptionBold>
      <Dropdown
        {...getDropdownProps({})}
        menu={
          <>
            {LIMITS.map((option) => (
              <CheckableDropdownItem
                key={option}
                selected={option === currentLimit}
                text={option}
                onClick={() => onChangeLimit(option)}
              />
            ))}
          </>
        }
      >
        <Type.CaptionBold>{currentLimit}</Type.CaptionBold>
      </Dropdown>
      {sm && (
        <Type.CaptionBold ml={2} sx={{ mt: '-1px' }}>
          By
        </Type.CaptionBold>
      )}
      <Dropdown
        {...getDropdownProps({})}
        menu={
          <>
            {SORTS.map((option) => (
              <CheckableDropdownItem
                key={option.key}
                selected={option.key === currentSort.key}
                text={option.text}
                onClick={() => onChangeSort(option.key)}
              />
            ))}
          </>
        }
      >
        <Type.CaptionBold>{currentSort.text}</Type.CaptionBold>
      </Dropdown>
      {sm && (
        <Type.CaptionBold ml={2} sx={{ mt: '-1px' }}>
          In
        </Type.CaptionBold>
      )}
      <TimeDropdown currentTimeOption={currentTimeOption} onChangeTime={onChangeTime} />
    </Flex>
  )
}

type TimeDropdownProps = {
  currentTimeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterByEnum) => void
}

export function TimeDropdown({ currentTimeOption, onChangeTime }: TimeDropdownProps) {
  return (
    <Dropdown
      {...getDropdownProps({})}
      menu={
        <>
          {ALL_TIME_FILTER_OPTIONS.map((option) => (
            <CheckableDropdownItem
              key={option.id}
              selected={option.id === currentTimeOption.id}
              text={<Box as="span">{option.text}</Box>}
              onClick={() => {
                onChangeTime(option.id)
              }}
            />
          ))}
        </>
      }
    >
      <Type.CaptionBold sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box as="span">{currentTimeOption.text}</Box>
        {currentTimeOption.premiumFilter ? (
          <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
        ) : (
          ''
        )}
      </Type.CaptionBold>
    </Dropdown>
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
    setSearchParams({ time: option.toString() })
  }
  const { from, to } = useMemo(() => {
    return getTimePeriod(time.value)
  }, [time.value])

  return { time, from, to, onChangeTime }
}

export function useFilters() {
  const { searchParams, setSearchParams } = useSearchParams()

  const defaultAllPairs = getPairsByProtocols(RELEASED_PROTOCOLS)

  let limit = DEFAULT_LIMIT
  let sort = DEFAULT_SORT

  // Get all selected pairs from query params
  const pairsFromQuery = searchParams.pairs as string | undefined

  const pairs = useMemo(() => {
    if (!pairsFromQuery || pairsFromQuery === PairFilterEnum.ALL) {
      return defaultAllPairs
    }
    return pairsFromQuery.split('-')
  }, [pairsFromQuery, defaultAllPairs])

  const excludedPairs = typeof searchParams.excludedPairs === 'string' ? searchParams.excludedPairs.split('-') : []

  if (searchParams.top && LIMITS.includes(Number(searchParams.top))) {
    limit = Number(searchParams.top)
  }
  if (searchParams.sort) {
    const foundSort = SORTS.find((sort) => sort.key === searchParams.sort?.toString())
    if (foundSort) sort = foundSort
  }

  const onChangeSort = (optionKey: SortOption['key']) => {
    setSearchParams({ sort: optionKey })
  }
  const onChangeLimit = (limit: number) => {
    setSearchParams({ top: limit.toString() })
  }

  const onChangePairs = (pairs: string[], excludedPairs: string[]) => {
    if (pairs.length == defaultAllPairs.length) {
      setSearchParams({ pairs: PairFilterEnum.ALL, excludedPairs: excludedPairs.join('-') })
      return
    }
    setSearchParams({ pairs: pairs.join('-'), excludedPairs: excludedPairs.join('-') })
  }

  const { time, from, to, onChangeTime } = useTimeFilter()

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
    excludedPairs,
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
const DEFAULT_SORT = SORTS[0]
const DEFAULT_LIMIT = LIMITS[0]
const DEFAULT_TIME = ALL_TIME_FILTER_OPTIONS[0]

function getTimePeriod(timeValue: number | undefined) {
  if (!timeValue) return { from: undefined, to: undefined }
  const to = dayjs()
  const from = to.subtract(timeValue, 'days')
  return { from: from.toISOString(), to: to.toISOString() }
}
