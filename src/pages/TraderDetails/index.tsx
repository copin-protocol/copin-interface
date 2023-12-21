import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTraderApi, getTraderStatisticApi } from 'apis/traderApis'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NotFound from 'components/@ui/NotFound'
import { TableSortProps } from 'components/@ui/Table/types'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import ChartPositions from 'components/Charts/ChartPositions'
import HistoryTable, { historyColumns } from 'components/Tables/HistoryTable'
import OpeningPositionTable from 'components/Tables/OpeningPositionTable'
import { PositionData } from 'entities/trader.d'
import { BotAlertProvider } from 'hooks/features/useBotAlertProvider'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import usePageChange from 'hooks/helpers/usePageChange'
import useTraderCopying from 'hooks/store/useTraderCopying'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { getTokenOptions } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import ChartTrader from './ChartTrader'
import GeneralStats from './GeneralStats'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
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
  const { isPremiumUser, checkIsPremium } = useIsPremiumAndAction()
  const timeFilterOptions = useMemo(
    () => (isPremiumUser ? TIME_FILTER_OPTIONS : TIME_FILTER_OPTIONS.filter((e) => e.id !== TimeFilterByEnum.ALL_TIME)),
    [isPremiumUser]
  )

  const { address, protocol } = useParams<{ address: string; protocol: ProtocolEnum }>()
  const _address = isAddress(address)
  const { isLastViewed, addTraderLastViewed } = useTraderLastViewed(protocol, _address)

  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, _address, protocol, isPremiumUser],
    () => getTraderStatisticApi({ protocol, account: _address }),
    {
      enabled: !!_address,
      retry: 0,
      select: (data) =>
        timeFilterOptions
          .map((option) => {
            return data[option.id]
          })
          .reverse(),
    }
  )

  const tokenOptions = useMemo(() => getTokenOptions({ protocol }), [protocol])
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
    defaultOption: timeFilterOptions[timeFilterOptions.length - 1].id as unknown as string,
  })
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'closeBlockTime',
    sortType: SortTypeEnum.DESC,
  })

  const setTimeOption = (option: TimeFilterProps) => {
    if (option.id === TimeFilterByEnum.ALL_TIME && !checkIsPremium()) return
    changeCurrentOption(option)
  }
  const resetSort = () =>
    setCurrentSort({
      sortBy: 'closeBlockTime',
      sortType: SortTypeEnum.DESC,
    })
  const changeCurrentSort = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }

  const {
    openingPositions,
    isLoadingOpening,
    closedPositions,
    isLoadingClosed,
    handleFetchClosedPositions,
    hasNextClosedPositions,
  } = useQueryPositions({ address: _address, protocol, currencyOption, currentSort, currentPage, changeCurrentPage })

  const currentTraderData = useMemo(() => {
    return traderData?.find((item) => (item?.type as string) === (timeOption.id as unknown as string)) // TODO: remove timeTilter enum
  }, [timeOption.id, traderData])

  const refetchQueries = useRefetchQueries()
  const [, setForceReload] = useState(1)
  const { saveTraderCopying } = useTraderCopying()
  const onForceReload = () => {
    refetchQueries([QUERY_KEYS.USE_GET_ALL_COPY_TRADES])
    setForceReload((prev) => prev + 1)
    if (currentTraderData) {
      saveTraderCopying(currentTraderData.account)
    }
  }

  useEffect(() => {
    if (_address && protocol && !isLastViewed) {
      addTraderLastViewed(protocol, _address)
    }
  }, [])

  const { lg, xl } = useResponsive()

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }

  if (!isLoadingTraderData && !traderData) return <NotFound title="Trader not found" message="" />

  return (
    <>
      <CustomPageTitle title={`Trader ${addressShorten(_address)} on ${protocol}`} />
      <Layout resetSort={resetSort}>
        {/* child 1 */}
        <BotAlertProvider>
          <Flex
            sx={{
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <TraderInfo
              address={_address}
              traderData={currentTraderData}
              timeOption={timeOption}
              traderStats={traderData}
            />
            <TraderActionButtons account={_address} protocol={protocol} onCopyActionSuccess={onForceReload} />
          </Flex>
        </BotAlertProvider>
        {/* child 2 */}

        <Box display={['block', 'block', 'flex']} flexDirection="column" height="100%">
          <GeneralStats traderData={currentTraderData} />
          {protocol && _address && (
            <ChartTrader protocol={protocol} account={_address} timeOption={timeOption} onChangeTime={setTimeOption} />
          )}
          <Box flex="1" overflow="auto" mr={[0, 0, 0, '-1px']} sx={{ position: 'relative' }}>
            {!!traderData && <TraderStats data={traderData} timeOption={timeOption} />}
          </Box>
        </Box>

        {/* child3 */}
        <TraderRanking data={currentTraderData} timeOption={timeOption} onChangeTime={setTimeOption} />

        {/* child 4 */}
        <ChartPositions
          sx={{
            height: '100%',
          }}
          protocol={protocol ?? ProtocolEnum.GMX}
          timeframeOption={TIME_FILTER_OPTIONS[1]}
          currencyOption={currencyOption}
          changeCurrency={changeCurrency}
          openingPositions={openingPositions ?? []}
          closedPositions={closedPositions?.data ?? []}
          fetchNextPage={handleFetchClosedPositions}
          hasNextPage={hasNextClosedPositions}
          isLoadingClosed={isLoadingClosed}
        />

        {/* child 5 */}
        <div>{/* {!!_address && <ActivityHeatmap account={_address} />} */}</div>

        {/* child 6 */}
        <OpeningPositionTable data={openingPositions} isLoading={isLoadingOpening} protocol={protocol} />
        {/* child 7 */}
        <HistoryTable
          tokenOptions={tokenOptions}
          data={closedPositions?.data}
          dataMeta={closedPositions?.meta}
          isLoading={isLoadingClosed}
          currencyOption={currencyOption}
          changeCurrency={changeCurrency}
          fetchNextPage={handleFetchClosedPositions}
          hasNextPage={hasNextClosedPositions}
          tableSettings={historyColumns}
          currentSort={xl ? currentSort : undefined}
          changeCurrentSort={xl ? changeCurrentSort : undefined}
        />
      </Layout>
    </>
  )
}
