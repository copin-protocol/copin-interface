import {
  ArrowsIn,
  ArrowsOutSimple,
  ChartBarHorizontal,
  ChartScatter,
  ClockCounterClockwise,
} from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import CurrencyOption from 'components/@widgets/CurrencyOption'
import { PositionData } from 'entities/trader'
import useInfiniteLoadMore from 'hooks/features/useInfiniteLoadMore'
import useSearchParams from 'hooks/router/useSearchParams'
import { useHeatmapStore } from 'hooks/store/useHeatmap'
import useMyProfile from 'hooks/store/useMyProfile'
import ActivityHeatmap from 'pages/TraderDetails/ActivityHeatmap'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Tooltip from 'theme/Tooltip'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import HLTraderPositionListView from '../TraderPositionsListView'
import { drawerHistoryColumns, fullHistoryColumns, historyColumns } from '../configs/traderPositionRenderProps'
import useQueryClosedPositions from './useQueryClosedPositions'
import useQueryClosedPositionsMobile from './useQueryClosedPositionsMobile'

function getHighestPnl(array: any): number {
  let high = 0
  let sum = 0
  const ar = array.slice().reverse()
  for (let i = 0; i < ar.length; i++) {
    sum += ar[i].pnl
    if (Math.abs(sum) > high) high = Math.abs(sum)
  }

  return high
}

export interface HistoryTableProps {
  address: string
  protocol: ProtocolEnum
  isExpanded: boolean
  isDrawer?: boolean
  hasTitle?: boolean
  toggleExpand?: () => void
  backgroundColor?: string
}

