import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { getFieldOptionLabels, getFieldOptions } from 'components/@widgets/ConditionFilterForm/helpers'
import { TraderData } from 'entities/trader'
import { rankingFieldOptions } from 'utils/config/options'

export const defaultFieldOptions = getFieldOptions<TraderData>(tableSettings)
export const defaultFieldOptionLabels = getFieldOptionLabels(defaultFieldOptions)

export const rankingFieldOptionLabels = getFieldOptionLabels(rankingFieldOptions)

export enum FilterTabEnum {
  DEFAULT = 'default',
  RANKING = 'ranking',
}
