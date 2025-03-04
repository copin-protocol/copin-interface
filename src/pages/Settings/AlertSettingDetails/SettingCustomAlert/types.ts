import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { TimeFilterByEnum } from 'utils/config/enums'

export interface CustomAlertFormValues {
  name?: string
  description?: string
  type?: TimeFilterByEnum
  protocols?: string[]
  pairs?: string[]
  condition?: ConditionFormValues<TraderData>
}
