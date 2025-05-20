import { useMemo } from 'react'

import { LiveTradesPermission, LiveTradesPermissionConfig } from 'entities/permission'
import { SYMBOL_ALLOWED_ALL } from 'utils/config/constants'
import { SubscriptionPermission, SubscriptionPlanEnum } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useLiveTradesPermission() {
  const { userPermission, pagePermission, myProfile } = useGetSubscriptionPermission<
    LiveTradesPermission,
    LiveTradesPermissionConfig
  >({
    section: SubscriptionPermission.LIVE_TRADES,
  })
  const orderFieldsAllowed = useMemo(
    () =>
      userPermission?.orderFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any)
        ? undefined
        : userPermission?.orderFieldsAllowed ?? [],
    [userPermission?.orderFieldsAllowed]
  )
  const positionFieldsAllowed = useMemo(
    () =>
      userPermission?.positionFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any)
        ? undefined
        : userPermission?.positionFieldsAllowed ?? [],
    [userPermission?.positionFieldsAllowed]
  )
  const isEnableSearchOrderTrader =
    !!userPermission?.orderFieldsAllowed.includes(SYMBOL_ALLOWED_ALL as any) ||
    !!userPermission?.orderFieldsAllowed.includes('account')
  const isEnableSearchPositionTrader =
    !!userPermission?.positionFieldsAllowed.includes(SYMBOL_ALLOWED_ALL as any) ||
    !!userPermission?.positionFieldsAllowed.includes('account')
  const planToSearchOrderTrader = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.orderFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any) ||
      !!pagePermission?.[plan]?.orderFieldsAllowed?.includes('account'),
  })
  const planToSearchPositionTrader = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.positionFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any) ||
      !!pagePermission?.[plan]?.positionFieldsAllowed?.includes('account'),
  })

  const isEliteUser = myProfile?.plan === SubscriptionPlanEnum.ELITE
  const planToShowOrderDetails = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.orderFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any) ||
      !!pagePermission?.[plan]?.orderFieldsAllowed?.includes('account'),
  })
  const planToShowPositionDetails = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.positionFieldsAllowed?.includes(SYMBOL_ALLOWED_ALL as any) ||
      !!pagePermission?.[plan]?.positionFieldsAllowed?.includes('account'),
  })
  const isEnabledFilterOrder = !!userPermission?.isEnableLiveOrderFilter
  const isEnabledFilterPosition = !!userPermission?.isEnableLivePositionFilter
  const planToFilterOrder = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableLiveOrderFilter,
  })
  const planToFilterPosition = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableLivePositionFilter,
  })
  const planToEnabledLiveOrder = getRequiredPlan({
    conditionFn: (plan) => !pagePermission?.[plan]?.liveOrderDelaySeconds,
  })
  const planToEnabledLivePosition = getRequiredPlan({
    conditionFn: (plan) => !pagePermission?.[plan]?.livePositionDelaySeconds,
  })
  const liveOrderDelayInSecond = userPermission?.liveOrderDelaySeconds ?? 0
  const livePositionDelayInSecond = userPermission?.livePositionDelaySeconds ?? 0

  return {
    userPermission,
    pagePermission,
    myProfile,
    orderFieldsAllowed,
    positionFieldsAllowed,
    isEnableSearchOrderTrader,
    isEnableSearchPositionTrader,
    isEliteUser,
    planToShowOrderDetails,
    planToShowPositionDetails,
    planToFilterOrder,
    planToFilterPosition,
    liveOrderDelayInSecond,
    livePositionDelayInSecond,
    planToEnabledLiveOrder,
    planToEnabledLivePosition,
    planToSearchOrderTrader,
    planToSearchPositionTrader,
    isEnabledFilterOrder,
    isEnabledFilterPosition,
  }
}
