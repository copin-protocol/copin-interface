import { Trans } from '@lingui/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import MarketGroup from 'components/@ui/MarketGroup'
import TraderLabels from 'components/@ui/TraderLabels'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import FavoriteEditButton from 'components/@widgets/FavoriteButton/FavoriteEditButton'
import FavoriteRemoveButton from 'components/@widgets/FavoriteButton/FavoriteRemoveButton'
import { PnlTitle, PnlTitleWithTooltip } from 'components/@widgets/SwitchPnlButton'
import { TraderData } from 'entities/trader.d'
import CopyButton from 'theme/Buttons/CopyButton'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { LABEL_TOOLTIP_TRANSLATION, LABEL_TRANSLATION } from 'utils/config/translations'
import { compactNumber, formatDuration, formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

import { AccountCell, AccountCellMobile } from './AccountCell'
import { LoadingChartExplorer } from './ChartExplorer'
import Text from './Text'
import { ExternalTraderListSource, TableSettings, TableSettingsProps } from './types'

export const emptyColumn = {
  style: {
    minWidth: '10px',
    display: 'table-cell !important',
  },
  text: '',
  label: <div />,
  visible: true,
  id: 'emptyColumn',
  render: () => <div />,
} as unknown as TableSettings<TraderData, any>

const columnsMapping: { [key in keyof TraderData]?: TableSettings<TraderData, ExternalTraderListSource> } = {
  account: {
    style: {
      minWidth: '216px',
      pr: '0 !important',
    },
    text: 'Account',
    searchText: 'Account',
    label: (
      <Box textAlign="left" className="account-label" pl={3}>
        <Trans>Account</Trans>
      </Box>
    ),
    visible: true,
    id: 'account',
    freezeLeft: 216,
    freezeIndex: 3,
    render: (item, _, externalSource) => {
      let additionalComponent = null
      if (externalSource?.dataView === 'BOOKMARK') {
        additionalComponent = (
          <Flex alignItems="center" sx={{ gap: 2, ml: 2 }}>
            <FavoriteEditButton address={item.account} protocol={item.protocol} size={16} isEditInGroup />
            <FavoriteRemoveButton address={item.account} protocol={item.protocol} size={16} />
          </Flex>
        )
      } else {
        additionalComponent = (
          <Flex alignItems="center" sx={{ gap: 2, ml: 2 }}>
            <CopyButton
              type="button"
              variant="ghost"
              value={item.account}
              size={16}
              sx={{ color: 'neutral3', p: 0 }}
              iconSize={16}
              className={'hiding-btn'}
            ></CopyButton>
            <FavoriteButton address={item.account} protocol={item.protocol} size={16} />
          </Flex>
        )
      }
      return (
        <Box pl={3}>
          <AccountCell data={item} additionalComponent={additionalComponent} />
        </Box>
      )
    },
  },
  runTimeDays: {
    style: { minWidth: ['140px', '150px'] },
    text: <Trans>Runtime (All)</Trans>,
    searchText: 'Runtime All',
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
  labels: {
    style: { minWidth: '200px', width: '200px' },
    text: <Trans>Labels</Trans>,
    searchText: 'Labels',
    label: (
      <LabelWithTooltip id="tt_labels_label" tooltip="Auto tags based on trading behavior and performance.">
        Labels
      </LabelWithTooltip>
    ),
    visible: true,
    filter: {
      conditionType: 'in',
      in: [],
    },
    id: 'labels',
    render: (item) => {
      if (!item.labels || item.labels.length === 0)
        return (
          <Flex height={56} alignItems="center" justifyContent="end">
            <Type.Caption color="neutral3">--</Type.Caption>
          </Flex>
        )
      // sort, item have TIER in name go first
      const labels = item.labels
        .sort((a, b) => {
          if (a.includes('TIER')) return -1
          if (b.includes('TIER')) return 1
          return 0
        })
        .map((label) => {
          return {
            key: label,
            title: LABEL_TRANSLATION[label as keyof typeof LABEL_TRANSLATION],
            tooltip: LABEL_TOOLTIP_TRANSLATION[label as keyof typeof LABEL_TOOLTIP_TRANSLATION],
          }
        })
      return (
        <Flex sx={{ gap: 1, flexWrap: 'wrap', py: 2, justifyContent: 'end', height: 56, alignItems: 'center' }}>
          <TraderLabels labels={labels} showedItems={3} />
        </Flex>
      )
    },
  },
  ifLabels: {
    style: { minWidth: '220px', width: '220px' },
    text: 'IF Labels',
    searchText: 'IF Labels',
    label: (
      <LabelWithTooltip id="tt_if_labels_label" tooltip="Labels that FM flagged">
        IF Tags
      </LabelWithTooltip>
    ),
    visible: true,
    filter: {
      conditionType: 'in',
      in: [],
    },
    id: 'ifLabels',
    render: (item) => {
      if (!item.ifLabels || item.ifLabels.length === 0)
        return (
          <Flex height={56} alignItems="center" justifyContent="end">
            <Type.Caption color="neutral3">--</Type.Caption>
          </Flex>
        )
      const labels = item.ifLabels.map((label) => {
        return {
          key: label,
          title: label,
        }
      })
      return (
        <Flex
          sx={{
            gap: 1,
            flexWrap: 'wrap',
            py: 2,
            justifyContent: ['start', 'end'],
            height: ['auto', 56],
            alignItems: 'center',
          }}
        >
          <TraderLabels labels={labels} showedItems={3} shouldShowTooltip={false} isIF />
        </Flex>
      )
    },
  },
  ifGoodMarkets: {
    style: { minWidth: '180px', width: '180px' },
    text: 'Good Markets',
    searchText: 'Good Markets',
    label: (
      <LabelWithTooltip id="tt_if_good_markets_label" tooltip="Good Markets">
        Good Markets
      </LabelWithTooltip>
    ),
    visible: true,
    filter: {
      conditionType: 'in',
      in: [],
    },
    id: 'ifGoodMarkets',
    render: (item) => {
      if (!item.ifGoodMarkets || item.ifGoodMarkets.length === 0)
        return (
          <Flex height={56} alignItems="center" justifyContent="end">
            <Type.Caption color="neutral3">--</Type.Caption>
          </Flex>
        )
      const labels = item.ifGoodMarkets.map((label) => {
        return {
          key: label,
          title: label,
        }
      })
      return (
        <Flex
          sx={{
            gap: 1,
            flexWrap: 'wrap',
            py: 2,
            justifyContent: ['start', 'end'],
            height: ['auto', 56],
            alignItems: 'center',
          }}
        >
          <TraderLabels labels={labels} showedItems={3} shouldShowTooltip={false} isPositive />
        </Flex>
      )
    },
  },
  ifBadMarkets: {
    style: { minWidth: '180px', width: '180px' },
    text: 'Bad Markets',
    searchText: 'Bad Markets',
    label: (
      <LabelWithTooltip id="tt_if_bad_markets_label" tooltip="Bad Markets">
        Bad Markets
      </LabelWithTooltip>
    ),
    visible: true,
    filter: {
      conditionType: 'in',
      in: [],
    },
    id: 'ifBadMarkets',
    render: (item) => {
      if (!item.ifBadMarkets || item.ifBadMarkets.length === 0)
        return (
          <Flex height={56} alignItems="center" justifyContent="end">
            <Type.Caption color="neutral3">--</Type.Caption>
          </Flex>
        )
      const labels = item.ifBadMarkets.map((label) => {
        return {
          key: label,
          title: label,
        }
      })
      return (
        <Flex
          sx={{
            gap: 1,
            flexWrap: 'wrap',
            py: 2,
            justifyContent: ['start', 'end'],
            height: ['auto', 56],
            alignItems: 'center',
          }}
        >
          <TraderLabels labels={labels} showedItems={3} shouldShowTooltip={false} isPositive={false} />
        </Flex>
      )
    },
  },
  pnlStatistics: {
    style: { minWidth: ['120px', '150px'], textAlign: 'right' },
    text: <Trans>Pnl Overtime</Trans>,
    label: (
      <LabelWithTooltip id="tt_runtime_label" tooltip="Trader's PnL trend over time">
        Pnl Overtime
      </LabelWithTooltip>
    ),
    visible: true,
    id: 'pnlStatistics',
    render: (item) => (
      <Flex justifyContent="flex-end">
        <LoadingChartExplorer traderData={item} />
      </Flex>
    ),
  },
  lastTradeAtTs: {
    style: { minWidth: ['110px', '140px'] },
    text: <Trans>Last Trade</Trans>,
    searchText: 'Last Trade',
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
      return <Type.Caption>{item.lastTradeAtTs ? formatLocalRelativeDate(item.lastTradeAtTs) : '--'}</Type.Caption>
    },
  },
  indexTokens: {
    style: { minWidth: ['100px', '120px'] },
    text: <Trans>Markets</Trans>,
    searchText: 'Markets',
    label: (
      <LabelWithTooltip
        id="tt_market_label"
        tooltip="These are the markets that traders have been active in during this period."
      >
        Markets
      </LabelWithTooltip>
    ),
    visible: true,
    filter: {
      conditionType: 'in',
      in: [],
    },
    id: 'indexTokens',
    render: (item, _, externalSource) => {
      return (
        <MarketGroup
          protocol={item.protocol}
          indexTokens={item.indexTokens}
          sx={{ justifyContent: externalSource?.isMarketsLeft ? 'flex-start' : 'flex-end' }}
        />
      )
    },
  },
  pnl: {
    style: { minWidth: ['100px', '120px'] },
    text: <PnlTitle type="lower" color="inherit" />,
    searchText: 'PnL',
    label: <PnlTitleWithTooltip type="lower" />,
    unit: '$',
    sortBy: 'pnl',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'pnl',
    render: (item) => <SignedText value={item.pnl} maxDigit={0} prefix="$" />,
  },
  unrealisedPnl: {
    style: { minWidth: ['130px', '150px'] },
    text: <Trans>Unrealized PnL</Trans>,
    searchText: 'Unrealized PnL',
    label: (
      <LabelWithTooltip
        id="tt_unrealised_pnl_label"
        tooltip="The overall profit or loss without fees generated from the opening positions"
      >
        Unrealized PnL
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'unrealisedPnl',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'unrealisedPnl',
    render: (item) => <SignedText value={item.unrealisedPnl} maxDigit={0} prefix="$" />,
  },
  totalGain: {
    searchText: 'Total Gain',
    style: { minWidth: ['120px', '131px'] },
    text: <Trans>Total Gain</Trans>,
    label: (
      <LabelWithTooltip id="tt_total_gain_label" tooltip="The cumulative gain without fees made from all trades">
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
  totalLoss: {
    style: { minWidth: ['120px', '131px'] },
    text: <Trans>Total Loss</Trans>,
    searchText: 'Total Loss',
    label: (
      <LabelWithTooltip id="tt_total_loss_label" tooltip="The cumulative loss without fees incurred from all trades">
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
  totalFee: {
    style: { minWidth: ['155px', '160px'] },
    text: <Trans>Total Paid Fees</Trans>,
    searchText: 'Total Paid Fees',
    label: (
      <LabelWithTooltip id="tt_total_fees_label" tooltip="The cumulative paid fees incurred from all trades">
        Total Paid Fees
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalFee',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'totalFee',
    render: (item) => <SignedText value={item.totalFee} maxDigit={0} neg prefix="$" />,
  },
  totalVolume: {
    style: { minWidth: ['130px', '140px'] },
    text: <Trans>Total Volume</Trans>,
    searchText: 'Total Volume',
    label: (
      <LabelWithTooltip id="tt_total_volume_label" tooltip="The cumulative trading volume from all trades">
        Total Volume
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalVolume',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100000,
    },
    id: 'totalVolume',
    render: (item) => <Text text={item.totalVolume ? `$${formatNumber(item.totalVolume, 0, 0)}` : undefined} />,
  },
  avgVolume: {
    style: { minWidth: ['120px', '130px'] },
    text: <Trans>Avg Volume</Trans>,
    searchText: 'Avg Volume',
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
  avgRoi: {
    style: { minWidth: '92px' },
    text: <Trans>Avg ROI</Trans>,
    searchText: 'Avg ROI',
    label: (
      <LabelWithTooltip
        id="tt_roi_label"
        tooltip="The average percentage gain or loss without fees is calculated based on the average ROI of closed positions"
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
    render: (item) => <SignedText value={item.avgRoi} maxDigit={2} minDigit={2} suffix="%" />,
  },
  maxRoi: {
    style: { minWidth: '110px' },
    text: <Trans>Max ROI</Trans>,
    searchText: 'Max ROI',
    label: (
      <LabelWithTooltip
        id="tt_max_roi_label"
        tooltip="The maximum percentage of gain or loss without fees in closed positions"
      >
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
    render: (item) => <SignedText value={item.maxRoi} maxDigit={2} minDigit={2} suffix="%" />,
  },
  totalTrade: {
    style: { minWidth: '105px' },
    text: <Trans>Trades</Trans>,
    searchText: 'Trades',
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
  totalWin: {
    style: { minWidth: '90px' },
    text: <Trans>Wins</Trans>,
    label: (
      <LabelWithTooltip id="tt_wins_label" tooltip="The total number of winning trades">
        Wins
      </LabelWithTooltip>
    ),
    sortBy: 'totalWin',
    searchText: 'Wins',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 5,
    },
    id: 'totalWin',
    render: (item) => <Text text={item.totalWin} />,
  },
  totalLose: {
    style: { minWidth: '95px' },
    text: <Trans>Loses</Trans>,
    searchText: 'Loses',
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
  totalLiquidation: {
    style: { minWidth: '145px' },
    text: <Trans>Liquidations</Trans>,
    searchText: 'Liquidations',
    label: (
      <LabelWithTooltip id="tt_liquidations_label" tooltip="The total number of liquidated trades">
        Liquidations
      </LabelWithTooltip>
    ),
    sortBy: 'totalLiquidation',
    visible: false,
    filter: {
      conditionType: 'lte',
      lte: 0,
    },
    id: 'totalLiquidation',
    render: (item) => <Text text={item.totalLiquidation} />,
  },
  winRate: {
    style: { minWidth: '120px' },
    text: <Trans>Win Rate</Trans>,
    searchText: 'Win rate',
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
    render: (item) => <Text text={item.winRate ? `${formatNumber(item.winRate, 2, 2)}%` : undefined} />,
  },
  profitRate: {
    style: { minWidth: ['130px', '140px'] },
    text: <Trans>Profit Rate</Trans>,
    searchText: 'Profit rate',
    label: (
      <LabelWithTooltip
        id="tt_profit_rate_label"
        tooltip="The percentage of profit without fees made relative to the total investment"
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
    render: (item) => <Text text={item.profitRate ? `${formatNumber(item.profitRate, 2, 2)}%` : undefined} />,
  },
  longRate: {
    style: { minWidth: ['120px', '130px'] },
    text: <Trans>L/S Rate</Trans>,
    searchText: 'L/S rate',
    label: (
      <LabelWithTooltip id="tt_ls_ratio_label" tooltip="The percentage of Long/Short trades out of the total trades">
        L/S Rate
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'longRate',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 50,
    },
    id: 'longRate',
    render: (item) =>
      item.longRate == null ? (
        '--'
      ) : (
        <Flex flexDirection="column" width="100%" alignItems="flex-end">
          <ProgressBar percent={item.longRate} color="green2" bg="red2" sx={{ width: '90%' }} />
          <Flex alignItems="center" justifyContent="space-between" sx={{ width: '90%' }}>
            <Type.Small color="green2">{compactNumber(item.longRate, 0)}%</Type.Small>
            <Type.Small color="red2">{compactNumber(100 - item.longRate, 0)}%</Type.Small>
          </Flex>
        </Flex>
      ),
  },
  orderPositionRatio: {
    style: { minWidth: ['160px', '180px'] },
    text: <Trans>Order/Pos Ratio</Trans>,
    searchText: 'Order/Pos Ratio',
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
  profitLossRatio: {
    style: { minWidth: ['110px', '125px'] },
    text: <Trans>PnL Ratio</Trans>,
    searchText: 'PnL Ratio',
    label: (
      <LabelWithTooltip
        id="tt_pnl_ratio_label"
        tooltip="The ratio of profit and loss without fees in relation to the total investment"
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
  gainLossRatio: {
    style: { minWidth: ['140px', '156px'] },
    text: <Trans>Profit Factor</Trans>,
    searchText: 'Profit Factor',
    label: (
      <LabelWithTooltip id="tt_profit_factor_label" tooltip="The ratio of total profit to total loss without fees">
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
  avgLeverage: {
    style: { minWidth: ['145px', '165px'] },
    text: <Trans>Avg Leverage</Trans>,
    searchText: 'Avg Leverage',
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
  maxLeverage: {
    style: { minWidth: ['145px', '165px'] },
    text: <Trans>Max Leverage</Trans>,
    label: <Trans>Max Leverage</Trans>,
    searchText: 'Max Leverage',
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
  minLeverage: {
    style: { minWidth: ['145px', '165px'] },
    text: <Trans>Min Leverage</Trans>,
    label: <Trans>Min Leverage</Trans>,
    searchText: 'Min Leverage',
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
  avgDuration: {
    style: { minWidth: ['140px', '152px'] },
    text: <Trans>Avg Duration</Trans>,
    searchText: 'Avg Duration',
    label: (
      <LabelWithTooltip
        id="tt_avg_duration_label"
        tooltip="The average duration of trades (d: days | h: hours | m: minutes | s: seconds)"
      >
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
    render: (item) => <Text text={formatDuration(item.avgDuration)} />,
  },
  minDuration: {
    style: { minWidth: ['140px', '152px'] },
    text: <Trans>Min Duration</Trans>,
    searchText: 'Min Duration',
    label: (
      <LabelWithTooltip
        id="tt_min_duration_label"
        tooltip="The minimum duration of a trade (d: days | h: hours | m: minutes | s: seconds)"
      >
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
    render: (item) => <Text text={formatDuration(item.minDuration)} />,
  },
  maxDuration: {
    style: { minWidth: ['140px', '155px'] },
    text: <Trans>Max Duration</Trans>,
    searchText: 'Max Duration',
    label: (
      <LabelWithTooltip
        id="tt_max_duration_label"
        tooltip="The maximum duration of a trade (d: days | h: hours | m: minutes | s: seconds)"
      >
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
    render: (item) => <Text text={formatDuration(item.maxDuration)} />,
  },
  maxDrawdown: {
    style: { minWidth: ['150px', '150px'] },
    text: <Trans>Max Drawdown</Trans>,
    searchText: 'Max Drawdown',
    label: (
      <LabelWithTooltip
        id="tt_max_drawdown_label"
        tooltip="The maximum percentage decline in account value from its peak"
      >
        Max Drawdown
      </LabelWithTooltip>
    ),
    unit: '%',
    sortBy: 'maxDrawdown',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: -30,
    },
    id: 'maxDrawdown',
    render: (item) => <SignedText value={item.maxDrawdown} maxDigit={2} minDigit={2} neg suffix="%" />,
  },

  maxDrawdownPnl: {
    style: { minWidth: ['160px', '175px'] },
    text: <Trans>Max Drawdown PnL</Trans>,
    searchText: 'Max Drawdown PnL',
    label: (
      <LabelWithTooltip
        id="tt_max_drawdown_pnl_label"
        tooltip="The maximum dollar value loss experienced from the peak account value"
      >
        Max Drawdown PnL
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'maxDrawdownPnl',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: -100,
    },
    id: 'maxDrawdownPnl',
    render: (item) => <SignedText value={item.maxDrawdownPnl} maxDigit={0} neg prefix="$" />,
  },
  sharpeRatio: {
    style: { minWidth: '120px' },
    text: <Trans>Sharpe Ratio</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_sharpe_ratio_label"
        tooltip="The risk-adjusted return of a trader's performance, indicating how much return they generate for each unit of risk taken"
      >
        Sharpe Ratio
      </LabelWithTooltip>
    ),
    sortBy: 'sharpeRatio',
    searchText: 'Sharpe Ratio',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 1,
    },
    id: 'sharpeRatio',
    render: (item) => <Text text={formatNumber(item.sharpeRatio, 2, 2)} />,
  },
  sortinoRatio: {
    style: { minWidth: '130px' },
    text: <Trans>Sortino Ratio</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_sortino_ratio_label"
        tooltip="The risk-adjusted return of a trader's performance, indicating how much return they generate for each unit of downside risk taken"
      >
        Sortino Ratio
      </LabelWithTooltip>
    ),
    sortBy: 'sortinoRatio',
    searchText: 'Sortino Ratio',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 1,
    },
    id: 'sortinoRatio',
    render: (item) => <Text text={formatNumber(item.sortinoRatio, 2, 2)} />,
  },
  winStreak: {
    style: { minWidth: '120px' },
    text: <Trans>Win Streak</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_win_streak_label"
        tooltip="The number of consecutive winning trades currently in progress"
      >
        Win Streak
      </LabelWithTooltip>
    ),
    sortBy: 'winStreak',
    searchText: 'Win Streak',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 3,
    },
    id: 'winStreak',
    render: (item) => <Text text={formatNumber(item.winStreak)} />,
  },
  loseStreak: {
    style: { minWidth: '120px' },
    text: <Trans>Lose Streak</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_lose_streak_label"
        tooltip="The number of consecutive losing trades currently in progress"
      >
        Lose Streak
      </LabelWithTooltip>
    ),
    sortBy: 'loseStreak',
    searchText: 'Lose Streak',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 3,
    },
    id: 'loseStreak',
    render: (item) => <Text text={formatNumber(item.loseStreak)} />,
  },
  maxWinStreak: {
    style: { minWidth: '140px' },
    text: <Trans>Max Win Streak</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_max_win_streak_label"
        tooltip="The longest consecutive winning streak ever achieved by the trader in the past"
      >
        Max Win Streak
      </LabelWithTooltip>
    ),
    sortBy: 'maxWinStreak',
    searchText: 'Max Win Streak',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 3,
    },
    id: 'maxWinStreak',
    render: (item) => <Text text={formatNumber(item.maxWinStreak)} />,
  },
  maxLoseStreak: {
    style: { minWidth: '140px' },
    text: <Trans>Max Lose Streak</Trans>,
    label: (
      <LabelWithTooltip
        id="tt_max_lose_streak_label"
        tooltip="The longest consecutive losing streak ever achieved by the trader in the past"
      >
        Max Lose Streak
      </LabelWithTooltip>
    ),
    sortBy: 'maxLoseStreak',
    searchText: 'Max Lose Streak',
    visible: false,
    filter: {
      conditionType: 'gte',
      gte: 3,
    },
    id: 'maxLoseStreak',
    render: (item) => <Text text={formatNumber(item.maxLoseStreak)} />,
  },
  totalLongVolume: {
    style: { minWidth: '150px' },
    text: <Trans>Total Long Volume</Trans>,
    searchText: 'Total Long Volume',
    label: (
      <LabelWithTooltip id="tt_total_long_volume_label" tooltip="The cumulative trading volume from long trades">
        Total Long Volume
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalLongVolume',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100000,
    },
    id: 'totalLongVolume',
    render: (item) => <Text text={item.totalLongVolume ? `$${formatNumber(item.totalLongVolume, 0, 0)}` : undefined} />,
  },
  totalShortVolume: {
    style: { minWidth: '160px' },
    text: <Trans>Total Short Volume</Trans>,
    searchText: 'Total Short Volume',
    label: (
      <LabelWithTooltip id="tt_total_short_volume_label" tooltip="The cumulative trading volume from short trades">
        Total Short Volume
      </LabelWithTooltip>
    ),
    unit: '$',
    sortBy: 'totalShortVolume',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100000,
    },
    id: 'totalShortVolume',
    render: (item) => (
      <Text text={item.totalShortVolume ? `$${formatNumber(item.totalShortVolume, 0, 0)}` : undefined} />
    ),
  },
  longPnl: {
    style: { minWidth: ['130px', '150px'] },
    text: <PnlTitle type="lower" direction="long" color="inherit" />,
    searchText: 'Long PnL',
    label: <PnlTitleWithTooltip type="lower" direction="long" />,
    unit: '$',
    sortBy: 'longPnl',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'longPnl',
    render: (item) => <SignedText value={item.longPnl} maxDigit={0} prefix="$" />,
  },
  shortPnl: {
    style: { minWidth: ['130px', '150px'] },
    text: <PnlTitle type="lower" direction="short" color="inherit" />,
    searchText: 'Short PnL',
    label: <PnlTitleWithTooltip type="lower" direction="short" />,
    unit: '$',
    sortBy: 'shortPnl',
    visible: true,
    filter: {
      conditionType: 'gte',
      gte: 100,
    },
    id: 'shortPnl',
    render: (item) => <SignedText value={item.shortPnl} maxDigit={0} prefix="$" />,
  },
}

const tableColumnKeys: (keyof TraderData)[] = [
  'account',
  'runTimeDays',
  'pnlStatistics',
  'lastTradeAtTs',
  'ifLabels',
  'ifGoodMarkets',
  'ifBadMarkets',
  'labels',
  'indexTokens',
  'pnl',
  'unrealisedPnl',
  'longPnl',
  'shortPnl',
  'totalGain',
  'totalLoss',
  'totalFee',
  'totalVolume',
  'totalLongVolume',
  'totalShortVolume',
  'avgVolume',
  'totalTrade',
  'totalWin',
  'totalLose',
  'totalLiquidation',
  'winStreak',
  'loseStreak',
  'maxWinStreak',
  'maxLoseStreak',
  'winRate',
  'profitRate',
  'avgRoi',
  'maxRoi',
  'longRate',
  'sharpeRatio',
  'sortinoRatio',
  'orderPositionRatio',
  'profitLossRatio',
  'gainLossRatio',
  'avgLeverage',
  'maxLeverage',
  'minLeverage',
  'avgDuration',
  'minDuration',
  'maxDuration',
  'maxDrawdown',
  'maxDrawdownPnl',
]
export const tableSettings: TableSettingsProps<TraderData> = tableColumnKeys
  .map((key) => columnsMapping[key]!)
  .filter((data) => !!data)

export const tableSettingsWithoutPnlStatistics: TableSettingsProps<TraderData> = tableColumnKeys
  .map((key) => columnsMapping[key]!)
  .filter((data) => !!data && data.id !== 'pnlStatistics')

const mobileTableColumnKeys: (keyof TraderData)[] = [
  'account',
  'labels',
  'pnl',
  'winRate',
  'unrealisedPnl',
  'avgRoi',
  'runTimeDays',
  'lastTradeAtTs',
  'ifLabels',
  'ifGoodMarkets',
  'ifBadMarkets',
  'indexTokens',
  'totalGain',
  'totalLoss',
  'totalFee',
  'totalVolume',
  'avgVolume',
  'maxRoi',
  'totalTrade',
  'totalWin',
  'totalLose',
  'totalLiquidation',
  'profitRate',
  'pnlStatistics',
  'longRate',
  'orderPositionRatio',
  'profitLossRatio',
  'gainLossRatio',
  'avgLeverage',
  'maxLeverage',
  'minLeverage',
  'avgDuration',
  'minDuration',
  'maxDuration',
  'maxDrawdown',
  'maxDrawdownPnl',
]
export const mobileTableSettings: TableSettingsProps<TraderData> = [
  {
    style: {
      minWidth: '180px',
    },
    text: 'Account',
    searchText: 'Account',
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
      <AccountCellMobile
        data={item}
        additionalComponent={<FavoriteButton address={item.account} protocol={item.protocol} size={16} />}
      />
    ),
  },
  ...mobileTableColumnKeys
    .slice(1)
    .map((key) => columnsMapping[key]!)
    .filter((data) => !!data)
    .map((data) => {
      const newData = { ...data }
      if (newData.id === 'longRate') {
        newData.render = (item) =>
          item.longRate == null ? (
            '--'
          ) : (
            <Flex flexDirection="column" width="100%" alignItems="start">
              <ProgressBar percent={item.longRate} color="green2" bg="red2" sx={{ width: '90%' }} />
              <Flex alignItems="center" justifyContent="space-between" sx={{ width: '90%' }}>
                <Type.Small color="green2">{compactNumber(item.longRate, 0)}%</Type.Small>
                <Type.Small color="red2">{compactNumber(100 - item.longRate, 0)}%</Type.Small>
              </Flex>
            </Flex>
          )
        return newData
      }
      return data
    }),
]
