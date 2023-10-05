import {
  ArrowsIn,
  ArrowsOutSimple,
  CaretRight,
  ChartBarHorizontal,
  ClockCounterClockwise,
  DotsNine,
  XCircle,
} from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useMemo, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { useHistory } from 'react-router-dom'

import { ApiMeta } from 'apis/api'
import Container from 'components/@ui/Container'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import Table from 'components/@ui/Table'
import { renderEntry } from 'components/@ui/Table/renderProps'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import CurrencyOption from 'components/CurrencyOption'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useInfiniteLoadMore from 'hooks/features/useInfiniteLoadMore'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useSearchParams from 'hooks/router/useSearchParams'
import { useHeatmapStore } from 'hooks/store/useHeatmap'
import useMyProfile from 'hooks/store/useMyProfile'
import ActivityHeatmap from 'pages/TraderDetails/ActivityHeatmap'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import SkullIcon from 'theme/Icons/SkullIcon'
import Drawer from 'theme/Modal/Drawer'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { TokenOptionProps } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { generateClosedPositionRoute } from 'utils/helpers/generateRoute'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

function getHighestPnl(array: any): number {
  let high = 0
  let sum = 0
  const ar = array.slice().reverse()
  for (let i = 0; i < ar.length; i++) {
    sum += ar[i].realisedPnl - ar[i].fee
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

export default function HistoryTable({
  data,
  isLoading,
  tokenOptions,
  currencyOption,
  changeCurrency,
  hasNextPage,
  fetchNextPage,
  toggleExpand,
  isExpanded,
  tableSettings,
  currentSort,
  changeCurrentSort,
  dataMeta,
}: HistoryTableProps) {
  const { myProfile } = useMyProfile()
  const isMobile = useIsMobile()
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

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(
      null,
      '',
      generateClosedPositionRoute({ protocol: data.protocol, id: data.id, nextHours: nextHoursParam })
    )
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const highValue: number = data?.length ? getHighestPnl(data) : 0

  const { lg } = useResponsive()

  const { scrollRef } = useInfiniteLoadMore({ isDesktop: lg, hasNextPage, fetchNextPage, isLoading })

  const logEventLayout = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.LAYOUT,
      action,
    })
  }

  return (
    <Box display={['block', 'block', 'block', 'flex']} flexDirection="column" height={['auto', 'auto', 'auto', '100%']}>
      <Flex pt={16} pb={12} px={12} alignItems="center">
        <Box flex="1">
          <SectionTitle icon={<ClockCounterClockwise size={24} />} title="History" />
        </Box>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <ButtonWithIcon
            icon={
              <Box color={heatmapVisible ? 'primary1' : 'neutral3'}>
                <DotsNine fontVariant="bold" size={20} />
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
          <ButtonWithIcon
            icon={
              <Box color={showChart ? 'primary1' : 'neutral3'}>
                <ChartBarHorizontal mirrored size={20} />
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
          <Tooltip id="history_table_heatmap" place="bottom" type="dark" effect="solid">
            <Type.Caption>Show/Hide Heatmap Activity</Type.Caption>
          </Tooltip>
          <CurrencyOption
            options={tokenOptions}
            currentOption={currencyOption}
            handleChangeOption={(option) => {
              changeCurrency(option)
            }}
          />
          {toggleExpand && (
            <IconBox
              icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
              role="button"
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'sm',
                border: 'small',
                borderColor: 'neutral4',
                color: 'neutral2',
                '&:hover': { color: 'neutral1' },
              }}
              onClick={toggleExpand}
            />
          )}
        </Flex>
      </Flex>
      {!!data && data.length > 0 && !!data[0].account && heatmapVisible && (
        <Box height={130} px={12}>
          <ActivityHeatmap account={data[0].account} protocol={data[0].protocol} />
        </Box>
      )}
      <Box flex="1" overflowX="auto" overflowY="hidden">
        <Table
          scrollRef={scrollRef}
          wrapperSx={{
            minWidth: 500,
          }}
          isInfiniteLoad
          dataMeta={dataMeta}
          // loadingSx={
          //   lg
          //     ? {
          //         position: 'absolute',
          //         left: 0,
          //         bottom: 0,
          //         right: 0,
          //       }
          //     : {
          //         position: 'fixed',
          //         bottom: 140,
          //         left: 0,
          //         right: 0,
          //       }
          // }
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          restrictHeight={lg}
          data={data}
          columns={tableSettings}
          isLoading={isLoading}
          onClickRow={handleSelectItem}
          renderRowBackground={(dataRow: any, index: number) => {
            if (!data || !showChart) return '#0B0E18'

            const sumProfit = data.slice(index, data.length).reduce((sum, item) => sum + item.realisedPnl - item.fee, 0)

            const percent = (Math.abs(sumProfit) * 100) / highValue
            return `linear-gradient(to right, #0B0E18 ${100 - percent}%, ${
              sumProfit > 0 ? 'rgba(56, 208, 96, 0.15)' : 'rgba(239, 53, 53, 0.15)'
            } 0%)`
          }}
        />
      </Box>

      <Drawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        mode="right"
        // zIndex={105}
        size={isMobile ? '100%' : '60%'}
        background="neutral6"
        // lockBackgroundScroll={true}
      >
        <Container sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <IconButton
            icon={<XCircle size={24} />}
            variant="ghost"
            sx={{ position: 'absolute', right: 1, top: 3 }}
            onClick={handleDismiss}
          />
          {!!currentPosition && (
            <PositionDetails protocol={currentPosition.protocol} id={currentPosition.id} isShow={openDrawer} />
          )}
        </Container>
      </Drawer>
    </Box>
  )
}

