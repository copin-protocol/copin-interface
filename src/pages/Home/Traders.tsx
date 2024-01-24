import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getTradersApi } from 'apis/traderApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import SimpleBacktestModal from 'components/BacktestModal/SimpleBacktestModal'
import ChartTraderPnL from 'components/Charts/ChartTraderPnL'
import { parsePnLStatsData } from 'components/Charts/ChartTraderPnL/helpers'
import CopyTraderButton from 'components/CopyTraderButton'
import FavoriteButton from 'components/FavoriteButton'
import TraderAddress from 'components/TraderAddress'
import { TraderData } from 'entities/trader'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
// import useIsMobile from 'hooks/helpers/useIsMobile'
// import useIsSafari from 'hooks/helpers/useIsSafari'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { formatDate } from 'utils/helpers/format'
import { generateExplorerRoute, generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'
import { getUserForTracking, logEvent, logEventBacktest, logEventHomeFilter } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import ProtocolDropdown from './ProtocolDropdown'
import SortDropdown from './SortDropdown'
import TimeFilter from './TimeDropdown'
import { BASE_RANGE_FILTER } from './configs'

const PADDING_X = 12
export default function Traders() {
  const { myProfile } = useMyProfile()
  const { searchParams, setSearchParams } = useSearchParams()
  const filters: FiltersState = useMemo(() => {
    const sortBy = (searchParams[URL_PARAM_KEYS.HOME_SORT_BY] as unknown as keyof TraderData | undefined) ?? 'pnl'
    const time =
      (searchParams[URL_PARAM_KEYS.HOME_TIME] as unknown as TimeFilterByEnum | undefined) ?? TimeFilterByEnum.S30_DAY
    const timeOption = time
      ? TIME_FILTER_OPTIONS.find((option) => option.id === time) ?? TIME_FILTER_OPTIONS[2]
      : TIME_FILTER_OPTIONS[2]
    const protocol =
      (searchParams[URL_PARAM_KEYS.HOME_PROTOCOL] as unknown as ProtocolEnum | undefined) ?? ProtocolEnum.KWENTA
    if (!protocol) setSearchParams({ [URL_PARAM_KEYS.HOME_PROTOCOL]: protocol })
    return {
      sortBy,
      time: timeOption,
      protocol,
    }
  }, [searchParams, setSearchParams])

  const logEventHome = (category: EventCategory, action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category,
      action,
    })
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        maxWidth: 2500,
        mx: 'auto',
      }}
    >
      <Box id={ELEMENT_IDS.HOME_HEADER_WRAPPER} sx={{ overflow: 'hidden', transition: 'max-height 0.5s ease-in-out' }}>
        <Flex
          mt={['-8px', 0, 2]}
          mb={[8, 24, 40]}
          sx={{ px: PADDING_X, pt: 3, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Type.H5 fontSize={['16px', '16px', '24px']}>
            <Trans>Follow 200,000+ on-chain traders</Trans>
          </Type.H5>
          <Type.CaptionBold
            display={{ _: 'block', sm: 'none' }}
            onClick={() => logEventHome(EventCategory.ROUTES, EVENT_ACTIONS[EventCategory.ROUTES].HOME_EXPLORE_MORE)}
          >
            <Link to={generateExplorerRoute({ protocol: filters.protocol })}>
              <Trans>Explore More</Trans>
            </Link>
          </Type.CaptionBold>
        </Flex>

        <Flex
          mb={12}
          px={PADDING_X}
          sx={{
            flexDirection: ['column', 'column', 'row'],
            width: '100%',
            gap: 3,
            alignItems: ['start', 'start', 'end'],
            justifyContent: 'space-between',
          }}
        >
          <Filters filters={filters} />
          <Type.CaptionBold
            display={{ _: 'none', sm: 'block' }}
            onClick={() => logEventHome(EventCategory.ROUTES, EVENT_ACTIONS[EventCategory.ROUTES].HOME_EXPLORE_MORE)}
          >
            <Link to={generateExplorerRoute({ protocol: filters.protocol })}>
              <Trans>Explore More</Trans>
            </Link>
          </Type.CaptionBold>
        </Flex>
      </Box>

      <Box flex="1 0 0">
        <ListTraders filters={filters} />
      </Box>
    </Flex>
  )
}

