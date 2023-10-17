import { Trans } from '@lingui/macro'

import { getFieldOptionLabels, getFieldOptions } from 'components/ConditionFilterForm/helpers'
import { FieldOption } from 'components/ConditionFilterForm/types'
import { tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'

export const defaultFieldOptions = getFieldOptions<TraderData>(tableSettings)
export const defaultFieldOptionLabels = getFieldOptionLabels(defaultFieldOptions)

const rankingFieldsBase: FieldOption<TraderData>[] = [
  // runTimeDays: '$gt',
  {
    value: 'runTimeDays',
    label: <Trans>Top Runtime (All)</Trans>,
  },
  // profit: '$gt',
  {
    value: 'profit',
    label: <Trans>Top PNL</Trans>,
  },
  // totalGain: '$gt',
  {
    value: 'totalGain',
    label: <Trans>Top Total Gain</Trans>,
  },
  // totalLoss: '$lt',
  {
    value: 'totalLoss',
    label: <Trans>Low Total Loss</Trans>,
  },
  // avgVolume: '$gt',
  {
    value: 'avgVolume',
    label: <Trans>Top Avg Volume</Trans>,
  },
  // avgRoi: '$gt',
  {
    value: 'avgRoi',
    label: <Trans>Top Avg ROI</Trans>,
  },
  // minRoi: '$gt',
  {
    value: 'minRoi',
    label: <Trans>Top Min Roi</Trans>,
  },
  // maxRoi: '$gt',
  {
    value: 'maxRoi',
    label: <Trans>Top Max Roi</Trans>,
  },
  // totalTrade: '$gt',
  {
    value: 'totalTrade',
    label: <Trans>Top Total Trade</Trans>,
  },
  // totalWin: '$gt',
  {
    value: 'totalWin',
    label: <Trans>Top Total Win</Trans>,
  },
  // totalLose: '$gt', need to check
  {
    value: 'totalLose',
    label: <Trans>Low Total Lose</Trans>,
  },
  //  winRate: '$gt',
  {
    value: 'winRate',
    label: <Trans>Top Win Rate</Trans>,
  },
  {
    value: 'profitRate',
    label: <Trans>Top Profit Rate</Trans>,
  },
  // winLoseRatio: '$gt',
  {
    value: 'winLoseRatio',
    label: <Trans>Top PnL Ratio</Trans>,
  },
  // orderPositionRatio: '$lt',
  {
    value: 'orderPositionRatio',
    label: <Trans>Low Order/Pos Ratio</Trans>,
  },
  // profitLossRatio: '$gt',
  {
    value: 'profitLossRatio',
    label: <Trans>Top PnL Ratio</Trans>,
  },
  // gainLossRatio: '$gt',
  {
    value: 'gainLossRatio',
    label: <Trans>Top Profit Factor</Trans>,
  },
  // avgDuration: '$lt',
  {
    value: 'avgDuration',
    label: <Trans>Low Avg Duration</Trans>,
  },
  // maxDuration: '$lt',
  {
    value: 'maxDuration',
    label: <Trans>Low Max Duration</Trans>,
  },
  // minDuration: '$lt',
  {
    value: 'minDuration',
    label: <Trans>Low Min Duration</Trans>,
  },
  // maxDrawDownPnl: '$gt',
  {
    value: 'maxDrawDownPnl',
    label: <Trans>Low Max Drawdown PnL</Trans>,
  },
  // maxDrawDownRoi: '$gt',
  {
    value: 'maxDrawDownRoi',
    label: <Trans>Low Max Drawdown</Trans>,
  },
]
export const rankingFieldOptions = rankingFieldsBase.map((setting) => {
  const newSetting = { ...setting }
  newSetting.unit = '%'
  newSetting.default = {
    conditionType: 'gte',
    gte: 60,
  }
  return newSetting
})

export const rankingFieldOptionLabels = getFieldOptionLabels(rankingFieldOptions)

export enum FilterTabEnum {
  DEFAULT = 'default',
  RANKING = 'ranking',
}
