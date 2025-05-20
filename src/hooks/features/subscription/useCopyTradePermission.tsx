import { CopyTradePermission, CopyTradePermissionConfig } from 'entities/permission'
import { CopyTradePlatformEnum, SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'
import useUserNextPlan from './useUserNextPlan'

const useCopyTradePermission = () => {
  const { userPermission, pagePermission, myProfile } = useGetSubscriptionPermission<
    CopyTradePermission,
    CopyTradePermissionConfig
  >({
    section: SubscriptionPermission.COPY_TRADING,
  })
  const { userNextPlan } = useUserNextPlan()
  const exchangeAllowed = userPermission?.exchangeAllowed ?? []
  const apiKeyQuota = userPermission?.apiKeyQuota ?? 0
  const copyTradeQuota = userPermission?.copyTradeQuota ?? 0
  const maxApiKeyQuota = pagePermission?.ELITE?.apiKeyQuota ?? 0
  const maxCopyTradeQuota = pagePermission?.ELITE?.copyTradeQuota ?? 0

  const getRequiredPlanToExchange = (exchange: CopyTradePlatformEnum) => {
    return getRequiredPlan({
      conditionFn: (plan) => !!pagePermission?.[plan]?.exchangeAllowed?.includes(exchange),
    })
  }
  return {
    myProfile,
    userNextPlan,
    userPermission,
    pagePermission,
    exchangeAllowed,
    apiKeyQuota,
    copyTradeQuota,
    maxCopyTradeQuota,
    maxApiKeyQuota,
    getRequiredPlanToExchange,
  }
}

export default useCopyTradePermission
