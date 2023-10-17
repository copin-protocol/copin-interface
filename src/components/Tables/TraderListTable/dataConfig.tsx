import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactElement, ReactNode } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import FavoriteButton from 'components/FavoriteButton'
import { MyCopyTraderData, TraderData } from 'entities/trader.d'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'
import { PLATFORM_TRANS } from 'utils/config/translations'
import { formatDuration, formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'
import { FilterCondition } from 'utils/types'

export type TableSettings<T, K = unknown> = {
  style: any
  text?: ReactNode
  label: ReactNode
  unit?: string
  sortBy?: keyof T
  visible: boolean
  filter?: FilterCondition
  id: keyof T
  freezeLeft?: number
  freezeIndex?: number
  render?: (text: T, index: number, externalSource?: K) => React.ReactNode
}

export type ExternalSource = {
  traderFavorites: string[]
  onToggleFavorite: (account: string) => void
}

export type TableSettingsProps<T> = TableSettings<T, ExternalSource>[]

export const getFreezeLeftPos = (index: number, visibleColumns: string[]) => {
  let left = [36, 48]
  if (index === 0) return left
  const freezeLefts = tableSettings
    .slice(0, index)
    .filter((col) => visibleColumns.includes(col.id))
    .filter((col) => col.freezeLeft != null)
    .map((col) => col.freezeLeft)
  if (!freezeLefts.length) return left
  left = left.map((value) => value + freezeLefts.reduce((prev: number, cur) => (prev += cur || 0), 0))
  return left
}

export const tableSettings: TableSettingsProps<TraderData> = [
  {
    style: {
      minWidth: '180px',
    },
    text: 'Account',
    label: (
      <Box textAlign="left">
        <Trans>Account</Trans>
      </Box>
    ),
    visible: true,
    id: 'account',
    freezeLeft: 180,
    freezeIndex: 3,
    render: (item) => (
      <AccountCell data={item} additionalComponent={<FavoriteButton address={item.account} size={16} />} />
    ),
  },
  {
    style: { minWidth: ['100px', '130px'] },
    text: <Trans>Runtime (All)</Trans>,
    label: (
      <LabelWithTooltip id="tt_runtime_label" tooltip="The duration or time period of the trading activity">
        Runtime (All)
      </LabelWithTooltip>
    ),
    unit: 'd',
    sortBy: 'runTimeDays',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 45,
    },
    id: 'runTimeDays',
    // freezeLeft: 130,
    // freezeIndex: 2,
    render: (item) => (
      <div>
        <Text text={item.runTimeDays} /> {item.runTimeDays > 0 && <Type.Caption>days</Type.Caption>}
      </div>
    ),
  },
  {
    style: { minWidth: ['110px', '140px'] },
    text: <Trans>Last Trade</Trans>,
    label: (
      <LabelWithTooltip id="tt_last_trade_label" tooltip="The last time the trader closed a position">
        Last Trade
      </LabelWithTooltip>
    ),
    unit: 'd',
    sortBy: 'lastTradeAtTs',
    visible: true,
    filter: {
      conditionType: 'lte',
      lte: 3,
    },
    id: 'lastTradeAtTs',
    // freezeLeft: 140,
    // freezeIndex: 2,
    render: (item) => {
      return <Type.Caption>{item.lastTradeAt ? formatLocalRelativeDate(item.lastTradeAt) : '--'}</Type.Caption>
    },
  },
  {
    style: { minWidth: ['100px', '120px'] },
    text: <Trans>PnL</Trans>,
    label: (
      <LabelWithTooltip id="tt_pnl_label" tooltip="The overall profit or loss generated from the trades">
        PnL
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'profit',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'profit',
    render: (item) => <SignedText value={item.profit} maxDigit={0} prefix="$" />,
  },
  {
    style: { minWidth: ['100px', '111px'] },
    text: <Trans>Total Gain</Trans>,
    label: (
      <LabelWithTooltip id="tt_total_gain_label" tooltip="The cumulative profit made from all trades">
        Total Gain
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalGain',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 500,
    },
    id: 'totalGain',
    render: (item) => <SignedText value={item.totalGain} maxDigit={0} pos prefix="$" />,
  },
  {
    style: { minWidth: ['100px', '111px'] },
    text: <Trans>Total Loss</Trans>,
    label: (
      <LabelWithTooltip id="tt_total_loss_label" tooltip="The cumulative loss incurred from all trades">
        Total Loss
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalLoss',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: -200,
    },
    id: 'totalLoss',
    render: (item) => <SignedText value={item.totalLoss} maxDigit={0} neg prefix="$" />,
  },
  {
    style: { minWidth: ['110px', '120px'] },
    text: <Trans>Avg Volume</Trans>,
    label: (
      <LabelWithTooltip id="tt_avg_volume_label" tooltip="The average trading volume per trade">
        Avg Volume
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'avgVolume',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 5000,
    },
    id: 'avgVolume',
    render: (item) => <Text text={item.avgVolume ? `$${formatNumber(item.avgVolume, 0, 0)}` : undefined} />,
  },
  {
    style: { minWidth: '90px' },
    text: <Trans>Avg ROI</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_roi_label"
        tooltip="The average percentage gain or loss is calculated based on the average ROI of closed positions"
      >
        Avg ROI
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'avgRoi',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 20,
    },
    id: 'avgRoi',
    render: (item) => <SignedText value={item.avgRoi} maxDigit={1} minDigit={1} suffix="%" />,
  },
  {
    style: { minWidth: '90px' },
    text: <Trans>Min ROI</Trans>,
    label: (
      <LabelWithTooltip id="tt_min_roi_label" tooltip="The minimum percentage of gain or loss in closed positions">
        Min ROI
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'minRoi',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: -30,
    },
    id: 'minRoi',
    render: (item) => <SignedText value={item.minRoi} maxDigit={1} minDigit={1} suffix="%" />,
  },
  {
    style: { minWidth: '90px' },
    text: <Trans>Max ROI</Trans>,
    label: (
      <LabelWithTooltip id="tt_max_roi_label" tooltip="The maximum percentage of gain or loss in closed positions">
        Max ROI
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'maxRoi',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 50,
    },
    id: 'maxRoi',
    render: (item) => <SignedText value={item.maxRoi} maxDigit={1} minDigit={1} pos suffix="%" />,
  },
  {
    style: { minWidth: '85px' },
    text: <Trans>Trades</Trans>,
    label: (
      <LabelWithTooltip id="tt_trades_label" tooltip="The total number of trades executed">
        Trades
      </LabelWithTooltip>
    ),
    sortBy: 'totalTrade',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 10,
    },
    id: 'totalTrade',
    render: (item) => <Text text={item.totalTrade} />,
  },
  {
    style: { minWidth: '70px' },
    text: <Trans>Wins</Trans>,
    label: (
      <LabelWithTooltip id="tt_wins_label" tooltip="The total number of winning trades">
        Wins
      </LabelWithTooltip>
    ),
    sortBy: 'totalWin',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 5,
    },
    id: 'totalWin',
    render: (item) => <Text text={item.totalWin} />,
  },
  {
    style: { minWidth: '75px' },
    text: <Trans>Loses</Trans>,
    label: (
      <LabelWithTooltip id="tt_loses_label" tooltip="The total number of losing trades">
        Loses
      </LabelWithTooltip>
    ),
    sortBy: 'totalLose',
    visible: false,
    filter: {
      conditionType: 'lte',
      lte: 4,
    },
    id: 'totalLose',
    render: (item) => <Text text={item.totalLose} />,
  },
  {
    style: { minWidth: '100px' },
    text: <Trans>Win rate</Trans>,
    label: (
      <LabelWithTooltip id="tt_win_rate_label" tooltip="The percentage of winning trades out of the total trades">
        Win Rate
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'winRate',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 51,
    },
    id: 'winRate',
    render: (item) => <Text text={item.winRate ? `${formatNumber(item.winRate, 1, 1)}%` : undefined} />,
  },
  {
    style: { minWidth: ['100px', '120px'] },
    text: <Trans>Profit Rate</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_profit_rate_label"
        tooltip="The percentage of profit made relative to the total investment"
      >
        Profit Rate
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'profitRate',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'profitRate',
    render: (item) => <Text text={item.profitRate ? `${formatNumber(item.profitRate, 1, 1)}%` : undefined} />,
  },
  {
    style: { minWidth: ['100px', '110px'] },
    text: <Trans>W/L Ratio</Trans>,
    label: (
      <LabelWithTooltip id="tt_wl_ratio_label" tooltip="The ratio of winning trades to losing trades">
        W/L Ratio
      </LabelWithTooltip>
    ),
    sortBy: 'winLoseRatio',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 3,
    },
    id: 'winLoseRatio',
    render: (item) => <Text text={item.winLoseRatio ? formatNumber(item.winLoseRatio, 1, 1) : undefined} />,
  },
  {
    style: { minWidth: ['130px', '160px'] },
    text: <Trans>Order/Pos Ratio</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_order_pos_ratio_label"
        tooltip="The relationship between the number of open orders and the number of open positions"
      >
        Order/Pos Ratio
      </LabelWithTooltip>
    ),
    sortBy: 'orderPositionRatio',
    visible: false,
    filter: {
      conditionType: 'lte',
      lte: 5,
    },
    id: 'orderPositionRatio',
    render: (item) => <Text text={item.orderPositionRatio ? formatNumber(item.orderPositionRatio, 1, 1) : undefined} />,
  },
  {
    style: { minWidth: ['90px', '105px'] },
    text: <Trans>PnL Ratio</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_pnl_ratio_label"
        tooltip="The ratio of profit and loss in relation to the total investment"
      >
        PnL Ratio
      </LabelWithTooltip>
    ),
    sortBy: 'profitLossRatio',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 1,
    },
    id: 'profitLossRatio',
    render: (item) => <Text text={item.profitLossRatio ? formatNumber(item.profitLossRatio, 1, 1) : undefined} />,
  },
  {
    style: { minWidth: ['110px', '136px'] },
    text: <Trans>Profit Factor</Trans>,
    label: (
      <LabelWithTooltip id="tt_profit_factor_label" tooltip="The ratio of total profit to total loss">
        Profit Factor
      </LabelWithTooltip>
    ),
    sortBy: 'gainLossRatio',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 1.5,
    },
    id: 'gainLossRatio',
    render: (item) => <Text text={item.gainLossRatio ? formatNumber(item.gainLossRatio, 1, 1) : undefined} />,
  },
  {
    style: { minWidth: ['125px', '145px'] },
    text: <Trans>Avg Leverage</Trans>,
    label: (
      <LabelWithTooltip id="tt_avg_leverage_label" tooltip="The average trading leverage per trade">
        <Trans>Avg Leverage</Trans>
      </LabelWithTooltip>
    ),

    unit: 'x',
    sortBy: 'avgLeverage',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 20,
    },
    id: 'avgLeverage',
    render: (item) => <Text text={item.avgLeverage ? formatNumber(item.avgLeverage, 1, 1) + 'x' : undefined} />,
  },
  {
    style: { minWidth: ['125px', '145px'] },
    text: <Trans>Max Leverage</Trans>,
    label: <Trans>Max Leverage</Trans>,
    unit: 'x',
    sortBy: 'maxLeverage',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 30,
    },
    id: 'maxLeverage',
    render: (item) => <Text text={item.maxLeverage ? formatNumber(item.maxLeverage, 1, 1) + 'x' : undefined} />,
  },
  {
    style: { minWidth: ['125px', '145px'] },
    text: <Trans>Min Leverage</Trans>,
    label: <Trans>Min Leverage</Trans>,
    unit: 'x',
    sortBy: 'minLeverage',
    visible: false,
    filter: {
      conditionType: 'lte',
      gte: 10,
    },
    id: 'minLeverage',
    render: (item) => <Text text={item.minLeverage ? formatNumber(item.minLeverage, 1, 1) + 'x' : undefined} />,
  },
  {
    style: { minWidth: ['110px', '132px'] },
    text: <Trans>Avg Duration</Trans>,
    label: (
      <LabelWithTooltip id="tt_avg_duration_label" tooltip="The average duration of trades in hours">
        Avg Duration
      </LabelWithTooltip>
    ),
    unit: 'h',
    sortBy: 'avgDuration',
    visible: true,
    filter: {
      conditionType: 'lte',
      lte: 10,
    },
    id: 'avgDuration',
    render: (item) => <Text text={formatDuration(item.avgDuration * 1000)} />,
  },
  {
    style: { minWidth: ['110px', '132px'] },
    text: <Trans>Min Duration</Trans>,
    label: (
      <LabelWithTooltip id="tt_min_duration_label" tooltip="The minimum duration of a trade in hours">
        Min Duration
      </LabelWithTooltip>
    ),
    unit: 'h',
    sortBy: 'minDuration',
    visible: false,
    filter: {
      conditionType: 'lte',
      lte: 1,
    },
    id: 'minDuration',
    render: (item) => <Text text={formatDuration(item.minDuration * 1000)} />,
  },
  {
    style: { minWidth: ['110px', '135px'] },
    text: <Trans>Max Duration</Trans>,
    label: (
      <LabelWithTooltip id="tt_max_duration_label" tooltip="The maximum duration of a trade in hours">
        Max Duration
      </LabelWithTooltip>
    ),
    unit: 'h',
    sortBy: 'maxDuration',
    visible: false,
    filter: {
      conditionType: 'lte',
      lte: 50,
    },
    id: 'maxDuration',
    render: (item) => <Text text={formatDuration(item.maxDuration * 1000)} />,
  },
  {
    style: { minWidth: ['120px', '150px'] },
    text: <Trans>Max Drawdown</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_max_drawdown_label"
        tooltip="The maximum percentage decline in account value from its peak"
      >
        Max Drawdown
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'maxDrawDownRoi',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: -30,
    },
    id: 'maxDrawDownRoi',
    render: (item) => <SignedText value={item.maxDrawDownRoi} maxDigit={1} minDigit={1} neg suffix="%" />,
  },
  {
    style: { minWidth: ['145px', '175px'] },
    text: <Trans>Max Drawdown PnL</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_max_drawdown_pnl_label"
        tooltip="The maximum dollar value loss experienced from the peak account value"
      >
        Max Drawdown PnL
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'maxDrawDownPnl',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: -100,
    },
    id: 'maxDrawDownPnl',
    render: (item) => <SignedText value={item.maxDrawDownPnl} maxDigit={0} neg prefix="$" />,
  },
]
export const mobileTableSettings: TableSettingsProps<TraderData> = [
  {
    style: {
      minWidth: '150px',
    },
    text: <Trans>Account</Trans>,
    label: <Box textAlign="left">Account</Box>,
    visible: true,
    id: 'account',
    freezeLeft: 150,
    freezeIndex: 3,
    render: (item) => (
      <AccountCell data={item} additionalComponent={<FavoriteButton address={item.account} size={16} />} />
    ),
  },
  ...tableSettings.slice(1),
]