export default function TraderHistoryPositions(props: HistoryTableProps) {
  const { address, protocol, isDrawer, isExpanded, toggleExpand } = props
  const { myProfile } = useMyProfile()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const { heatmapVisible, setHeatmapVisible } = useHeatmapStore()
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { sm, xl } = useResponsive()

  //
  const {
    tokenOptions,
    currencyOption,
    changeCurrency,
    currentSort,
    changeCurrentSort,
    resetSort,
    closedPositions,
    isLoadingClosed: isLoadingClosedPositions,
    hasNextClosedPositions,
    handleFetchClosedPositions,
  } = useQueryClosedPositions({ address, protocol, isExpanded })

  const tableSettings = isDrawer ? drawerHistoryColumns : xl && isExpanded ? fullHistoryColumns : historyColumns
  const data = closedPositions?.data
  const dataMeta = closedPositions?.meta
  const [expanding, setExpanding] = useState(false)
  const handleToggleExpand = () => {
    setExpanding(true)
    setTimeout(() => {
      setExpanding(false)
    }, 1000)
    resetSort()
    toggleExpand?.()
  }
  //

  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = useMemo(
    () =>
      searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
        ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
        : undefined,
    [searchParams]
  )

  const handleSelectItem = useCallback(
    (data: PositionData) => {
      setCurrentPosition(data)
      setOpenDrawer(true)
      window.history.replaceState(
        null,
        '',
        generatePositionDetailsRoute({
          id: data.id,
          protocol: data.protocol,
          txHash: data.txHashes?.[0],
          account: data.account,
          logId: data.logId,
          isLong: data.isLong,
          nextHours: nextHoursParam,
        })
      )
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const logEventLayout = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.LAYOUT,
      action,
    })
  }

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault()
        window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
        window.location.reload()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [history])
  const { lg } = useResponsive()
  const highValue: number = data?.length ? getHighestPnl(data) : 0

  const renderRowBackground = useCallback(
    (index: number) => {
      if (!data || !showChart) return undefined

      const sumProfit = data.slice(index, data.length).reduce((sum, item) => sum + item.pnl, 0)

      const percent = (Math.abs(sumProfit) * 100) / highValue
      return `linear-gradient(to right, #0B0E18 ${100 - percent}%, ${
        sumProfit > 0 ? 'rgba(56, 208, 96, 0.15)' : 'rgba(239, 53, 53, 0.15)'
      } 0%)`
    },
    [data, highValue, showChart]
  )
  const resizeDeps = useMemo(() => [isExpanded], [isExpanded])

  useInfiniteLoadMore({
    isDesktop: lg,
    hasNextPage: hasNextClosedPositions,
    fetchNextPage: handleFetchClosedPositions,
    isLoading: isLoadingClosedPositions,
  })

  return (
    <Box display={'flex'} flexDirection="column" height={'100%'}>
      <Flex pt={16} px={2} pb={12} alignItems="center">
        <Box flex="1" sx={{ '& > *': { pb: 0 } }}>
          <SectionTitle icon={ClockCounterClockwise} title="HISTORY" />
        </Box>
        <Flex
          sx={{
            alignItems: 'center',
            gap: 2,
            '.select__control': { border: 'none !important' },
            '.currency_option': { width: 'auto !important' },
            '.select__value-container': { p: '0 !important', '*': { p: '0 !important' } },
            '.select__menu': { minWidth: 88 },
          }}
        >
          <CurrencyOption
            options={tokenOptions}
            currentOption={currencyOption}
            handleChangeOption={(option) => {
              changeCurrency(option)
            }}
          />
          {!isDrawer && (
            <ButtonWithIcon
              icon={
                <Box color={heatmapVisible ? 'primary1' : 'neutral3'}>
                  <ChartScatter fontVariant="bold" size={20} />
                </Box>
              }
              variant="ghost"
              p={0}
              width={'auto'}
              block
              onClick={() => {
                if (heatmapVisible) {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_HEATMAP_ACTIVITY)
                } else {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].SHOW_HEATMAP_ACTIVITY)
                }

                setHeatmapVisible(!heatmapVisible)
              }}
              data-tip="React-tooltip"
              data-tooltip-id="history_table_heatmap"
              data-tooltip-offset={8}
            />
          )}
          {!isDrawer && sm && (
            <>
              <ButtonWithIcon
                icon={
                  <Box color={showChart ? 'primary1' : 'neutral3'}>
                    <ChartBarHorizontal size={20} />
                  </Box>
                }
                variant="ghost"
                p={0}
                width={'auto'}
                block
                onClick={() => {
                  if (showChart) {
                    logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_PNL_CHART)
                  } else {
                    logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].SHOW_PNL_CHART)
                  }

                  setShowChart(!showChart)
                }}
                data-tip="React-tooltip"
                data-tooltip-id="history_table_chart"
                data-tooltip-offset={8}
              />
              <Tooltip id="history_table_chart" place="bottom" type="dark" effect="solid">
                <Type.Caption>Show/Hide PnL Chart</Type.Caption>
              </Tooltip>
            </>
          )}
          <Tooltip id="history_table_heatmap" place="bottom" type="dark" effect="solid">
            <Type.Caption>Show/Hide Heatmap Activity</Type.Caption>
          </Tooltip>
          {!!toggleExpand && (
            <IconBox
              icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
              role="button"
              sx={{
                width: 24,
                height: 24,
                display: ['none', 'none', 'none', 'none', 'flex'],
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'sm',
                // border: 'small',
                // borderColor: 'neutral4',
                color: 'neutral2',
                '&:hover': { color: 'neutral1' },
              }}
              onClick={handleToggleExpand}
            />
          )}
        </Flex>
      </Flex>

      {!!data && data.length > 0 && !!data[0].account && heatmapVisible && (
        <Box height={130} px={12}>
          <ActivityHeatmap account={data[0].account} protocol={data[0].protocol} />
        </Box>
      )}
      {expanding && <Loading />}
      <Box
        flex="1 0 0"
        overflowX="auto"
        overflowY="hidden"
        className="test"
        sx={{ visibility: expanding ? 'hidden' : 'visible' }}
      >
        {!isLoadingClosedPositions && !data?.length && !sm ? (
          <NoDataFound message="No positions history" />
        ) : (
          <VirtualList
            data={data}
            isLoading={isLoadingClosedPositions}
            hasNextPage={hasNextClosedPositions}
            fetchNextPage={handleFetchClosedPositions}
            columns={tableSettings}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            dataMeta={dataMeta}
            handleSelectItem={handleSelectItem}
            resizeDeps={resizeDeps}
            rowBgFactory={renderRowBackground}
            footerBg={isDrawer ? 'neutral7' : undefined}
          />
        )}
        {/* {isLoadingClosedPositions && (
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bg: 'modalBG' }}>
            <Loading />
          </Box>
        )} */}
      </Box>

      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="close-position-detail"
      />
    </Box>
  )
}

// const PositionsList = memo(function PositionsListMemo({
//   data,
//   isLoading,
//   hasNextPage,
//   fetchNextPage,
//   tableSettings,
//   currentSort,
//   changeCurrentSort,
//   dataMeta,
//   showChart,
//   handleSelectItem,
//   isExpanded,
// }: {
//   data: PositionData[] | undefined
//   dataMeta: ApiMeta | undefined
//   isLoading: boolean
//   fetchNextPage: () => void
//   hasNextPage: boolean | undefined
//   tableSettings: ColumnData<PositionData>[]
//   currentSort: TableSortProps<PositionData> | undefined
//   changeCurrentSort: ((sort: TableSortProps<PositionData> | undefined) => void) | undefined
//   isExpanded: boolean
// } & { showChart: boolean; handleSelectItem: (data: PositionData) => void }) {

//   return lg ? (

//   ) : (
//     <>

