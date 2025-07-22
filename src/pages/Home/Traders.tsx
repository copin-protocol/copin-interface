import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { SEARCH_HOME_TRADERS_FUNCTION_NAME, SEARCH_HOME_TRADERS_STATISTIC_QUERY } from 'graphql/query'
import { MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ApiListResponse } from 'apis/api'
import { normalizePositionPayload } from 'apis/positionApis'
import { getPnlStatisticsApi } from 'apis/traderApis'
import tokenNotFound from 'assets/images/token-not-found.png'
import BacktestSimpleModal from 'components/@backtest/BacktestSimpleModal'
import LineChartTraderPnl from 'components/@charts/LineChartPnL'
import { parsePnLStatsData } from 'components/@charts/LineChartPnL/helpers'
import CopyTraderButton from 'components/@copyTrade/CopyTraderButton'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import ToastBody from 'components/@ui/ToastBody'
import TraderAddress from 'components/@ui/TraderAddress'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { GlobalProtocolFilter, GlobalProtocolFilterProps } from 'components/@widgets/ProtocolFilter'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import { Account, PnlStatisticsResponse, ResponseTraderData, StatisticData, TraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'
import { hideField } from 'utils/config/hideFileld'
import { ELEMENT_IDS, QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { SUBSCRIPTION_PLAN_TRANSLATION, TIME_TRANSLATION } from 'utils/config/translations'
import { formatDate, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'
import { pageToOffset } from 'utils/helpers/transform'
import { logEventBacktest, logEventHomeFilter } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import SortDropdown from './SortDropdown'
import TimeFilter from './TimeDropdown'

const PADDING_X = 12

export default function Traders() {
  const { searchParams, setSearchParamsOnly } = useSearchParams()
  const { timeFilterOptions, defaultTimeOption } = useGetTimeFilterOptions()
  const { isAuthenticated, loading } = useAuthContext()

  const filters: FiltersState = useMemo(() => {
    const sortBy = (searchParams[URL_PARAM_KEYS.HOME_SORT_BY] as unknown as keyof TraderData | undefined) ?? 'pnl'
    const time =
      (searchParams[URL_PARAM_KEYS.HOME_TIME] as unknown as TimeFilterByEnum | undefined) ?? TimeFilterByEnum.S30_DAY
    const timeOption = time
      ? timeFilterOptions.find((option) => option.id === time) ?? defaultTimeOption
      : defaultTimeOption

    return {
      sortBy,
      time: timeOption,
    }
  }, [defaultTimeOption, searchParams, timeFilterOptions])

  const { userPermission, pagePermission } = useExplorerPermission()
  let noDataMessage: ReactNode | undefined = undefined
  {
    const hasFilterTimeFromHigherPlan = loading ? false : !userPermission?.timeFramesAllowed?.includes(filters.time.id)
    let requiredPlan: SubscriptionPlanEnum | undefined = undefined
    if (hasFilterTimeFromHigherPlan) {
      requiredPlan = getRequiredPlan({
        conditionFn: (plan) => {
          return !!pagePermission?.[plan]?.timeFramesAllowed?.includes(filters.time.id)
        },
      })
    }

    if (requiredPlan) {
      const title = (
        <Trans>This URL contains filters available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plan</Trans>
      )
      const description = <Trans>Please upgrade to explore traders with advanced filters</Trans>
      noDataMessage = (
        <Box pt={4}>
          <PlanUpgradePrompt
            title={title}
            description={description}
            requiredPlan={requiredPlan}
            useLockIcon
            showTitleIcon
            cancelText={<Trans>Reset Filters</Trans>}
            onCancel={() => setSearchParamsOnly({})}
          />
        </Box>
      )
    }
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
          <Filters filters={filters} />
        </Flex>
      </Box>

      <Box flex="1 0 0">{noDataMessage ? <Box pt={3}>{noDataMessage}</Box> : <ListTraders filters={filters} />}</Box>
    </Flex>
  )
}

type FiltersState = {
  sortBy: keyof TraderData
  time: TimeFilterProps
}

function Filters({ filters }: { filters: FiltersState }) {
  const { myProfile } = useMyProfile()
  const { setSearchParams, searchParams } = useSearchParams()

  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)

  const prevPnlSettingsRef = useRef({
    pnlWithFeeEnabled,
  })

  useEffect(() => {
    const currentPage = Number(searchParams[URL_PARAM_KEYS.HOME_PAGE] || '1')
    const sortByParam = (searchParams[URL_PARAM_KEYS.HOME_SORT_BY] as keyof TraderData | undefined) ?? 'pnl'
    const prevSettings = prevPnlSettingsRef.current
    const affectedSorts = ['pnl', 'realisedPnl', 'avgRoi', 'realisedAvgRoi']

    if (
      prevSettings.pnlWithFeeEnabled !== pnlWithFeeEnabled &&
      !isNaN(currentPage) &&
      currentPage > 1 &&
      affectedSorts.includes(sortByParam as string)
    ) {
      setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: '1' })
    }

    prevPnlSettingsRef.current = {
      pnlWithFeeEnabled,
    }
  }, [pnlWithFeeEnabled, searchParams, setSearchParams])

  const handleChangeSort = (sortBy: keyof TraderData) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_SORT_BY]: sortBy as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: sortBy, username: myProfile?.username })
  }

  const handleChangeTime = (option: TimeFilterProps) => {
    setSearchParams({ [URL_PARAM_KEYS.HOME_TIME]: option.id as unknown as string, [URL_PARAM_KEYS.HOME_PAGE]: '1' })

    logEventHomeFilter({ filter: option.id, username: myProfile?.username })
  }

  const { sm } = useResponsive()

  const protocolFilterProps: GlobalProtocolFilterProps = useMemo(
    () => ({
      placement: sm ? 'bottom' : 'bottomRight',
      menuSx: { width: ['312px', '400px', '50vw', '50vw'] },
    }),
    [sm]
  )

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
        <GlobalProtocolFilter {...protocolFilterProps} />
      </Flex>
    </Flex>
  )
}