type FiltersState = {
  sortBy: keyof TraderData
  time: TimeFilterProps
  protocol: ProtocolEnum
}

function Filters({ filters }: { filters: FiltersState }) {
  const { myProfile } = useMyProfile()
  const { setSearchParams } = useSearchParams()
  const { checkIsPremium } = useIsPremiumAndAction()
  const handleChangeSort = (sortBy: keyof TraderData) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_SORT_BY]: sortBy as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: sortBy, username: myProfile?.username })
  }
  const handleChangeTime = (option: TimeFilterProps) => {
    if (option.id === TimeFilterByEnum.ALL_TIME && !checkIsPremium()) return
    setSearchParams({ [URL_PARAM_KEYS.HOME_TIME]: option.id as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: option.id, username: myProfile?.username })
  }
  const handleChangeProtocol = (protocol: ProtocolEnum) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_PROTOCOL]: protocol as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: protocol, username: myProfile?.username })
  }
  return (
    <Flex sx={{ gap: 3, flexWrap: 'wrap' }}>
      <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
        <Type.CaptionBold>
          <Trans>Top</Trans>
        </Type.CaptionBold>
        <SortDropdown sortBy={filters.sortBy} onChangeSort={handleChangeSort} />
      </Flex>
      <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
        <Type.CaptionBold>
          <Trans>In</Trans>
        </Type.CaptionBold>
        <TimeFilter timeOption={filters.time} onChangeTime={handleChangeTime} />
      </Flex>
      <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
        <Type.CaptionBold>
          <Trans>Source</Trans>
        </Type.CaptionBold>
        <ProtocolDropdown protocol={filters.protocol} onChangeProtocol={handleChangeProtocol} />
      </Flex>
    </Flex>
  )
}

