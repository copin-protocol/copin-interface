import { useMemo } from 'react'

import { DataPermissionConfig, ExplorerPermission } from 'entities/permission'
import { SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'
import { useIsElite } from './useSubscriptionRestrict'

export default function useExplorerPermission() {
  const { userPermission, pagePermission, myProfile } = useGetSubscriptionPermission<
    ExplorerPermission,
    DataPermissionConfig
  >({
    section: SubscriptionPermission.TRADER_EXPLORER,
  })
  const fieldsAllowed = useMemo(() => userPermission?.fieldsAllowed ?? [], [userPermission?.fieldsAllowed])
  const protocolsAllowed = useMemo(() => userPermission?.protocol ?? [], [userPermission?.protocol])
  const isEliteUser = useIsElite()
  const enableExport = (userPermission?.exportExcelQuota ?? 0) > 0
  const planToExport = getRequiredPlan({ conditionFn: (plan) => (pagePermission?.[plan]?.exportExcelQuota ?? 0) > 0 })
  const isEnableRankingFilter = userPermission?.isEnableRankingFilter
  const isEnableLabelsFilter = userPermission?.isEnableLabelsFilter
  const planToFilterRanking = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableRankingFilter,
  })
  const planToFilterLabels = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableLabelsFilter,
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
    isEnableLabelsFilter,
    planToFilterRanking,
    planToFilterLabels,
  }
}