const LIMIT = 12
function ListTraders({ filters }: { filters: FiltersState }) {
  const { md } = useResponsive()
  const { profile, loading, isAuthenticated } = useAuthContext()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { allowedSelectProtocols } = useProtocolPermission()
  const { searchParams, setSearchParams } = useSearchParams()
  const currentPageParam = Number(searchParams[URL_PARAM_KEYS.HOME_PAGE])
  const currentPage = !isNaN(currentPageParam) ? currentPageParam : 1
  const changeCurrentPage = (page: number) => setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: page.toString() })
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [selectedTrader, setSelectedTrader] = useState<{ account: string; protocol: ProtocolEnum } | null>(null)

  // METHODS
  const pnlWithFeeEnabled = useUserPreferencesStore()
  const queryVariables = useMemo(() => {
    const index = 'copin.position_statistics'

    const { sortBy } = normalizePositionPayload(filters, pnlWithFeeEnabled)

    const query = [
      // ...graphqlBaseFilters,
      { field: 'protocol', in: selectedProtocols ?? allowedSelectProtocols },
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
  }, [filters, selectedProtocols, currentPage, allowedSelectProtocols, pnlWithFeeEnabled])

  const onClickBacktest = (trader: TraderData) => {
    setSelectedTrader({ account: trader.account, protocol: trader.protocol })

    logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE, username: profile?.username })
  }

  const getPnlStatisticsPayload = (traderData: any): StatisticData => {
    // NOTE: If time is 1 day, we will get 7 days data
    const timeFrame = [TimeFilterByEnum.S1_DAY, TimeFilterByEnum.LAST_24H].includes(filters.time.id)
      ? TimeFilterByEnum.S7_DAY
      : filters.time.id

    const accounts: Account[] = traderData?.[SEARCH_HOME_TRADERS_FUNCTION_NAME]?.data?.map((trader: TraderData) => ({
      account: trader.account,
      protocol: trader.protocol,
    }))

    const payload: StatisticData = {
      accounts,
      statisticType: timeFrame,
    }

    return payload
  }

  // FETCH DATA
  const {
    data: traderData,
    loading: isLoading,
    previousData,
  } = useApolloQuery<{ [SEARCH_HOME_TRADERS_FUNCTION_NAME]: ApiListResponse<ResponseTraderData> } | null>(
    SEARCH_HOME_TRADERS_STATISTIC_QUERY,
    {
      skip: selectedProtocols == null || loading,
      variables: queryVariables,
      onError: (error) => {
        toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
      },
    }
  )

  const { data: pnlData, isLoading: loadingPnl } = useQuery(
    [QUERY_KEYS.GET_PNL_STATISTICS, traderData],
    () => getPnlStatisticsApi(getPnlStatisticsPayload(traderData)),
    {
      enabled: !!traderData,
    }
  )

  const traders = traderData?.[SEARCH_HOME_TRADERS_FUNCTION_NAME] || previousData?.[SEARCH_HOME_TRADERS_FUNCTION_NAME]

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

  if (selectedProtocols == null) return null

  if (selectedProtocols.length == 0) {
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
          {traders &&
            traders.data?.map((traderData) => {
              const normalizedData = hideField(traderData)
              return (
                <TraderItem
                  key={traderData.id}
                  traderData={normalizedData}
                  timeOption={filters.time}
                  onClickBacktest={onClickBacktest}
                  pnlData={pnlData}
                  loadingPnl={loadingPnl}
                />
              )
            })}
        </Box>
      </Box>
      <Box display="none">
        <BacktestSimpleModal
          key={`${selectedTrader?.account}${selectedTrader?.protocol}`}
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
  loadingPnl,
}: {
  traderData: ResponseTraderData
  onClickBacktest: (traderData: TraderData) => void
  timeOption: TimeFilterProps
  pnlData: PnlStatisticsResponse | undefined
  loadingPnl: boolean | undefined
}) {
  const { protocol, account, type, realisedPnl, realisedAvgRoi, winRate } = traderData
  const key = `${account}-${protocol}`
  const traderPnlData = pnlData?.[key]

  const defaultDayCount = 7 // Default 7 days
  // NOTE: If time is 1 day, get 7 days count
  const dayCount = [TimeFilterByEnum.LAST_24H, TimeFilterByEnum.S1_DAY].includes(timeOption.id)
    ? TIME_FILTER_OPTIONS.find((time) => time.id === TimeFilterByEnum.S7_DAY)?.value || defaultDayCount
    : timeOption.value

  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const pnl = pnlWithFeeEnabled ? traderData.pnl : traderData.realisedPnl
  const avgRoi = pnlWithFeeEnabled ? traderData.avgRoi : traderData.realisedAvgRoi

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
        {!loadingPnl && traderPnlData ? (
          <LineChartTraderPnl
            data={parsePnLStatsData(traderPnlData)}
            isCumulativeData={false}
            dayCount={dayCount}
            isSimple
            hasBalanceText={false}
            height={30}
            address={account}
            protocol={protocol}
          />
        ) : null}
      </Box>
      {/* <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1.3fr 1fr' }}> */}
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
        <Box>
          <Type.Caption display="block">
            <Trans>
              {TIME_TRANSLATION[type]} <PnlTitle type="lower" color="neutral1" />
            </Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }} className="trader-pnl">
            <SignedText value={pnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>{TIME_TRANSLATION[type]} Avg ROI</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>
            <SignedText value={avgRoi} minDigit={2} maxDigit={2} fontInherit suffix="%" />
          </Type.Caption>
        </Box>
        <Box>
          <Type.Caption display="block">
            <Trans>Win Rate</Trans>
          </Type.Caption>
          <Type.Caption sx={{ fontWeight: 600 }}>{formatNumber(winRate, 0, 0)}%</Type.Caption>
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
      <Trans>Quick Backtest</Trans>
    </Button>
  )
}