const LIMIT = 12
function ListTraders({ filters }: { filters: FiltersState }) {
  const { profile, isAuthenticated } = useAuthContext()
  const { searchParams, setSearchParams } = useSearchParams()
  const currentPageParam = Number(searchParams[URL_PARAM_KEYS.HOME_PAGE])
  const currentPage = !isNaN(currentPageParam) ? currentPageParam : 1
  const changeCurrentPage = (page: number) => setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: page.toString() })

  const {
    data: traders,
    isLoading,
    isFetching,
  } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, filters, currentPage],
    () =>
      getTradersApi({
        protocol: filters.protocol ?? ProtocolEnum.GMX,
        body: {
          queries: [{ fieldName: 'type', value: filters.time.id }],
          ranges: BASE_RANGE_FILTER,
          pagination: { limit: LIMIT, offset: pageToOffset(currentPage, LIMIT) },
          sortBy: filters.sortBy,
          returnPnlStatistic: true,
        },
      }),
    {
      keepPreviousData: true,
      retry: 0,
      enabled: filters.time.id !== TimeFilterByEnum.ALL_TIME || profile?.plan === SubscriptionPlanEnum.PREMIUM,
    }
  )
  const [selectedTrader, setSelectedTrader] = useState<{ account: string; protocol: ProtocolEnum } | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0)
    }
  }, [traders])

  // const isMobile = useIsMobile()
  const { md } = useResponsive()
  // const isSafari = useIsSafari()

  // useEffect(() => {
  //   if (!isMobile || sm || isSafari) {
  //     const homeHeader = document.getElementById(ELEMENT_IDS.HOME_HEADER_WRAPPER)
  //     if (!!homeHeader) {
  //       homeHeader.style.cssText = ''
  //     }
  //     return
  //   }
  //   if (!scrollRef.current) return
  //   const homeHeader = document.getElementById(ELEMENT_IDS.HOME_HEADER_WRAPPER)
  //   let prevPos = 0
  //   let diff = 0
  //   let shouldChange = false
  //   const handleScroll = () => {
  //     if (!homeHeader || !scrollRef.current || !shouldChange) return
  //     shouldChange = false
  //     const showHeader = diff < 0
  //     if (showHeader) {
  //       homeHeader.style.cssText = 'max-height: 200px'
  //     } else {
  //       homeHeader.style.cssText = 'max-height: 0px'
  //     }
  //   }
  //   const handleTouchStart = (e: any) => {
  //     prevPos = e?.changedTouches?.[0]?.clientY ?? 0
  //   }
  //   const handleTouchEnd = (e: any) => {
  //     const newDiff = prevPos - (e?.changedTouches?.[0]?.clientY ?? 0)
  //     if (diff === 0) {
  //       diff = newDiff
  //       shouldChange = true
  //     } else {
  //       if (diff / newDiff < 1) {
  //         shouldChange = true
  //       }
  //       if (diff / newDiff >= 1) {
  //         shouldChange = false
  //       }
  //       diff = newDiff
  //     }
  //   }
  //   window.addEventListener('touchstart', handleTouchStart)
  //   window.addEventListener('touchend', handleTouchEnd)
  //   scrollRef.current.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('touchstart', handleTouchStart)
  //     window.removeEventListener('touchend', handleTouchEnd)
  //     scrollRef.current?.removeEventListener('scroll', handleScroll)
  //     prevPos = 0
  //     diff = 0
  //     shouldChange = false
  //   }
  // }, [isMobile, sm])

  const onClickBacktest = (traderData: TraderData) => {
    setSelectedTrader({ account: traderData.account, protocol: traderData.protocol })

    logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE, username: profile?.username })
  }

  // Logic apply when need fetching state and api is public & private
  const isDuplicateLoading = useRef(true)
  useEffect(() => {
    if (!isLoading && !isFetching && isAuthenticated != null) isDuplicateLoading.current = false
  }, [isLoading, isFetching, isAuthenticated])

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {(isLoading || (isFetching && !isDuplicateLoading.current)) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: [68, 68, 68, 32],
            bg: 'rgba(0, 0, 0, 0.75)',
            zIndex: 2,
          }}
        >
          <Loading />
        </Box>
      )}
      <Box
        id={ELEMENT_IDS.HOME_TRADERS_WRAPPER}
        ref={scrollRef}
        flex="1 0 0"
        sx={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative', zIndex: 1 }}
      >
        <Box
          px={PADDING_X}
          pb={3}
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr 1fr'],
            gap: 2,
            '@media all and (min-width: 1400px)': {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
            '@media all and (min-width: 1800px)': {
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
          }}
        >
          {traders?.data?.map((traderData) => {
            return (
              <TraderItem
                key={traderData.id}
                traderData={traderData}
                timeOption={filters.time}
                onClickBacktest={onClickBacktest}
              />
            )
          })}
        </Box>
      </Box>
      <Box display="none">
        <SimpleBacktestModal
          key={selectedTrader?.account ?? '' + selectedTrader?.protocol ?? ''}
          isOpen={!!selectedTrader}
          onDismiss={() => {
            setSelectedTrader(null)
          }}
          account={selectedTrader?.account}
          protocol={selectedTrader?.protocol}
          timeOption={filters.time}
        />
      </Box>
      {traders?.meta && (
        <Flex
          sx={{
            bg: 'neutral8',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            // justifyContent: ['start', 'start', 'start', 'space-between'],
            // alignItems: ['start', 'start', 'start', 'center'],
            // flexDirection: ['column', 'column', 'column', 'row'],
            flexWrap: 'wrap',
            py: [1, 1, 1, 0],
            px: [3, 3, 3, 0],
            pl: [3, 3, 3, 3],
            rowGap: 1,
          }}
        >
          <Type.Caption display={{ _: 'block', sm: 'none' }} color="neutral3" sx={{ order: [2, 1] }}>
            <Trans>Last update:</Trans>{' '}
            {traders?.data?.[0]?.statisticAt ? formatDate(traders?.data?.[0]?.statisticAt, DATE_FORMAT) : '--'}
          </Type.Caption>
          <Type.Caption display={{ _: 'none', sm: 'block' }} color="neutral3" sx={{ order: [2, 1] }}>
            <Trans>Last update:</Trans>{' '}
            {traders?.data?.[0]?.statisticAt ? formatDate(traders?.data?.[0]?.statisticAt) : '--'} UTC
          </Type.Caption>
          <Box sx={{ order: [1, 2] }}>
            <PaginationWithSelect
              disabledInput={!md}
              apiMeta={traders.meta}
              currentPage={currentPage}
              onPageChange={changeCurrentPage}
            />
          </Box>
        </Flex>
      )}
    </Flex>
  )
}
function TraderItem({
  traderData,
  onClickBacktest,
  timeOption,
}: {
  traderData: TraderData
  onClickBacktest: (traderData: TraderData) => void
  timeOption: TimeFilterProps
}) {
  return (
    <Box
      as={Link}
      to={generateTraderDetailsRoute(traderData.protocol, traderData.account, {
        type: traderData.type,
      })}
      sx={{
        display: 'block',
        color: 'inherit',
        width: '100%',
        height: '100%',
        bg: 'neutral5',
        px: 3,
        py: 12,
        transition: '0.3s',
        '&:hover': {
          bg: 'neutral4',
        },
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between', '& *': { fontWeight: 600 } }}>
        <TraderAddress
          address={traderData.account}
          protocol={traderData.protocol}
          options={{ timeType: traderData.type }}
        />
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          <FavoriteButton address={traderData.account} size={20} color="neutral2" hoverColor="neutral1" />
          <IconBox
            role="button"
            as={Link}
            to={generateTraderDetailsRoute(traderData.protocol, traderData.account, {
              type: traderData.type,
            })}
            icon={<CaretRight size={20} />}
            color="neutral2"
            sx={{ '&:hover': { color: 'neutral1' } }}
          />
        </Flex>
      </Flex>

      <Box mt={3} mb={20} sx={{ height: 60 }}>
        <ChartTraderPnL data={parsePnLStatsData(traderData.pnlStatistics)} dayCount={timeOption.value} height={30} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <Box>
          <Type.Caption display="block">
            <Trans>{TIME_TRANSLATION[traderData.type]} PnL ($)</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            <SignedText value={traderData.pnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>{TIME_TRANSLATION[traderData.type]} Avg ROI (%)</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            <SignedText value={traderData.avgRoi} minDigit={2} maxDigit={2} fontInherit suffix="%" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>Win/Trades</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            {traderData.totalWin}/{traderData.totalTrade}
          </Type.Caption>
        </Box>
      </Box>
      <Flex mt={20} sx={{ alignItems: 'center', gap: 2 }}>
        <CopyTraderButton
          source={EventSource.HOME}
          account={traderData.account}
          protocol={traderData.protocol}
          buttonText={<Trans>Copy</Trans>}
          buttonSx={{ width: 100, borderRadius: '4px' }}
          modalStyles={{ backdropFilter: 'none', overlayBackground: 'rgba(0, 0, 0, 0.85)' }}
        />
        <BacktestButton onClick={() => onClickBacktest(traderData)} />
      </Flex>
    </Box>
  )
}

const TIME_TRANSLATION: Record<string, ReactNode> = {
  [TimeFilterByEnum.ALL_TIME]: <Trans>All</Trans>,
  [TimeFilterByEnum.S7_DAY]: <Trans>7D</Trans>,
  [TimeFilterByEnum.S14_DAY]: <Trans>14D</Trans>,
  [TimeFilterByEnum.S30_DAY]: <Trans>30D</Trans>,
  [TimeFilterByEnum.S60_DAY]: <Trans>60D</Trans>,
}

function BacktestButton({ onClick }: { onClick: () => void }) {
  const handleOpenBackTestModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  }

  return (
    <Button variant="ghostPrimary" onClick={handleOpenBackTestModal} sx={{ p: 3, fontWeight: 400 }}>
      <Trans>Backtest</Trans>
    </Button>
  )
}