function Text({ text, ...props }: { text: string | number | undefined } & Record<string, any>) {
  return <Type.Caption {...props}>{!!text ? text : '--'}</Type.Caption>
}

export interface TraderListSortProps<T> {
  sortBy: keyof T
  sortType: SortTypeEnum
}
export interface TraderListPagination {
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
}

export function AccountCell({ data, additionalComponent }: { data: TraderData; additionalComponent?: ReactElement }) {
  // const lastTradeDuration = dayjs().diff(data.lastTradeAt, 'd')
  const { sm } = useResponsive()
  return (
    <Flex alignItems="center" justifyContent="start" sx={{ gap: [1, 2], position: 'relative' }}>
      <AccountInfo
        isOpenPosition={data.isOpenPosition}
        address={data.account}
        protocol={data.protocol}
        note={data.note}
        size={sm ? 40 : 28}
      />
      {additionalComponent ? additionalComponent : null}
    </Flex>
  )
}

export const myTradersTableSettings: TableSettingsProps<MyCopyTraderData> = [
  {
    style: {
      minWidth: '180px',
    },
    label: <Box textAlign="left">Account</Box>,
    visible: true,
    id: 'account',
    freezeLeft: 180,
    freezeIndex: 3,
    render: (item) => <MyCopyAccountCell data={item} />,
  },
  {
    style: { minWidth: ['110px', '140px'] },
    label: <Trans>Last Trade</Trans>,
    unit: 'd',
    visible: true,
    id: 'lastTradeAt',
    render: (item) => {
      return <Type.Caption>{item.lastTradeAt ? formatLocalRelativeDate(item.lastTradeAt) : '--'}</Type.Caption>
    },
  },
  {
    style: { minWidth: ['100px', '120px'] },
    label: <Trans>7D PnL</Trans>,
    unit: '$',
    sortBy: 'pnl7D',
    visible: true,
    id: 'pnl7D',
    render: (item) => <SignedText value={item.pnl7D} maxDigit={2} minDigit={2} prefix="$" />,
  },
  {
    style: { minWidth: ['100px', '120px'] },
    label: <Trans>30D PnL</Trans>,
    unit: '$',
    sortBy: 'pnl30D',
    visible: true,
    id: 'pnl30D',
    render: (item) => <SignedText value={item.pnl30D} maxDigit={2} minDigit={2} prefix="$" />,
  },
  {
    style: { minWidth: ['100px', '120px'] },
    label: <Trans>PnL</Trans>,
    unit: '$',
    sortBy: 'pnl',
    visible: true,
    id: 'pnl',
    render: (item) => <SignedText value={item.pnl} maxDigit={2} minDigit={2} prefix="$" />,
  },
  {
    style: { minWidth: ['100px', '111px'] },
    label: <Trans>Platform</Trans>,
    visible: true,
    id: 'exchange',
    render: (item) => <Type.Caption>{PLATFORM_TRANS[item.exchange]}</Type.Caption>,
  },
]

export function MyCopyAccountCell({ data }: { data: MyCopyTraderData }) {
  // const lastTradeDuration = dayjs().diff(data.lastTradeAt, 'd')
  const { sm } = useResponsive()
  return (
    <Flex alignItems="center" justifyContent="start" sx={{ gap: [1, 2], position: 'relative' }}>
      <AccountInfo isOpenPosition={false} address={data.account} protocol={data.protocol} size={sm ? 40 : 28} />
      <FavoriteButton address={data.account} size={16} />
    </Flex>
  )
}
