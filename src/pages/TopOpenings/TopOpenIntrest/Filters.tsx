import { CrownSimple } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useMemo } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import { PositionData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import { getDropdownProps } from 'pages/Home/configs'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'

export default function Filters({
  currentSort,
  currentLimit,
  onChangeSort,
  onChangeLimit,
  currentTimeOption,
  onChangeTime,
}: {
  currentSort: SortOption
  currentLimit: number
  onChangeSort: (optionKey: SortOption['key']) => void
  onChangeLimit: (limit: number) => void
} & TimeDropdownProps) {
  return (
    <Flex sx={{ gap: '6px' }} alignItems="center">
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
      <Type.CaptionBold ml={2} sx={{ mt: '-1px' }}>
        By
      </Type.CaptionBold>
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
      <Type.CaptionBold ml={2} sx={{ mt: '-1px' }}>
        In
      </Type.CaptionBold>
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
  let limit = DEFAULT_LIMIT
  let sort = DEFAULT_SORT

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

  const { time, from, to, onChangeTime } = useTimeFilter()

  return { limit, sort, onChangeSort, onChangeLimit, time, from, to, onChangeTime }
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