const orderCountColumn: ColumnData<PositionData> = {
  title: 'Total Orders',
  dataIndex: 'orderCount',
  key: 'orderCount',
  sortBy: 'orderCount',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{item.orderCount}</Type.Caption>,
}
// const orderIncreaseCountColumn: ColumnData<PositionData> = {
//   title: 'Increase Order',
//   dataIndex: 'orderIncreaseCount',
//   key: 'orderIncreaseCount',
//   style: { minWidth: '100px', textAlign: 'right' },
//   render: (item) => <Type.Caption color="neutral1">{formatNumber(item.orderIncreaseCount, 0)}</Type.Caption>,
// }
// const orderDecreaseCountColumn: ColumnData<PositionData> = {
//   title: 'Decrease Order',
//   dataIndex: 'orderDecreaseCount',
//   key: 'orderDecreaseCount',
//   style: { minWidth: '100px', textAlign: 'right' },
//   render: (item) => <Type.Caption color="neutral1">{formatNumber(item.orderDecreaseCount, 0)}</Type.Caption>,
// }
const collateralColumn: ColumnData<PositionData> = {
  title: 'Collateral',
  dataIndex: 'collateral',
  key: 'collateral',
  // sortBy: 'collateral',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">${formatNumber(item.collateral, 0)}</Type.Caption>,
}
const feeColumn: ColumnData<PositionData> = {
  title: 'Fee',
  dataIndex: 'fee',
  key: 'fee',
  // sortBy: 'fee',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <SignedText value={-item.fee} maxDigit={1} minDigit={1} />
    </Type.Caption>
  ),
}
const avgDurationColumn: ColumnData<PositionData> = {
  title: 'Duration',
  dataIndex: 'durationInSecond',
  key: 'durationInSecond',
  sortBy: 'durationInSecond',
  style: { minWidth: '110px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">{formatNumber(item.durationInSecond / (60 * 60), 1, 1)}h</Type.Caption>
  ),
}
const roiColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <SignedText value={item.roi} maxDigit={2} minDigit={2} suffix="%" />
    </Type.Caption>
  ),
}
const openTimeColumn: ColumnData<PositionData> = {
  title: 'Open Time',
  dataIndex: 'openBlockTime',
  key: 'openBlockTime',
  sortBy: 'openBlockTime',
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.openBlockTime} />
    </Type.Caption>
  ),
}
const closeTimeColumn: ColumnData<PositionData> = {
  title: 'Close Time',
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  sortBy: 'closeBlockTime',
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.closeBlockTime} />
    </Type.Caption>
  ),
}
const timeColumn: ColumnData<PositionData> = {
  title: 'Time',
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  style: { minWidth: '90px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      <LocalTimeText date={item.closeBlockTime} />
    </Type.Caption>
  ),
}
const entryColumn: ColumnData<PositionData> = {
  title: 'Entry',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { minWidth: '140px' },
  render: (item) => renderEntry(item),
}
const sizeColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => (
    <Flex justifyContent="end" alignItems="center">
      <Type.Caption color="neutral1">${formatNumber(item.size, 0, 0)}</Type.Caption>
    </Flex>
  ),
}
const leverageColumn: ColumnData<PositionData> = {
  title: 'Leverage',
  dataIndex: 'leverage',
  key: 'leverage',
  sortBy: 'leverage',
  style: { minWidth: '70px', textAlign: 'right' },
  render: (item) => (
    <Flex justifyContent="end" alignItems="center">
      <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>
    </Flex>
  ),
}
const pnlColumnFull: ColumnData<PositionData> = {
  title: 'Pnl $',
  dataIndex: 'realisedPnl',
  key: 'realisedPnl',
  sortBy: 'realisedPnl',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" sx={{ gap: '1px' }}>
        {(item.isLiquidate || item.roi <= -100) && <IconBox sx={{ pl: '2px' }} icon={<SkullIcon />} />}
        {SignedText({
          value: item.realisedPnl,
          maxDigit: 1,
          minDigit: 1,
          sx: { width: '100%' },
        })}
      </Flex>
    )
  },
}
const pnlColumn: ColumnData<PositionData> = {
  title: 'Net Pnl $',
  dataIndex: 'realisedPnl',
  key: 'realisedPnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" sx={{ gap: '1px' }}>
        {(item.isLiquidate || item.roi <= -100) && <IconBox sx={{ pl: '2px' }} icon={<SkullIcon />} />}
        {SignedText({
          value: item.realisedPnl - item.fee,
          maxDigit: 1,
          minDigit: 1,
          sx: { textAlign: 'right', width: '100%' },
        })}
      </Flex>
    )
  },
}
const pnlWFeeColumn: ColumnData<PositionData> = {
  title: 'Net Pnl $',
  dataIndex: undefined,
  key: undefined,
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" sx={{ gap: '1px' }}>
        {(item.isLiquidate || item.roi <= -100) && <IconBox sx={{ pl: '2px' }} icon={<SkullIcon />} />}
        {SignedText({
          value: item.realisedPnl - item.fee,
          maxDigit: 1,
          minDigit: 1,
          sx: { textAlign: 'right', width: '100%' },
        })}
      </Flex>
    )
  },
}
const actionColumn: ColumnData<PositionData> = {
  title: ' ',
  dataIndex: 'id',
  key: 'id',
  style: { minWidth: '20px', textAlign: 'right' },
  render: () => (
    <Box sx={{ position: 'relative', top: '2px' }}>
      <CaretRight />
    </Box>
  ),
}

export const historyColumns: ColumnData<PositionData>[] = [
  timeColumn,
  entryColumn,
  sizeColumn,
  leverageColumn,
  pnlColumn,
  actionColumn,
]
export const fullHistoryColumns: ColumnData<PositionData>[] = [
  openTimeColumn,
  closeTimeColumn,
  entryColumn,
  sizeColumn,
  leverageColumn,
  collateralColumn,
  avgDurationColumn,
  orderCountColumn,
  roiColumn,
  pnlColumnFull,
  feeColumn,
  pnlWFeeColumn,
  // orderIncreaseCountColumn,
  // orderDecreaseCountColumn,
  actionColumn,
]
