import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { TraderGraphQLResponse } from 'graphql/entities/traders.graph'
import { SEARCH_TRADERS_QUERY } from 'graphql/traders.graph'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { normalizePositionPayload } from 'apis/positionApis'
import { getPnlStatisticsApi } from 'apis/traderApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import BacktestSimpleModal from 'components/@backtest/BacktestSimpleModal'
import LineChartTraderPnl from 'components/@charts/LineChartPnL'
import { parsePnLStatsData } from 'components/@charts/LineChartPnL/helpers'
import CopyTraderButton from 'components/@copyTrade/CopyTraderButton'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { ProtocolFilter } from 'components/@ui/ProtocolFilter'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import ToastBody from 'components/@ui/ToastBody'
import TraderAddress from 'components/@ui/TraderAddress'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { Account, PnlStatisticsResponse, ResponseTraderData, StatisticData, TraderData } from 'entities/trader'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
// import useIsMobile from 'hooks/helpers/useIsMobile'
// import useIsSafari from 'hooks/helpers/useIsSafari'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS, DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { TIME_TRANSLATION } from 'utils/config/translations'
import { formatDate } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { transformGraphqlFilters, useProtocolFromUrl } from 'utils/helpers/graphql'
import { pageToOffset } from 'utils/helpers/transform'
import { getUserForTracking, logEvent, logEventBacktest, logEventHomeFilter } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import SortDropdown from './SortDropdown'
import TimeFilter from './TimeDropdown'
import { BASE_RANGE_FILTER } from './configs'

const PADDING_X = 12
const graphqlBaseFilters = transformGraphqlFilters(BASE_RANGE_FILTER)

export default function Traders() {
  const { myProfile } = useMyProfile()
  const { searchParams, setSearchParams, pathname } = useSearchParams()
  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const {
    selectedProtocols,
    checkIsSelected: checkIsProtocolChecked,
    handleToggle: handleToggleProtocol,
    setSelectedProtocols,
  } = useProtocolFilter({ defaultSelects: protocolOptions.map((_p) => _p.id) })

  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)

  useEffect(() => {
    if (foundProtocolInUrl) {
      setSelectedProtocols(foundProtocolInUrl)
    }
  }, [])

  const filters: FiltersState = useMemo(() => {
    const sortBy = (searchParams[URL_PARAM_KEYS.HOME_SORT_BY] as unknown as keyof TraderData | undefined) ?? 'pnl'
    const time =
      (searchParams[URL_PARAM_KEYS.HOME_TIME] as unknown as TimeFilterByEnum | undefined) ?? TimeFilterByEnum.S30_DAY
    const timeOption = time
      ? TIME_FILTER_OPTIONS.find((option) => option.id === time) ?? TIME_FILTER_OPTIONS[2]
      : TIME_FILTER_OPTIONS[2]

    return {
      sortBy,
      time: timeOption,
      protocols: selectedProtocols,
    }
  }, [searchParams, setSearchParams, selectedProtocols])

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
          mt={['-8px', 0]}
          mb={[8, 24]}
          sx={{ px: PADDING_X, pt: 3, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Type.H5 fontSize={['16px', '16px', '24px']}>
            <Trans>Follow 200,000+ on-chain traders</Trans>
          </Type.H5>
          {/* <Type.CaptionBold
            display={{ _: 'block', sm: 'none' }}
            onClick={() => logEventHome(EventCategory.ROUTES, EVENT_ACTIONS[EventCategory.ROUTES].HOME_EXPLORE_MORE)}
          >
            <Link to={generateExplorerRoute({ protocol: filters.protocol })}>
              {' '}
              <Trans>Explore More</Trans>
            </Link>
          </Type.CaptionBold> */}
        </Flex>

        <Flex
          mb={12}
          px={PADDING_X}
          sx={{
            flexDirection: ['column', 'column', 'row'],
            width: '100%',
            gap: 1,
            alignItems: ['start', 'start', 'end'],
            justifyContent: 'space-between',
          }}
        >
          <Filters
            filters={filters}
            protocolFilter={{
              allowList,
              selectedProtocols,
              setSelectedProtocols,
              checkIsProtocolChecked,
              handleToggleProtocol,
            }}
          />
          {/* <Type.CaptionBold
            display={{ _: 'none', sm: 'block' }}
            onClick={() => logEventHome(EventCategory.ROUTES, EVENT_ACTIONS[EventCategory.ROUTES].HOME_EXPLORE_MORE)}
          >
            <Link to={generateExplorerRoute({ protocol: filters.protocol })}>
              {' '}
              <Trans>Explore More</Trans>
            </Link>
          </Type.CaptionBold> */}
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
  protocols: ProtocolEnum[]
}

type ProtocolFilter = {
  selectedProtocols: ProtocolEnum[]
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  handleToggleProtocol: (option: ProtocolEnum) => void
  allowList: ProtocolEnum[]
  setSelectedProtocols: (protocols: ProtocolEnum[]) => void
}

function Filters({ filters, protocolFilter }: { filters: FiltersState; protocolFilter: ProtocolFilter }) {
  const { myProfile } = useMyProfile()
  const { setSearchParams } = useSearchParams()

  const handleChangeSort = (sortBy: keyof TraderData) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_SORT_BY]: sortBy as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: sortBy, username: myProfile?.username })
  }

  const handleChangeTime = (option: TimeFilterProps) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_TIME]: option.id as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: option.id, username: myProfile?.username })
  }

  const { sm } = useResponsive()

  return (
    <Flex sx={{ gap: [2, 3], flexWrap: 'wrap' }}>
      <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
        <Type.CaptionBold>
          <Trans>TOP</Trans>
        </Type.CaptionBold>
        <SortDropdown sortBy={filters.sortBy} onChangeSort={handleChangeSort} />
      </Flex>
      <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
        <Type.CaptionBold>
          <Trans>IN</Trans>
        </Type.CaptionBold>
        <TimeFilter timeOption={filters.time} onChangeTime={handleChangeTime} />
      </Flex>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.CaptionBold>
          <Trans>SOURCE</Trans>
        </Type.CaptionBold>
        <ProtocolFilter
          {...protocolFilter}
          placement={sm ? 'bottom' : 'bottomRight'}
          menuSx={{ width: ['300px', '400px', '50vw', '50vw'] }}
        />
      </Flex>
    </Flex>
  )
}

