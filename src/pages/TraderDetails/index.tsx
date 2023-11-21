import { CirclesThreePlus } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { requestTestMultiOrderApi } from 'apis/backTestApis'
import { getOpeningPositionsApi } from 'apis/positionApis'
import { getTraderApi, getTraderHistoryApi } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import NotFound from 'components/@ui/NotFound'
import { TableSortProps } from 'components/@ui/Table/types'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import TradeProtocolAction from 'components/@ui/TradeProtocol'
import SingleBacktestModal from 'components/BacktestModal/SingleBacktestModal'
import { initBacktestState, initialState, reducer } from 'components/BacktestModal/SingleBacktestModal/config'
import { MIN_BACKTEST_VALUE, parseRequestData } from 'components/BacktestModal/helper'
import ChartPositions from 'components/Charts/ChartPositions'
import { useClickLoginButton } from 'components/LoginAction'
import HistoryTable, { historyColumns } from 'components/Tables/HistoryTable'
import OpeningPositionTable from 'components/Tables/OpeningPositionTable'
import { PositionData } from 'entities/trader.d'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import usePageChange from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
// import useSearchParams from 'hooks/router/useSearchParams'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { useAuthContext } from 'hooks/web3/useAuth'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT, NAVBAR_HEIGHT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ALL_TOKENS_ID, getTokenOptions } from 'utils/config/trades'
import { addressShorten, formatRelativeDate } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import AlertAction from './AlertAction'
import BackTestAction from './BackTestAction'
import ChartTrader from './ChartTrader'
import CopyTraderAction from './CopyTraderAction'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import TraderInfo from './TraderInfo'
import TraderRanking from './TraderRanking'
import TraderStats from './TraderStats'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}
export default function TraderDetails() {
  const { address, protocol } = useParams<{ address: string; protocol: ProtocolEnum }>()
  const { searchParams, setSearchParams } = useSearchParams()
  const isForceOpenModal = searchParams[URL_PARAM_KEYS.OPEN_BACKTEST_MODAL] === '1' ? true : false
  const requestDataStr = searchParams?.[URL_PARAM_KEYS.BACKTEST_DATA] as string
  const requestData = !!requestDataStr ? parseRequestData(requestDataStr, protocol) : undefined

  const [backtestState, dispatch] = useReducer(reducer, initialState, () =>
    initBacktestState({
      isFocusBacktest: isForceOpenModal,
      status: requestData ? 'testing' : undefined,
      settings: requestData,
    })
  )

  const { mutate: requestBacktest } = useMutation(requestTestMultiOrderApi, {
    onSuccess: (data, variables) => {
      const currentInstanceId = backtestState.currentInstanceId
      if (!currentInstanceId || backtestState.instanceIds.length !== 1) return
      const backtestInstance = backtestState.instancesMapping[currentInstanceId]
      if (!!backtestInstance.result) return
      dispatch({ type: 'setSetting', payload: variables.data })
      dispatch({ type: 'setResult', payload: data[0] })
      dispatch({ type: 'setStatus', payload: 'tested' })
      if (isForceOpenModal) {
        dispatch({ type: 'toggleFocusBacktest', payload: true })
        setSearchParams({ [URL_PARAM_KEYS.OPEN_BACKTEST_MODAL]: null })
      }
    },
  })
  useEffect(() => {
    if (!requestData) return
    if (Object.keys(requestData).length < MIN_BACKTEST_VALUE) return
    requestBacktest({ protocol, data: { ...requestData, isReturnPositions: true } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tokenOptions = useMemo(() => getTokenOptions({ protocol }), [protocol])
  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: URL_PARAM_KEYS.CURRENCY,
    options: tokenOptions,
    callback: () => {
      changeCurrentPage(1)
    },
  })
  const _address = isAddress(address)
  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, _address, protocol],
    () =>
      Promise.all(
        TIME_FILTER_OPTIONS.map((option) =>
          getTraderApi({ protocol, account: _address, type: option.id, returnRanking: true })
        ).reverse()
      ),
    {
      enabled: !!_address,
      retry: 0,
    }
  )
  const { currentOption: timeOption, changeCurrentOption: setTimeOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: TIME_FILTER_OPTIONS,
    defaultOption: TIME_FILTER_OPTIONS[3].id as unknown as string,
  })
  const currentTraderData =
    traderData?.find((item) => (item?.type as string) === (timeOption.id as unknown as string)) ?? traderData?.[0] // TODO: remove timeTilter enum

  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, _address, protocol],
    () => getOpeningPositionsApi({ protocol, account: _address }),
    { enabled: !!_address, retry: 0 }
  )
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  if (!!_address) {
    queryFilters.push({ fieldName: 'account', value: _address })
  }
  if (currencyOption.id !== ALL_TOKENS_ID) {
    queryFilters.push({ fieldName: 'indexToken', value: currencyOption.id })
  }

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'closeBlockTime',
    sortType: SortTypeEnum.DESC,
  })
  const resetSort = () =>
    setCurrentSort({
      sortBy: 'closeBlockTime',
      sortType: SortTypeEnum.DESC,
    })
  const changeCurrentSort = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }
  const { data: closedPositions, isFetching: isLoadingClosed } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_HISTORY, _address, currentPage, currencyOption.id, currentSort, protocol],
    () =>
      getTraderHistoryApi({
        limit: currentPage * DEFAULT_LIMIT,
        offset: 0,
        sort: currentSort,
        protocol,
        queryFilters,
        rangeFilters,
      }),
    { enabled: !!_address, retry: 0, keepPreviousData: true }
  )
  const handleFetchClosedPositions = () => {
    changeCurrentPage(currentPage + 1)
  }
  const hasNextClosedPositions = closedPositions && closedPositions.meta.limit < closedPositions.meta.total

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

  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const handleOpenBackTestModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    dispatch({ type: 'toggleFocusBacktest' })
  }
  const handleDismissBackTestModal = () => {
    dispatch({ type: 'toggleFocusBacktest' })
  }

  const generalInfo = useMemo(() => {
    if (!currentTraderData) return null
    return {
      lastTrade: formatRelativeDate(currentTraderData.lastTradeAt),
      runtimeDays: currentTraderData.runTimeDays,
    }
  }, [currentTraderData])

  const { lg, xl } = useResponsive()

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }

  const currentBacktestId = backtestState.currentInstanceId
  const currentBacktestInstance = currentBacktestId && backtestState.instancesMapping[currentBacktestId]
  const hadBacktest = !!requestData || (!!currentBacktestInstance && !!currentBacktestInstance.result)

  const hasCopyPermission = useCopyTradePermission()

  if (!isLoadingTraderData && !traderData) return <NotFound title="Trader not found" message="" />

  return (
    <>
      <CustomPageTitle title={`Trader ${addressShorten(_address)} on ${protocol}`} />
      <Layout resetSort={resetSort}>
        {/* child 1 */}
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
          <Box
            sx={{
              alignItems: 'center',
              borderBottom: ['small', 'small', 'small', 'none'],
              borderColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
              width: [0, '100%', '100%', 'auto'],
              height: ['40px', '40px', '40px', '100%'],
              display: ['none', 'flex', 'flex', 'flex'],
              position: [undefined, 'fixed', 'fixed', 'static'],
              top: [undefined, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71],
              zIndex: 10,
              bg: ['neutral7', 'neutral7', 'neutral7', undefined],
            }}
          >
            <TradeProtocolAction protocol={protocol} />
            <AlertAction protocol={protocol} account={_address} />
            <BackTestAction onClick={handleOpenBackTestModal} hadBacktest={hadBacktest} />
            <CopyTraderAction
              protocol={protocol}
              account={_address}
              onForceReload={onForceReload}
              hasCopyPermission={hasCopyPermission}
            />
          </Box>
          <Box
            sx={{
              display: ['flex', 'none', 'none', 'none'],
              position: ['fixed', undefined, undefined, undefined],
              top: NAVBAR_HEIGHT + 24,
              right: 3,
              zIndex: 10,
            }}
          >
            <Dropdown
              hasArrow={false}
              menuSx={{
                bg: 'neutral7',
                width: 'max-content',
              }}
              menu={
                <>
                  <Box height="40px">
                    <TradeProtocolAction protocol={protocol} />
                  </Box>
                  <Box height="40px">
                    <AlertAction protocol={protocol} account={_address} />
                  </Box>
                  <Box height="40px">
                    <BackTestAction onClick={handleOpenBackTestModal} hadBacktest={hadBacktest} />
                  </Box>
                  <Box height="40px">
                    <CopyTraderAction
                      protocol={protocol}
                      account={_address}
                      onForceReload={onForceReload}
                      hasCopyPermission={hasCopyPermission}
                    />
                  </Box>
                </>
              }
              sx={{}}
              buttonSx={{
                border: 'none',
                height: '100%',
                p: 0,
              }}
              placement={'topRight'}
            >
              <IconButton
                size={24}
                type="button"
                icon={<CirclesThreePlus size={24} weight="fill" />}
                variant="ghost"
                sx={{
                  color: 'neutral1',
                }}
              />
            </Dropdown>
          </Box>
        </Flex>
        {/* child 2 */}

        <Box display={['block', 'block', 'flex']} flexDirection="column" height="100%">
          {!!generalInfo && (
            <Flex
              p={12}
              sx={{
                borderBottom: 'small',
                borderColor: 'neutral4',
                justifyContent: 'center',
                height: ['auto', 50],
                gap: 24,
                mt: [0, 40, 40, 0],
              }}
            >
              <Box textAlign="center" color="neutral3" flex={['1', 'none']}>
                <LabelWithTooltip
                  id="tt_balance"
                  sx={{
                    display: ['block', 'inline-block'],
                    mr: [0, 2],
                  }}
                  tooltip="Total value of collateral"
                >
                  Balance:
                </LabelWithTooltip>
                <Type.Caption color="neutral1">
                  <BalanceText protocol={protocol} account={currentTraderData?.account} />
                </Type.Caption>
              </Box>
              <Box textAlign="center" flex={['1', 'none']}>
                <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
                  Last Trade:
                </Type.Caption>
                <Type.Caption>{generalInfo.lastTrade}</Type.Caption>
              </Box>
              <Box textAlign="center" flex={['1', 'none']}>
                <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
                  Runtime:
                </Type.Caption>
                <Type.Caption>{generalInfo.runtimeDays} days</Type.Caption>
              </Box>
            </Flex>
          )}
          {protocol && _address && (
            <ChartTrader protocol={protocol} account={_address} timeOption={timeOption} onChangeTime={setTimeOption} />
          )}
          <Box flex="1" overflow="auto" mr={[0, 0, 0, '-1px']} sx={{ position: 'relative' }}>
            {!!traderData && <TraderStats data={traderData} />}
          </Box>
        </Box>

        {/* child3 */}
        <>
          {!!currentTraderData && (
            <TraderRanking
              data={currentTraderData}
              timeOption={timeOption}
              onChangeTime={(option) => setTimeOption(option)}
            />
          )}
        </>

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
        <OpeningPositionTable data={openingPositions} isLoading={isLoadingOpening} />
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
      <SingleBacktestModal
        account={_address}
        isOpen={backtestState.isFocusBacktest}
        onDismiss={handleDismissBackTestModal}
        state={backtestState}
        dispatch={dispatch}
      />
    </>
  )
}
