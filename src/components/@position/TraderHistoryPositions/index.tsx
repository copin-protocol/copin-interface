import {
  ArrowsIn,
  ArrowsOutSimple,
  ChartBarHorizontal,
  ChartScatter,
  ClockCounterClockwise,
} from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { ApiMeta } from 'apis/api'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import TraderPositionListView from 'components/@position/TraderPositionsListView'
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
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { TokenOptionProps } from 'utils/config/trades'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

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
  data: PositionData[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  tokenOptions: TokenOptionProps[]
  currencyOption: TokenOptionProps
  changeCurrency: (option: TokenOptionProps) => void
  fetchNextPage?: () => void
  hasNextPage?: boolean | undefined
  toggleExpand?: () => void
  isExpanded?: boolean
  tableSettings: ColumnData<PositionData>[]
  currentSort?: TableSortProps<PositionData> | undefined
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
}

export default function TraderHistoryPositions(props: HistoryTableProps) {
  const { data, isLoading, tokenOptions, currencyOption, changeCurrency, toggleExpand, isExpanded } = props
  const { myProfile } = useMyProfile()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const { heatmapVisible, setHeatmapVisible } = useHeatmapStore()
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
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
      if (!!data.txHashes?.length) {
        window.history.replaceState(
          null,
          '',
          generatePositionDetailsRoute({
            protocol: data.protocol,
            txHash: data.txHashes?.[0],
            account: data.account,
            logId: data.logId,
            nextHours: nextHoursParam,
          })
        )
      }
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const { sm } = useResponsive()

  const logEventLayout = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.LAYOUT,
      action,
    })
  }

  return (
    <Box display={['block', 'block', 'block', 'flex']} flexDirection="column" height={['auto', 'auto', 'auto', '100%']}>
      <Flex pt={16} px={12} pb={12} alignItems="center">
        <Box flex="1" sx={{ '& > *': { pb: 0 } }}>
          <SectionTitle icon={<ClockCounterClockwise size={24} />} title="History" />
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
          {sm && (
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
          {toggleExpand && (
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
              onClick={toggleExpand}
            />
          )}
        </Flex>
      </Flex>
      {!isLoading && !data?.length && !sm && <NoDataFound message="No positions history" />}
      {!!data && data.length > 0 && !!data[0].account && heatmapVisible && (
        <Box height={130} px={12}>
          <ActivityHeatmap account={data[0].account} protocol={data[0].protocol} />
        </Box>
      )}
      <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
        <PositionsList {...props} handleSelectItem={handleSelectItem} showChart={showChart} />
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

const PositionsList = memo(function PositionsListMemo({
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  tableSettings,
  currentSort,
  changeCurrentSort,
  dataMeta,
  showChart,
  handleSelectItem,
}: HistoryTableProps & { showChart: boolean; handleSelectItem: (data: PositionData) => void }) {
  const { sm, lg } = useResponsive()
  const { scrollRef } = useInfiniteLoadMore({ isDesktop: lg, hasNextPage, fetchNextPage, isLoading })
  const highValue: number = data?.length ? getHighestPnl(data) : 0
  return sm ? (
    <Table
      scrollRef={scrollRef}
      wrapperSx={{
        minWidth: 500,
      }}
      isInfiniteLoad
      dataMeta={dataMeta}
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
      restrictHeight={lg}
      data={data}
      columns={tableSettings}
      isLoading={isLoading}
      onClickRow={handleSelectItem}
      renderRowBackground={(dataRow: any, index: number) => {
        if (!data || !showChart) return '#0B0E18'

        const sumProfit = data.slice(index, data.length).reduce((sum, item) => sum + item.pnl, 0)

        const percent = (Math.abs(sumProfit) * 100) / highValue
        return `linear-gradient(to right, #0B0E18 ${100 - percent}%, ${
          sumProfit > 0 ? 'rgba(56, 208, 96, 0.15)' : 'rgba(239, 53, 53, 0.15)'
        } 0%)`
      }}
    />
  ) : (
    <>
      <TraderPositionListView
        data={data}
        isLoading={false}
        scrollDep={data}
        onClickItem={handleSelectItem}
        hasAccountAddress={false}
        isOpening={false}
      />
      {isLoading && <Loading />}
      {data && !isLoading && (dataMeta?.total ?? 0) === data.length && (
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            bg: 'neutral6',
            height: 40,
          }}
        >
          <Type.Caption color="neutral3">End of list</Type.Caption>
        </Flex>
      )}
    </>
  )
})
