import { Trans } from '@lingui/macro'
import { useResponsive, useSize } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { createGlobalStyle } from 'styled-components/macro'

import { getTraderExchangeStatistic, getTraderStatisticApi } from 'apis/traderApis'
import HLTraderOpeningPositionsTableView, {
  HLTraderOpeningPositionsListView,
} from 'components/@position/HLTraderOpeningPositions'
import TraderHistoryPositionsTableView, {
  TraderHistoryPositionsListView,
} from 'components/@position/TraderHistoryPositions'
import TraderOpeningPositionsTableView, {
  TraderOpeningPositionsListView,
} from 'components/@position/TraderOpeningPositions'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import NotFound from 'components/@ui/NotFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { ResponseTraderExchangeStatistic } from 'entities/trader.d'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { HyperliquidTraderProvider } from 'hooks/features/trader/useHyperliquidTraderContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import ChartTrader from 'pages/TraderDetails/ChartTrader'
import GeneralStats from 'pages/TraderDetails/GeneralStats'
import PositionMobileView from 'pages/TraderDetails/Layouts/PositionMobileView'
import TradeLabelsFrame from 'pages/TraderDetails/TradeLabelsFrame'
import TraderActionButtons, { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
import TraderInfo from 'pages/TraderDetails/TraderInfo'
import TraderRanking from 'pages/TraderDetails/TraderRanking'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { EventCategory } from 'utils/tracking/types'

import ProtocolPermissionContainer from './ProtocolPermissionContainer'

const GlobalStyle = createGlobalStyle`
  .rc-dropdown {
    z-index: ${Z_INDEX.TOASTIFY};
  }
`
const MobileGlobalStyle = createGlobalStyle`
  .chart-positions__wrapper .currency_option .select__menu {
    max-height: 150px;
  }
`

export default function TraderQuickView({
  address,
  protocol,
  type,
  disabledActions,
  disabledLinkAccount,
  eventCategory,
}: {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  disabledActions?: DisabledActionType[]
  disabledLinkAccount?: boolean
  eventCategory?: EventCategory
}) {
  const { data: exchangeStats, isLoading } = useQuery(
    [QUERY_KEYS.GET_TRADER_EXCHANGE_STATISTIC, address],
    () => getTraderExchangeStatistic({ account: address }),
    { retry: 0, keepPreviousData: true }
  )
  const orderedStats = getOrderedExchangeStats(exchangeStats)

  if (isLoading)
    return (
      <Box p={4}>
        <Loading />
      </Box>
    )

  if (!isLoading && !orderedStats?.length && !protocol) return <NotFound message="" title="Trader have no statistic" />

  return (
    <>
      {address && <GlobalStyle />}
      {protocol === ProtocolEnum.HYPERLIQUID ? (
        <HyperliquidTraderProvider address={address} protocol={protocol}>
          <TraderDetailsComponent
            address={address}
            protocol={protocol}
            type={type}
            disabledActions={disabledActions}
            disabledLinkAccount={disabledLinkAccount}
          />
        </HyperliquidTraderProvider>
      ) : (
        <TraderDetailsComponent
          address={address}
          protocol={protocol}
          type={type}
          disabledActions={disabledActions}
          disabledLinkAccount={disabledLinkAccount}
        />
      )}
    </>
  )
}

function getOrderedExchangeStats(stats: ResponseTraderExchangeStatistic) {
  if (!Object.keys(stats || {})?.length) return []
  const orderedStats = stats ? Object.values(stats) : []
  orderedStats.sort((x, y) => (y?.lastTradeAtTs ?? 0) - (x?.lastTradeAtTs ?? 0))
  return orderedStats
}

function TraderDetailsComponent({
  address,
  protocol,
  type,
  disabledActions,
  eventCategory,
  disabledLinkAccount,
}: {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  disabledActions?: DisabledActionType[]
  disabledLinkAccount?: boolean
  eventCategory?: EventCategory
}) {
  const { sm, md, lg } = useResponsive()
  const size = useSize(document.body)
  const { timeFilterOptions } = useGetTimeFilterOptions()
  const { timeFramesAllowed, isEnablePosition, requiredPlanToViewPosition, isAllowedProtocol } =
    useTraderProfilePermission({ protocol })

  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, address, protocol, isAllowedProtocol],
    () => getTraderStatisticApi({ protocol, account: address }),
    {
      enabled: !!address && isAllowedProtocol,
      retry: 0,
      select: (data) =>
        timeFilterOptions
          .map((option) => {
            return data[option.id]
          })
          .reverse(),
    }
  )

  const { currentOption: timeOption, changeCurrentOption } = useOptionChange({
    optionName: 'temp',
    options: timeFilterOptions,
    defaultOption: type ? type.toString() : TimeFilterByEnum.ALL_TIME.toString(),
    optionNameToBeDelete: ['temp'],
    optionsAllowed: timeFramesAllowed,
  })

  const setTimeOption = (option: TimeFilterProps) => {
    changeCurrentOption(option)
  }
  const currentTraderData = useMemo(() => {
    return traderData?.find((item) => (item?.type as string) === (timeOption.id as unknown as string))
  }, [timeOption.id, traderData])

  const refetchQueries = useRefetchQueries()
  const [, setForceReload] = useState(1)
  const onForceReload = () => {
    refetchQueries([QUERY_KEYS.USE_GET_ALL_COPY_TRADES])
    setForceReload((prev) => prev + 1)
  }

  const { isLastViewed, addTraderLastViewed } = useTraderLastViewed(protocol, address)
  useEffect(() => {
    if (address && protocol && !isLastViewed) {
      addTraderLastViewed(protocol, address)
    }
  }, [address, protocol, isLastViewed])

  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  if (!protocolOptionsMapping[protocol]) {
    return <NotFound title="Protocol not support" message="" />
  }

  if (!address) return <NotFound title="No statistics found for this trader" message="" />

  return (
    <Flex
      flex={1}
      sx={{
        height: '100%',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      {!sm && <MobileGlobalStyle />}
      <Box
        width="100%"
        sx={{
          pt: 1,
          ml: -2,
          pr: 4,
          zIndex: 10,
        }}
      >
        {/*<ProtocolBetaWarning protocol={protocol} />*/}
        <Flex
          sx={{
            width: '100%',
            // backgroundColor: 'neutral7',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <TraderInfo
            address={address}
            protocol={protocol}
            timeOption={timeOption}
            traderStats={traderData}
            isLink={!disabledLinkAccount}
            hasLabels={false}
          />
          <TraderActionButtons
            traderData={currentTraderData}
            timeOption={timeOption}
            onChangeTime={setTimeOption}
            account={address}
            protocol={protocol}
            onCopyActionSuccess={onForceReload}
            eventCategory={eventCategory}
            disabledActions={disabledActions}
            isDrawer
          />
        </Flex>
      </Box>
      <ProtocolPermissionContainer protocol={protocol}>
        <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
          <Box
            height={[330, 310, 300]}
            alignItems="center"
            sx={{
              m: [0, 2],
              gap: 2,
              backgroundColor: 'neutral5',
              borderRadius: '1px',
              border: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Box
              alignItems="center"
              sx={{
                borderBottom: 'small',
                display: ['block', 'block', 'block', 'flex'],
                alignItems: 'center',
                borderBottomColor: 'neutral4',
              }}
            >
              <Box sx={{ overflow: ['auto', 'auto', 'unset'], width: '100%' }}>
                <TradeLabelsFrame
                  traderStats={traderData}
                  showedItems={lg ? 3 : undefined}
                  sx={{
                    width: ['max-content', 'max-content', '100%'],
                    my: [0, 0, 2],
                    px: 2,
                    py: [2, 2, 0],
                    justifyContent: ['center', 'start'],
                  }}
                />
              </Box>

              <GeneralStats
                traderData={currentTraderData}
                account={address}
                protocol={protocol}
                sx={{ height: [60, 25], border: 'none', py: lg ? 3 : 0 }}
                isDrawer
              />
            </Box>

            <Flex alignItems="center">
              {lg && (
                <Flex height="100%" alignItems="center" sx={{ gap: 2 }}>
                  <Box width="380px">
                    <TraderRanking
                      data={currentTraderData}
                      timeOption={timeOption}
                      onChangeTime={setTimeOption}
                      isDrawer
                    />
                  </Box>
                  <Box height="90%" width="1px" backgroundColor="neutral4" />
                </Flex>
              )}
              <Box flex={1}>
                <Flex alignItems="center" justifyContent={['start', 'start', 'start', 'end']}>
                  <Flex
                    sx={{
                      flexShrink: 0,
                      pr: [0, 0, 0, 2],
                      pl: [2, 2, 2, 0],
                      alignItems: 'center',
                      height: 40,
                    }}
                  >
                    <TimeDropdown
                      timeOption={timeOption}
                      onChangeTime={setTimeOption}
                      menuSx={{ transform: lg ? 'translateX(-12px)' : 'translateX(5px)' }}
                    />
                  </Flex>
                </Flex>
                <Box height={200}>
                  <ChartTrader
                    protocol={protocol}
                    account={address}
                    timeOption={timeOption}
                    onChangeTime={setTimeOption}
                    isShowTimeFilter={false}
                    chartTraderSx={{ pt: 0 }}
                  />
                </Box>
              </Box>
            </Flex>
          </Box>

          <Flex flex={1} flexDirection="column" sx={{ position: 'relative' }}>
            <BlurMask isBlur={!isEnablePosition}>
              <PlanUpgradePrompt
                requiredPlan={requiredPlanToViewPosition}
                noLoginTitle={<Trans>Login to view more information</Trans>}
                noLoginDescription={<Trans>View positions and more trader insights.</Trans>}
                showTitleIcon
                showNoLoginTitleIcon
                requiredLogin
              />
            </BlurMask>
            {lg && (!size || size?.height > 800) ? (
              <Flex flexDirection="column" height="100%">
                <Box height={200}>
                  {protocol === ProtocolEnum.HYPERLIQUID ? (
                    <HLTraderOpeningPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
                  ) : (
                    <TraderOpeningPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
                  )}
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    flex: 1,
                    '& .currency_option .select__menu': { transform: 'translateX(-30px)' },
                  }}
                >
                  <TraderHistoryPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
                </Box>
              </Flex>
            ) : (
              <Flex sx={{ flex: 1 }}>
                <PositionMobileView
                  isDrawer
                  openingPositions={
                    protocol === ProtocolEnum.HYPERLIQUID ? (
                      <HLTraderOpeningPositionsListView address={address} protocol={protocol} isDrawer />
                    ) : (
                      <TraderOpeningPositionsListView address={address} protocol={protocol} isDrawer />
                    )
                  }
                  historyPositions={
                    <TraderHistoryPositionsListView
                      address={address}
                      protocol={protocol}
                      isDrawer
                      backgroundColor="black"
                      isExpanded
                    />
                  }
                  protocol={protocol}
                  address={address}
                />
              </Flex>
            )}
          </Flex>
          {/*<Box sx={{ backgroundColor: 'neutral7' }}>*/}
          {/*  <TraderOpeningPositions address={address} protocol={protocol} isDrawer isExpanded />*/}
          {/*</Box>*/}
          {/*<Flex*/}
          {/*  flex={1}*/}
          {/*  flexDirection="column"*/}
          {/*  sx={{ position: 'relative', backgroundColor: 'neutral7', minHeight: 400 }}*/}
          {/*>*/}
          {/*  {sm ? (*/}
          {/*    <TraderHistoryPositions address={address} protocol={protocol} isDrawer isExpanded />*/}
          {/*  ) : (*/}
          {/*    <TraderHistoryPositionsListView*/}
          {/*      address={address}*/}
          {/*      protocol={protocol}*/}
          {/*      backgroundColor="neutral7"*/}
          {/*      isDrawer*/}
          {/*      isExpanded*/}
          {/*      hasTitle*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</Flex>*/}
        </Flex>
      </ProtocolPermissionContainer>
    </Flex>
  )
}
