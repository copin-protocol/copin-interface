import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import { AlertCustomType, SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'

export interface CustomAlertFormValues {
  name?: string
  description?: string
  type?: TimeFilterByEnum
  protocols?: string[]
  pairs?: string[]
  condition?: ConditionFormValues<TraderData>
  customType?: AlertCustomType
  traderGroupAdd?: TraderAlertData[]
  traderGroupUpdate?: TraderAlertData[]
  traderGroupRemove?: TraderAlertData[]
}

export interface CustomHeaderProps {
  isNew?: boolean
  hasChange: boolean
  customType: AlertCustomType
  total?: number
  limit?: number
  name?: string
  userNextPlan?: SubscriptionPlanEnum
  description?: string
  setName: (value?: string) => void
  setDescription: (value?: string) => void
  onBack: () => void
}