//       {isLoading && (
//         <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bg: 'modalBG' }}>
//           <Loading />
//         </Box>
//       )}
//       {data && !isLoading && (dataMeta?.total ?? 0) === data.length && (
//         <Flex
//           sx={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             bg: 'neutral6',
//             height: 40,
//           }}
//         >
//           <Type.Caption color="neutral3">End of list</Type.Caption>
//         </Flex>
//       )}
//     </>
//   )
// })

export function TraderHistoryPositionsListView(props: HistoryTableProps) {
  const { address, protocol, backgroundColor = 'neutral7' } = props
  const { myProfile } = useMyProfile()
  const [openDrawer, setOpenDrawer] = useState(false)
  // const [showChart, setShowChart] = useState(false)
  // const { heatmapVisible, setHeatmapVisible } = useHeatmapStore()
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  // const { sm } = useResponsive()

  //
  const {
    currentPage,
    currentLimit,
    changeCurrentPage,
    changeCurrentLimit,
    tokenOptions,
    currencyOption,
    changeCurrency,
    closedPositions,
    isLoadingClosed: isLoadingClosedPositions,
  } = useQueryClosedPositionsMobile({ address, protocol })

  const data = closedPositions?.data
  const dataMeta = closedPositions?.meta

  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = useMemo(
    () =>
      searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
        ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
        : undefined,
    [searchParams]
  )

  const handleSelectItem = useCallback(
    (data: PositionData) => {
      setCurrentPosition(data)
      setOpenDrawer(true)
      window.history.replaceState(
        null,
        '',
        generatePositionDetailsRoute({
          id: data.id,
          protocol: data.protocol,
          txHash: data.txHashes?.[0],
          account: data.account,
          logId: data.logId,
          isLong: data.isLong,
          nextHours: nextHoursParam,
        })
      )
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const logEventLayout = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.LAYOUT,
      action,
    })
  }

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault()
        window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
        window.location.reload()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [history])

  const scrollToTopDependencies = useMemo(() => {
    return [address, protocol, currentPage, currentLimit]
  }, [address, protocol, currentPage, currentLimit])

  return (
    <Flex flexDirection="column" height="100%">
      <Flex pt={16} px={12} pb={12} alignItems="center">
        <Box flex="1" sx={{ '& > *': { pb: 0 } }}>
          {props.hasTitle ? <SectionTitle icon={ClockCounterClockwise} title="History" /> : <></>}
        </Box>
        <Flex
          sx={{
            alignItems: 'center',
            gap: 2,
            '.select__control': { border: 'none !important' },
            '.currency_option': { width: 'auto !important' },
            '.select__value-container': { p: '0 !important', '*': { p: '0 !important' } },
            '.select__menu': { minWidth: 88, transform: 'translateX(-32px)' },
          }}
        >
          <CurrencyOption
            options={tokenOptions}
            currentOption={currencyOption}
            handleChangeOption={(option) => {
              changeCurrency(option)
            }}
          />
          {/* <ButtonWithIcon
            icon={
              <Box color={heatmapVisible ? 'primary1' : 'neutral3'}>
                <ChartScatter fontVariant="bold" size={20} />
              </Box>
            }
            variant="ghost"
            p={0}
            width={'auto'}
            block
            onClick={() => {
              if (heatmapVisible) {
                logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_HEATMAP_ACTIVITY)
              } else {
                logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].SHOW_HEATMAP_ACTIVITY)
              }

              setHeatmapVisible(!heatmapVisible)
            }}
            data-tip="React-tooltip"
            data-tooltip-id="history_table_heatmap"
            data-tooltip-offset={8}
          />
          <Tooltip id="history_table_heatmap" place="bottom" type="dark" effect="solid">
            <Type.Caption>Show/Hide Heatmap Activity</Type.Caption>
          </Tooltip> */}
        </Flex>
      </Flex>
      {/* {!isLoadingClosedPositions && !data?.length && !sm && <NoDataFound message="No positions history" />} */}
      {/* {!!data && data.length > 0 && !!data[0].account && heatmapVisible && (
        <Box height={130} px={12}>
          <ActivityHeatmap account={data[0].account} protocol={data[0].protocol} />
        </Box>
      )} */}
      <Box flex="1 0 0" overflowX="auto" overflowY="hidden" className="test" bg={backgroundColor}>
        <HLTraderPositionListView
          data={data}
          isLoading={isLoadingClosedPositions}
          scrollDep={scrollToTopDependencies}
          onClickItem={handleSelectItem}
          hasAccountAddress={false}
          isOpening={false}
        />
      </Box>
      <Divider />
      <Box bg={props.isDrawer ? 'neutral7' : 'neutral5'}>
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={dataMeta}
        />
      </Box>

      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="close-position-detail"
      />
    </Flex>
  )
}
