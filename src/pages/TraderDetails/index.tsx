import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTraderExchangeStatistic, getTraderStatisticApi, getTraderTokensStatistic } from 'apis/traderApis'
import TraderHistoryPositions from 'components/@position/TraderHistoryPositions'
import TraderOpeningPositions from 'components/@position/TraderOpeningPositions'
import { fullHistoryColumns, historyColumns } from 'components/@position/configs/traderPositionRenderProps'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoDataFound from 'components/@ui/NoDataFound'
import NotFound from 'components/@ui/NotFound'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { PositionData, ResponseTraderExchangeStatistic } from 'entities/trader.d'
import { BotAlertProvider } from 'hooks/features/useBotAlertProvider'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import usePageChange from 'hooks/helpers/usePageChange'
import { getNavProtocol, parseNavProtocol, useProtocolStore } from 'hooks/store/useProtocols'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import Loading from 'theme/Loading'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ALL_OPTION, TOKEN_TRADE_SUPPORT, getTokenOptions } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import ChartTrader from './ChartTrader'
import TraderChartPositions from './ChartTrader/ChartPositions'
import GeneralStats from './GeneralStats'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import useHandleLayout from './Layouts/useHandleLayout'
import ProtocolBetaWarning from './ProtocolBetaWarning'
import ProtocolStats from './ProtocolStats'
import TraderActionButtons from './TraderActionButtons'
import TraderInfo from './TraderInfo'
import TraderRanking from './TraderRanking'
import TraderStats from './TraderStats'
import useQueryPositions from './useQueryOptions'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}

export default function TraderDetails() {
  const { address: _address, protocol: _protocol } = useParams<{ address: string; protocol: ProtocolEnum }>()
  const { setNavProtocol } = useProtocolStore()
  const address = isAddress(_address)

  const { data: exchangeStats, isLoading } = useQuery([QUERY_KEYS.GET_TRADER_EXCHANGE_STATISTIC, address], () =>
    getTraderExchangeStatistic({ account: address })
  )

  const orderedStats = getOrderedExchangeStats(exchangeStats)

  let protocol: ProtocolEnum | null = null
  if (_protocol) {
    protocol = _protocol.split('-')[0].toUpperCase() as ProtocolEnum
  } else {
    protocol = orderedStats?.[0]?.protocol
  }

  useEffect(() => {
    if (protocol && address) {
      setNavProtocol((prev) => {
        const { distinction } = parseNavProtocol(prev)
        if (distinction === address || !protocol || !address) return prev
        return getNavProtocol({ protocol, distinction: address })
      })
    }
  }, [])

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

  const { data: tokensStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, address],
    () => getTraderTokensStatistic({ protocol, account: address }),
    { enabled: !!address && !!protocol }
  )

  const tokenOptions = useMemo(() => {
    if (tokensStatistic?.data?.length) {
      const statisticSymbols = tokensStatistic.data.map((e) => TOKEN_TRADE_SUPPORT[protocol][e.indexToken]?.symbol)
      return [ALL_OPTION, ...getTokenOptions({ protocol }).filter((option) => statisticSymbols.includes(option.label))]
    }
    return [ALL_OPTION]
  }, [protocol, tokensStatistic])

  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: URL_PARAM_KEYS.CURRENCY,
    options: tokenOptions,
    callback: () => {
      changeCurrentPage(1)
    },
  })
  const { currentOption: timeOption, changeCurrentOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: timeFilterOptions,
    defaultOption: TimeFilterByEnum.ALL_TIME.toString(),
  })
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'closeBlockTime',
    sortType: SortTypeEnum.DESC,
  })
  const [currentSortOpening, setCurrentSortOpening] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'openBlockTime',
    sortType: SortTypeEnum.DESC,
  })

  const setTimeOption = (option: TimeFilterProps) => {
    changeCurrentOption(option)
  }
  const resetSort = () =>
    setCurrentSort({
      sortBy: 'closeBlockTime',
      sortType: SortTypeEnum.DESC,
    })
  const resetSortOpening = () =>
    setCurrentSort({
      sortBy: 'openBlockTime',
      sortType: SortTypeEnum.DESC,
    })
  const changeCurrentSort = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }

  const changeCurrentSortOpening = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSortOpening(sort)
  }

  const {
    openingPositions,
    isLoadingOpening,
    closedPositions,
    isLoadingClosed,
    handleFetchClosedPositions,
    hasNextClosedPositions,
  } = useQueryPositions({
    address,
    protocol,
    currencyOption,
    currentSort,
    currentSortOpening,
    currentPage,
    changeCurrentPage,
  })

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

  const { lg, xl } = useResponsive()

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
        protocolStats={
          <ProtocolStats address={address} protocol={protocol} page="details" exchangeStats={exchangeStats} />
        }
        traderInfo={
          <BotAlertProvider>
            <ProtocolBetaWarning protocol={protocol} />
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
          </BotAlertProvider>
        }
        traderChartPnl={
          <ChartTrader
            protocol={protocol}
            account={address}
            timeOption={timeOption}
            // onChangeTime={setTimeOption}
          />
        }
        traderStatsSummary={!!currentTraderData ? <GeneralStats traderData={currentTraderData} /> : <></>}
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
          <TraderOpeningPositions
            data={openingPositions}
            isLoading={isLoadingOpening}
            protocol={protocol}
            currentSort={xl && openingPositionFullExpanded ? currentSortOpening : undefined}
            changeCurrentSort={xl && openingPositionFullExpanded ? changeCurrentSortOpening : undefined}
            isExpanded={openingPositionFullExpanded}
            toggleExpand={() => {
              resetSortOpening()
              handleOpeningPositionsExpand()
            }}
          />
        }
        closedPositions={
          <TraderHistoryPositions
            tokenOptions={tokenOptions}
            data={closedPositions?.data}
            dataMeta={closedPositions?.meta}
            isLoading={isLoadingClosed}
            currencyOption={currencyOption}
            changeCurrency={changeCurrency}
            fetchNextPage={handleFetchClosedPositions}
            hasNextPage={hasNextClosedPositions}
            tableSettings={xl && positionFullExpanded ? fullHistoryColumns : historyColumns}
            currentSort={xl && positionFullExpanded ? currentSort : undefined}
            changeCurrentSort={xl && positionFullExpanded ? changeCurrentSort : undefined}
            isExpanded={positionFullExpanded}
            toggleExpand={() => {
              resetSort()
              handlePositionsExpand()
            }}
          />
        }
        openingPositionFullExpanded={openingPositionFullExpanded}
        positionFullExpanded={positionFullExpanded}
        chartFullExpanded={chartFullExpanded}
      ></Layout>
    </>
  )
}
