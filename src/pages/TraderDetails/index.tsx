import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

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
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoDataFound from 'components/@ui/NoDataFound'
import NotFound from 'components/@ui/NotFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { PositionData, ResponseTraderExchangeStatistic } from 'entities/trader.d'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useTraderBalanceStore from 'hooks/store/useTraderBalanceStore'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { addressShorten } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import ChartTrader from './ChartTrader'
import TraderChartPositions from './ChartTrader/ChartPositions'
import GeneralStats from './GeneralStats'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import useHandleLayout from './Layouts/useHandleLayout'
import ProtocolStats from './ProtocolStats'
import TraderActionButtons from './TraderActionButtons'
import TraderInfo from './TraderInfo'
import TraderRanking from './TraderRanking'
import TraderStats from './TraderStats'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}

export default function TraderDetailsPage() {
  const { address: _address, protocol: _protocol } = useParams<{ address: string; protocol: ProtocolEnum }>()
  const address = isAddress(_address)

  const { data: exchangeStats, isLoading } = useQuery(
    [QUERY_KEYS.GET_TRADER_EXCHANGE_STATISTIC, address],
    () => getTraderExchangeStatistic({ account: address }),
    { keepPreviousData: true, retry: 0 }
  )

  const orderedStats = getOrderedExchangeStats(exchangeStats)

  let protocol: ProtocolEnum | null = null
  if (_protocol) {
    protocol = _protocol.split('-')[0].toUpperCase() as ProtocolEnum
  } else {
    protocol = orderedStats?.[0]?.protocol
  }

  const setTraderToGetBalance = useTraderBalanceStore((s) => s.setTraderToGetBalance)
  useEffect(() => {
    setTraderToGetBalance([{ address, protocol: protocol! }])
  }, [address, protocol])
  if (isLoading)
    return (
      <Box p={4}>
        <Loading />
      </Box>
    )

  if (!isLoading && !orderedStats?.length && !protocol) return <NotFound message="" title="Trader have no statistic" />

  return <TraderDetailsComponent address={address} protocol={protocol} exchangeStats={exchangeStats} />
}

function getOrderedExchangeStats(stats: ResponseTraderExchangeStatistic) {
  if (!Object.keys(stats || {})?.length) return []
  const orderedStats = stats ? Object.values(stats) : []
  orderedStats.sort((x, y) => (y?.lastTradeAtTs ?? 0) - (x?.lastTradeAtTs ?? 0))
  return orderedStats
}

export function TraderDetailsComponent({
  address,
  protocol,
  exchangeStats,
}: {
  address: string
  protocol: ProtocolEnum
  exchangeStats: ResponseTraderExchangeStatistic
}) {
  const { timeFramesAllowed, isAllowedProtocol } = useTraderProfilePermission({ protocol })
  const { timeFilterOptions } = useGetTimeFilterOptions()

  const { pnlWithFeeEnabled } = useUserPreferencesStore()

  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, address, protocol, isAllowedProtocol, pnlWithFeeEnabled],
    () =>
      getTraderStatisticApi({
        protocol,
        account: address,
        pnlWithFeeEnabled,
      }),
    {
      enabled: !!address && isAllowedProtocol,
      retry: 0,
      select: (data) => timeFilterOptions.map((option) => data[option.id]).reverse(),
    }
  )

  const { currentOption: timeOption, changeCurrentOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: timeFilterOptions,
    defaultOption: TimeFilterByEnum.ALL_TIME.toString(),
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

  const { sm, lg, xl } = useResponsive()

  const Layout = useMemo(() => {
    let layout = MobileLayout
    if (xl) {
      layout = DesktopLayout
    } else if (lg) {
      layout = TabletLayout
    }
    return layout
  }, [lg, xl])

  const {
    openingPositionFullExpanded,
    handleOpeningPositionsExpand,
    positionFullExpanded,
    handlePositionsExpand,
    chartFullExpanded,
    handleChartFullExpand,
  } = useHandleLayout()
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  if (!protocolOptionsMapping[protocol]) {
    return <NotFound title="Protocol not support" message="" />
  }

  if (!address) return <NotFound title="No statistics found for this trader" message="" />

  return (
    <>
      <CustomPageTitle title={`Trader ${addressShorten(address)} on ${protocolOptionsMapping[protocol]?.text}`} />

      <Layout
        address={address}
        protocol={protocol}
        protocolStats={
          <ProtocolStats address={address} protocol={protocol} page="details" exchangeStats={exchangeStats} />
        }
        traderInfo={
          <Box>
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3,
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
              />
            </Flex>
          </Box>
        }
        traderChartPnl={
          <ChartTrader
            protocol={protocol}
            account={address}
            timeOption={timeOption}
            // onChangeTime={setTimeOption}
          />
        }
        traderStatsSummary={<GeneralStats traderData={currentTraderData} account={address} protocol={protocol} />}
        traderStats={
          isLoadingTraderData ? (
            <Loading />
          ) : (
            <>
              {!currentTraderData && (!traderData || traderData?.every((data) => !data)) ? (
                <NoDataFound message="No statistic" />
              ) : (
                !!traderData && <TraderStats data={traderData} timeOption={timeOption} />
              )}
            </>
          )
        }
        traderRanking={<TraderRanking data={currentTraderData} timeOption={timeOption} onChangeTime={setTimeOption} />}
        traderChartPositions={
          <TraderChartPositions
            account={address}
            protocol={protocol}
            isExpanded={chartFullExpanded}
            handleExpand={handleChartFullExpand}
          />
        }
        heatmap={<div></div>}
        openingPositions={
          sm ? (
            protocol === ProtocolEnum.HYPERLIQUID ? (
              <HLTraderOpeningPositionsTableView
                address={address}
                protocol={protocol}
                isExpanded={openingPositionFullExpanded}
                toggleExpand={handleOpeningPositionsExpand}
              />
            ) : (
              <TraderOpeningPositionsTableView
                address={address}
                protocol={protocol}
                isExpanded={openingPositionFullExpanded}
                toggleExpand={handleOpeningPositionsExpand}
              />
            )
          ) : protocol === ProtocolEnum.HYPERLIQUID ? (
            <HLTraderOpeningPositionsListView address={address} protocol={protocol} />
          ) : (
            <TraderOpeningPositionsListView address={address} protocol={protocol} />
          )
        }
        closedPositions={
          sm ? (
            <TraderHistoryPositionsTableView
              address={address}
              protocol={protocol}
              isExpanded={positionFullExpanded}
              toggleExpand={handlePositionsExpand}
            />
          ) : (
            <TraderHistoryPositionsListView
              backgroundColor="neutral7"
              address={address}
              protocol={protocol}
              isExpanded={positionFullExpanded}
              toggleExpand={handlePositionsExpand}
            />
          )
        }
        openingPositionFullExpanded={openingPositionFullExpanded}
        positionFullExpanded={positionFullExpanded}
        chartFullExpanded={chartFullExpanded}
      ></Layout>
    </>
  )
}
