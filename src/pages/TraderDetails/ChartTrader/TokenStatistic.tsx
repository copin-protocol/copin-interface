import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Table from 'components/@ui/Table'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import { TraderTokenStatistic } from 'entities/trader'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ALL_TOKENS_ID, TokenOptionProps } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

type TokenStatisticProps = {
  data: TraderTokenStatistic[] | undefined
  currencyOption: TokenOptionProps
  currencyOptions: TokenOptionProps[]
  changeCurrency: (tokenOption: TokenOptionProps) => void
  currentSort?: TableSortProps<TraderTokenStatistic> | undefined
  changeCurrentSort?: (sort: TableSortProps<TraderTokenStatistic> | undefined) => void
}

const SLIDES_TO_SCROLL = 3
const PIXEL_TOLERANCE = 20

export function ListTokenStatistic({ data, currencyOption, currencyOptions, changeCurrency }: TokenStatisticProps) {
  const { tokenMapping = {}, totalTrades = 0 } = getStatsConfigs({ data, currencyOptions })
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPositionsRef = useRef<number[]>([])
  const lastScrollPositionRef = useRef<number>(0)

  const currentStats = useMemo(() => data?.find((e) => e.indexToken === currencyOption?.id), [currencyOption?.id, data])

  const scroll = useCallback((index: number) => {
    if (!scrollRef.current || !scrollPositionsRef.current.length) return
    scrollRef.current.scrollTo({
      left: scrollPositionsRef.current[index] ?? 0,
      top: 0,
      behavior: 'smooth',
    })
  }, [])
  const handleNext = useCallback(() => {
    if (!data?.length) return
    const next = lastScrollPositionRef.current + 1
    if (next >= Math.ceil(data.length / SLIDES_TO_SCROLL)) {
      return scroll(lastScrollPositionRef.current)
    }
    return scroll(next)
  }, [data?.length, scroll])
  const handlePrev = useCallback(() => {
    const prev = lastScrollPositionRef.current - 1
    if (prev <= 0) {
      return scroll(0)
    }
    scroll(prev)
  }, [scroll])
  const scrollHandler = useMemo(
    () =>
      debounce((e: Event) => {
        e.preventDefault()
        const target = e.target as HTMLDivElement
        const scrollLeft = target.scrollLeft
        for (let i = 0; i < scrollPositionsRef.current.length; i++) {
          if (!scrollPositionsRef.current[i + 1]) {
            if (scrollPositionsRef.current[i - 1] <= scrollLeft) {
              lastScrollPositionRef.current = i
            }
          } else if (scrollPositionsRef.current[i] - PIXEL_TOLERANCE <= scrollLeft) {
            lastScrollPositionRef.current = i
          }
        }
      }, 100),
    []
  )
  const wheelHandler = useMemo(
    () =>
      debounce((e: WheelEvent) => {
        e.preventDefault()
        const isTouchpad = Math.abs(e.deltaX) !== 0 || Math.abs(e.deltaY) < 15
        if (e.shiftKey || isTouchpad) return
        if (e.deltaY > 0) {
          handleNext()
        } else {
          handlePrev()
        }
      }, 100),
    [handleNext, handlePrev]
  )
  const [showScrollNavigators, setShowScrollNavigators] = useState(false)
  useEffect(() => {
    if (!data?.length || !scrollRef.current) return
    scrollPositionsRef.current = []
    const children = scrollRef.current.children
    let scrollTo = 0
    for (let i = 0; i < data.length; i++) {
      if (i % SLIDES_TO_SCROLL === 0) {
        scrollPositionsRef.current.push(scrollTo)
      }
      const width = children[i]?.getBoundingClientRect?.().width
      scrollTo += width
    }
    if (scrollTo > scrollRef.current.clientWidth + PIXEL_TOLERANCE) setShowScrollNavigators(true)
    scrollRef.current.addEventListener('scroll', scrollHandler)
    scrollRef.current.addEventListener('wheel', wheelHandler)
    return () => {
      scrollRef.current?.removeEventListener('scroll', scrollHandler)
      scrollRef.current?.removeEventListener('wheel', scrollHandler)
    }
  }, [data, scrollHandler, wheelHandler])

  if (!Object.keys(tokenMapping).length || !data?.length) return <></>

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {currentStats && (
        <Flex
          alignItems="center"
          p={2}
          height={32}
          backgroundColor="neutral5"
          sx={{ gap: 3, borderTop: 'small', borderColor: 'neutral4' }}
        >
          <Flex sx={{ gap: 2 }}>
            <Type.Caption color="neutral2">Win Rate:</Type.Caption>
            <Type.CaptionBold>
              {formatNumber((currentStats.totalWin / currentStats.totalTrade) * 100, 2, 2)}%
            </Type.CaptionBold>
          </Flex>
          <Flex sx={{ gap: 2 }}>
            <Type.Caption color="neutral2">Trades:</Type.Caption>
            <Type.CaptionBold>{formatNumber(currentStats.totalTrade, 0)}</Type.CaptionBold>
          </Flex>
          <Flex sx={{ gap: 2 }}>
            <Type.Caption color="neutral2">PnL ($):</Type.Caption>
            <Type.CaptionBold>
              <SignedText value={currentStats.realisedPnl} fontInherit minDigit={2} maxDigit={2} />
            </Type.CaptionBold>
          </Flex>
        </Flex>
      )}
      <Box
        height={40}
        sx={{
          position: 'relative',
          '&:hover': {
            '.tokens_prev,.tokens_next': { opacity: '1' },
          },
        }}
      >
        <Flex
          ref={scrollRef}
          sx={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            overflow: 'auto',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            '& > *': { flexShrink: 0 },
            zIndex: 1,
            position: 'relative',
          }}
        >
          {data.map((stats) => {
            const indexToken = stats.indexToken
            const tokenOption = tokenMapping[indexToken]
            if (!tokenOption) return <></>
            const icon = `/svg/markets/${tokenOption.label}.svg`
            const tradeRatio = Math.round((stats.totalTrade / totalTrades) * 100)
            return (
              <Flex
                key={indexToken}
                role="button"
                onClick={() => changeCurrency?.(tokenOption)}
                sx={{
                  px: 2,
                  py: '6px',
                  height: '100%',
                  alignItems: 'center',
                  bg: currencyOption?.id === indexToken ? 'neutral5' : 'transparent',
                  '&:hover': {
                    bg: 'neutral4',
                  },
                  gap: 2,
                  '& > *': { flexShrink: 0 },
                }}
              >
                <Image src={icon} sx={{ width: 24, height: 24, borderRadius: '50%' }} alt={tokenOption.label} />
                <Type.Caption>
                  {tokenOption.label}{' '}
                  <Box as="span" color="neutral3">
                    ({tradeRatio}%)
                  </Box>
                </Type.Caption>
              </Flex>
            )
          })}
        </Flex>

        {showScrollNavigators && (
          <>
            <ScrollNavigator
              className="tokens_prev"
              icon={<CaretLeft size={16} />}
              color="neutral2"
              onClick={handlePrev}
              sx={{ left: 0 }}
            />
            <ScrollNavigator
              className="tokens_next"
              icon={<CaretRight size={16} />}
              color="neutral2"
              onClick={handleNext}
              sx={{ right: 0 }}
            />
          </>
        )}
      </Box>
    </Box>
  )
}
const ScrollNavigator = styled(IconBox)({
  display: 'flex',
  opacity: '0',
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100% - 6px)',
  width: '24px',
  background: themeColors.neutral5,
  borderLeft: '1px solid',
  borderLeftColor: themeColors.neutral4,
  top: '1px',
  zIndex: 2,
  cursor: 'pointer',
  transition: '0.3s',
})
export function TableTokenStatistic({
  data,
  currencyOption,
  currencyOptions,
  changeCurrency,
  currentSort,
  changeCurrentSort,
}: TokenStatisticProps) {
  const { tokenMapping = {} } = getStatsConfigs({ data, currencyOptions })
  if (!Object.keys(tokenMapping).length || !data?.length) return <></>

  const tableColumns: ColumnData<TraderTokenStatistic>[] = [
    {
      title: 'Market',
      dataIndex: 'indexToken',
      key: 'indexToken',
      style: { minWidth: '80px' },
      render: (item) => {
        const indexToken = item.indexToken
        const tokenOption = tokenMapping[indexToken]
        if (!tokenOption) return <></>
        const icon = `/svg/markets/${tokenOption.label}.svg`
        return (
          <Flex
            role="button"
            sx={{
              alignItems: 'center',
              gap: 2,
              '& > *': { flexShrink: 0 },
            }}
          >
            <Image src={icon} sx={{ width: 24, height: 24, borderRadius: '50%' }} alt={tokenOption.label} />
            <Type.Caption>{tokenOption.label}</Type.Caption>
          </Flex>
        )
      },
    },
    {
      title: 'Trades',
      dataIndex: 'totalTrade',
      key: 'totalTrade',
      sortBy: 'totalTrade',
      style: { minWidth: '70px', textAlign: 'right' },
      render: (item) => {
        return <Type.Caption color="neutral1">{formatNumber(item.totalTrade, 0)}</Type.Caption>
      },
    },
    {
      title: 'Win Rate',
      dataIndex: undefined,
      key: undefined,
      style: { minWidth: '80px', textAlign: 'right' },
      render: (item) => {
        return (
          <Type.Caption color="neutral1">
            {formatNumber(item.winRate ?? (item.totalTrade ? (item.totalWin / item.totalTrade) * 100 : 0), 2, 2)}%
          </Type.Caption>
        )
      },
    },
    {
      title: 'Volume',
      dataIndex: 'totalVolume',
      key: 'totalVolume',
      sortBy: 'totalVolume',
      style: { minWidth: '100px', textAlign: 'right' },
      render: (item) => {
        return (
          <Type.Caption color="neutral1">
            {item.totalVolume ? `$${formatNumber(item.totalVolume, 0, 0)}` : '--'}
          </Type.Caption>
        )
      },
    },
    {
      title: 'PnL ($)',
      dataIndex: 'realisedPnl',
      key: 'realisedPnl',
      sortBy: 'realisedPnl',
      style: { minWidth: '110px', textAlign: 'right' },
      render: (item) => {
        return (
          <Type.Caption>
            <SignedText value={item.realisedPnl} fontInherit minDigit={2} maxDigit={2} />
          </Type.Caption>
        )
      },
    },
  ]
  return (
    <Table
      wrapperSx={{
        pt: 2,
        pr: 0,
        table: {
          '& th:first-child, td:first-child': {
            pl: 3,
          },
          '& th:last-child, td:last-child': {
            pr: 3,
          },
        },
      }}
      data={data}
      columns={tableColumns}
      isLoading={false}
      renderRowBackground={(data) => (data.indexToken === currencyOption?.id ? themeColors.neutral5 : 'transparent')}
      restrictHeight
      onClickRow={(data) => changeCurrency(tokenMapping[data.indexToken])}
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
    />
  )
}

function getStatsConfigs({ data, currencyOptions }: Pick<TokenStatisticProps, 'data' | 'currencyOptions'>) {
  const tokenOptions = currencyOptions?.filter((option) => option.id !== ALL_TOKENS_ID)
  const tokenMapping = tokenOptions.reduce((result, option) => {
    return { ...result, [option.id]: option }
  }, {} as Record<string, TokenOptionProps>)
  const totalTrades = data?.reduce((result, _data) => result + _data.totalTrade ?? 0, 0)
  return { tokenMapping, totalTrades }
}