const LIMIT = 12
function ListTraders({ filters }: { filters: FiltersState }) {
  const { md } = useResponsive()
  const { profile, isAuthenticated } = useAuthContext()
  const { searchParams, setSearchParams } = useSearchParams()
  const currentPageParam = Number(searchParams[URL_PARAM_KEYS.HOME_PAGE])
  const currentPage = !isNaN(currentPageParam) ? currentPageParam : 1
  const changeCurrentPage = (page: number) => setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: page.toString() })
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [selectedTrader, setSelectedTrader] = useState<{ account: string; protocol: ProtocolEnum } | null>(null)

  // METHODS
  const queryVariables = useMemo(() => {
    const index = 'copin.position_statistics'

    const { sortBy } = normalizePositionPayload(filters)

    const query = [
      ...graphqlBaseFilters,
      { field: 'protocol', in: filters.protocols },
      { field: 'type', match: filters.time.id },
    ]
    // if (!!filters.protocols?.length && filters.protocols.length !== RELEASED_PROTOCOLS.length) {
    //   query.push({ field: 'protocol', in: filters.protocols })
    // }

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: 'desc' }],
      paging: { size: LIMIT, from: pageToOffset(currentPage, LIMIT) },
    }

    return { index, body }
  }, [filters, currentPage])

  const onClickBacktest = (trader: TraderData) => {
    setSelectedTrader({ account: trader.account, protocol: trader.protocol })

    logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE, username: profile?.username })
  }

  const getPnlStatisticsPayload = (traderData: any): StatisticData => {
    const accounts: Account[] = traderData?.searchPositionStatistic?.data?.map((trader: TraderData) => ({
      account: trader.account,
      protocol: trader.protocol,
    }))

    const payload: StatisticData = {
      accounts,
      statisticType: filters.time.id,
    }

    return payload
  }

  // FETCH DATA
  const {
    data: traderData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<TraderGraphQLResponse<ResponseTraderData>>(SEARCH_TRADERS_QUERY, {
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const { data: pnlData } = useQuery(
    [QUERY_KEYS.GET_PNL_STATISTICS, traderData],
    () => getPnlStatisticsApi(getPnlStatisticsPayload(traderData)),
    {
      enabled: !!traderData,
    }
  )

  const traders = traderData?.searchPositionStatistic || previousData?.searchPositionStatistic

  // HANDLE EFFECTS
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0)
    }
  }, [traders])

  // Apply this logic when need fetching state and api is public & private
  const isDuplicateLoading = useRef(true)
  useEffect(() => {
    if (!isLoading && isAuthenticated != null) isDuplicateLoading.current = false
  }, [isLoading, isAuthenticated])

  if (filters.protocols.length == 0) {
    return (
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image mt={64} mb={2} src={tokenNotFound} width={190} height={190} alt="token" />
        <Box sx={{ color: 'neutral3' }}>
          <Trans>
            Choose <Type.BodyBold sx={{ color: 'neutral1' }}>Perp DEXs source </Type.BodyBold> to view traders list.
          </Trans>
        </Box>
      </Flex>
    )
  }

  if (traders && traders.data?.length === 0) {
    return (
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image mt={64} mb={2} src={tokenNotFound} width={190} height={190} alt="token" />
        <Box sx={{ color: 'neutral3' }}>
          <Trans>Not found any trending traders at this moment</Trans>
        </Box>
      </Flex>
    )
  }

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
      {isLoading && (
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
          {pnlData &&
            traders &&
            traders.data?.map((traderData) => {
              return (
                <TraderItem
                  key={traderData.id}
                  traderData={traderData}
                  timeOption={filters.time}
                  onClickBacktest={onClickBacktest}
                  pnlData={pnlData}
                />
              )
            })}
        </Box>
      </Box>
      <Box display="none">
        <BacktestSimpleModal
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
  pnlData,
}: {
  traderData: ResponseTraderData
  onClickBacktest: (traderData: TraderData) => void
  timeOption: TimeFilterProps
  pnlData: PnlStatisticsResponse
}) {
  const { protocol, account, type, realisedPnl, realisedAvgRoi, totalWin, totalTrade } = traderData
  const traderPnlData = pnlData[account]

  return (
    <Box
      as={Link}
      to={generateTraderMultiExchangeRoute({
        protocol,
        address: account,
        params: {
          time: type,
        },
      })}
      sx={{
        display: 'block',
        color: 'inherit',
        width: '100%',
        height: '100%',
        bg: 'rgba(49, 56, 86, 0.2)',
        px: 3,
        py: 12,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(49, 56, 86, 0.3)',
        // backdropFilter: 'blur(5px)',
        transition: '0.3s',
        '&:hover': {
          bg: 'rgba(49, 56, 86, 0.3)',
          transform: 'scale(1.01)',
        },
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between', '& *': { fontWeight: 600 } }}>
        <TraderAddress address={account} protocol={protocol} options={{ timeType: type, size: 32 }} />
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          <FavoriteButton
            address={account}
            protocol={protocol}
            size={20}
            sx={{
              position: 'relative',
            }}
          />
          <IconBox
            role="button"
            as={Link}
            to={generateTraderMultiExchangeRoute({
              protocol,
              address: account,
              params: {
                time: type,
              },
            })}
            icon={<CaretRight size={20} />}
            color="neutral3"
            sx={{ '&:hover': { color: 'neutral2' } }}
          />
        </Flex>
      </Flex>
      <Box my={12} sx={{ height: 60 }}>
        <LineChartTraderPnl
          data={parsePnLStatsData(traderPnlData)}
          isCumulativeData={false}
          dayCount={timeOption.value}
          isSimple
          hasBalanceText={false}
          height={30}
        />
      </Box>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1.3fr 1fr' }}>
        <Box>
          <Type.Caption display="block">
            <Trans>{TIME_TRANSLATION[type]} PnL ($)</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }} className="trader-pnl">
            <SignedText value={realisedPnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>{TIME_TRANSLATION[type]} Avg ROI (%)</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            <SignedText value={realisedAvgRoi} minDigit={2} maxDigit={2} fontInherit suffix="%" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>Win/Trades</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            {totalWin}/{totalTrade}
          </Type.Caption>
        </Box>
      </Box>
      <Flex mt={12} sx={{ alignItems: 'center', gap: 2 }}>
        <CopyTraderButton
          source={EventSource.HOME}
          account={account}
          protocol={protocol}
          buttonText={<Trans>Copy</Trans>}
          buttonSx={{
            width: 100,
          }}
          modalStyles={{ backdropFilter: 'none', overlayBackground: 'rgba(0, 0, 0, 0.85)' }}
        />
        <BacktestButton onClick={() => onClickBacktest(traderData)} />
      </Flex>
    </Box>
  )
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
