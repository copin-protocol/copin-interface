import { ExplorerPermission, ProtocolPermission } from 'entities/permission'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import { ExternalTraderListSource, TableSettings } from './TraderExplorerTableView/types'

export function getColumnRequiredPlan<T>({
  columnData,
  explorerPermission,
}: {
  columnData: TableSettings<T, ExternalTraderListSource>
  explorerPermission: ExplorerPermission | undefined
}) {
  return getRequiredPlan({
    conditionFn: (plan) => !!explorerPermission?.[plan]?.fieldsAllowed?.includes?.(columnData.id as string),
  })
}

export function getProtocolRequiredPlan({
  protocol,
  protocolPermission,
}: {
  protocol: ProtocolEnum
  protocolPermission: ProtocolPermission | undefined
}) {
  return getRequiredPlan({
    conditionFn: (plan) => !!protocolPermission?.[plan]?.protocolAllowed?.includes?.(protocol),
  })
}

export const PERMISSION_TOOLTIP_ID_PREFIX = 'trader_explorer_required_plan_'

export function getPermissionTooltipId({ requiredPlan }: { requiredPlan: SubscriptionPlanEnum }) {
  return `${PERMISSION_TOOLTIP_ID_PREFIX}${requiredPlan}`
}
