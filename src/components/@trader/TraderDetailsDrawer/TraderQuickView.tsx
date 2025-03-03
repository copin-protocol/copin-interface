import { useResponsive } from 'ahooks'
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
import NotFound from 'components/@ui/NotFound'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { ResponseTraderExchangeStatistic } from 'entities/trader.d'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import ChartTrader from 'pages/TraderDetails/ChartTrader'
import GeneralStats from 'pages/TraderDetails/GeneralStats'
import PositionMobileView from 'pages/TraderDetails/Layouts/PositionMobileView'
import TraderActionButtons, { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
import TraderInfo from 'pages/TraderDetails/TraderInfo'
import TraderRanking from 'pages/TraderDetails/TraderRanking'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { EventCategory } from 'utils/tracking/types'

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
  eventCategory,
}: {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  disabledActions?: DisabledActionType[]
  eventCategory?: EventCategory
}) {
  const { data: exchangeStats, isLoading } = useQuery([QUERY_KEYS.GET_TRADER_EXCHANGE_STATISTIC, address], () =>
    getTraderExchangeStatistic({ account: address })
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
      <TraderDetailsComponent address={address} protocol={protocol} type={type} disabledActions={disabledActions} />
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
}: {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  disabledActions?: DisabledActionType[]
  eventCategory?: EventCategory
}) {
  const { sm, lg } = useResponsive()
  const timeFilterOptions = TIME_FILTER_OPTIONS

  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, address, protocol],
    () => getTraderStatisticApi({ protocol, account: address }),
    {
      enabled: !!address,
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
          <TraderInfo address={address} protocol={protocol} timeOption={timeOption} traderStats={traderData} />
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
      <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
        <Flex
          height={250}
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
          {lg && (
            <Flex height="100%" alignItems="center" sx={{ gap: 2 }}>
              <Box width="380px">
                <TraderRanking data={currentTraderData} timeOption={timeOption} onChangeTime={setTimeOption} isDrawer />
              </Box>
              <Box height="90%" width="1px" backgroundColor="neutral4" />
            </Flex>
          )}
          <Box flex={1}>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex
                sx={{
                  flexShrink: 0,
                  pl: [2, 3],
                  alignItems: 'center',
                  height: [60, 60, 60, 40],
                  borderBottom: 'small',
                  borderBottomColor: 'neutral4',
                }}
              >
                <TimeDropdown
                  timeOption={timeOption}
                  onChangeTime={setTimeOption}
                  menuSx={{ transform: 'translateX(12px)' }}
                />
              </Flex>
              <GeneralStats traderData={currentTraderData} account={address} protocol={protocol} />
            </Flex>
            <Box height={190}>
              <ChartTrader
                protocol={protocol}
                account={address}
                timeOption={timeOption}
                // onChangeTime={setTimeOption}
              />
            </Box>
          </Box>
        </Flex>
        {lg ? (
          <Flex flex={1} flexDirection="column">
            <Box>
              {protocol === ProtocolEnum.HYPERLIQUID ? (
                <HLTraderOpeningPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
              ) : (
                <TraderOpeningPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
              )}
            </Box>
            <Box
              sx={{
                position: 'relative',
                minHeight: 400,
                '& .currency_option .select__menu': { transform: 'translateX(-30px)' },
              }}
            >
              <TraderHistoryPositionsTableView address={address} protocol={protocol} isDrawer isExpanded />
            </Box>
          </Flex>
        ) : (
          <Flex sx={{ flex: 1 }}>
            <PositionMobileView
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
    </Flex>
  )
}
