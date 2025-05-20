import { useMemo } from 'react'

import { DataPermissionConfig, ExplorerPermission } from 'entities/permission'
import { SubscriptionPermission, SubscriptionPlanEnum } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useExplorerPermission() {
  const { userPermission, pagePermission, myProfile } = useGetSubscriptionPermission<
    ExplorerPermission,
    DataPermissionConfig
  >({
    section: SubscriptionPermission.TRADER_EXPLORER,
  })
  const fieldsAllowed = useMemo(() => userPermission?.fieldsAllowed ?? [], [userPermission?.fieldsAllowed])
  const protocolsAllowed = useMemo(() => userPermission?.protocol ?? [], [userPermission?.protocol])
  const isEliteUser = myProfile?.plan === SubscriptionPlanEnum.ELITE
  const enableExport = (userPermission?.exportExcelQuota ?? 0) > 0
  const planToExport = getRequiredPlan({ conditionFn: (plan) => (pagePermission?.[plan]?.exportExcelQuota ?? 0) > 0 })
  const isEnableRankingFilter = userPermission?.isEnableRankingFilter
  const planToFilterRanking = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableRankingFilter,
  })

  return {
    userPermission,
    pagePermission,
    myProfile,
    fieldsAllowed,
    protocolsAllowed,
    isEliteUser,
    enableExport,
    planToExport,
    isEnableRankingFilter,
    planToFilterRanking,
  }
}
