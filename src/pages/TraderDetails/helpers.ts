import { TraderProfilePermission, TraderProfilePermissionConfig } from 'entities/permission'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

export function getSectionRequiredPlan({
  section,
  traderProfilePermission,
}: {
  section: keyof TraderProfilePermissionConfig
  traderProfilePermission: TraderProfilePermission
}) {
  return getRequiredPlan({
    conditionFn: (plan) => !!traderProfilePermission[plan][section],
  })
}

export function getUnlimitedPositionHistoryRequiredPlan({
  traderProfilePermission,
}: {
  traderProfilePermission: TraderProfilePermission
}) {
  return getRequiredPlan({
    conditionFn: (plan) =>
      traderProfilePermission[plan].isEnablePosition && traderProfilePermission[plan].maxPositionHistory === 0,
  })
}
