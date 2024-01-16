import { getFieldOptionLabels, getFieldOptions } from 'components/ConditionFilterForm/helpers'
import { tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'
import { rankingFieldOptions } from 'utils/config/options'

export const defaultFieldOptions = getFieldOptions<TraderData>(tableSettings)
export const defaultFieldOptionLabels = getFieldOptionLabels(defaultFieldOptions)

export const rankingFieldOptionLabels = getFieldOptionLabels(rankingFieldOptions)

export enum FilterTabEnum {
  DEFAULT = 'default',
  RANKING = 'ranking',
}
