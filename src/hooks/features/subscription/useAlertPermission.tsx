import { AlertPermission, AlertPermissionConfig } from 'entities/permission'
import { getAlertQuotaRequiredPlan } from 'pages/Settings/helpers'
import { SubscriptionPermission, SubscriptionPlanEnum } from 'utils/config/enums'

import useCheckFeature from './useCheckFeature'
import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useAlertPermission() {
  const { userPermission, pagePermission } = useGetSubscriptionPermission<AlertPermission, AlertPermissionConfig>({
    section: SubscriptionPermission.TRADER_ALERT,
  })
  const watchedListQuota = userPermission?.watchedListQuota ?? 0
  const customQuota = userPermission?.customPersonalQuota ?? 0
  const channelQuota = userPermission?.channelQuota ?? 0
  const webhookQuota = userPermission?.webhookQuota ?? 0
  const groupQuota = userPermission?.groupQuota ?? 0
  const monthlyQuota = userPermission?.monthlyQuota ?? 0
  const maxChannelQuota = pagePermission?.[SubscriptionPlanEnum.ELITE]?.channelQuota ?? 0
  const maxWatchedListQuota = pagePermission?.[SubscriptionPlanEnum.ELITE]?.watchedListQuota ?? 0
  const maxCustomQuota = pagePermission?.[SubscriptionPlanEnum.ELITE]?.watchedListQuota ?? 0

  const watchlistRequiredPlan = getAlertQuotaRequiredPlan({
    section: 'watchedListQuota',
    alertPermission: pagePermission,
  })
  const customRequiredPlan = getAlertQuotaRequiredPlan({
    section: 'customPersonalQuota',
    alertPermission: pagePermission,
  })
  const webhookRequiredPlan = getAlertQuotaRequiredPlan({ section: 'webhookQuota', alertPermission: pagePermission })
  const groupRequiredPlan = getAlertQuotaRequiredPlan({ section: 'groupQuota', alertPermission: pagePermission })
  const channelRequiredPlan = getAlertQuotaRequiredPlan({ section: 'channelQuota', alertPermission: pagePermission })
  const { isAvailableFeature: isAvailableWatchlistAlert, userNextPlan: userWatchlistNextPlan } = useCheckFeature({
    requiredPlan: watchlistRequiredPlan,
  })
  const { isAvailableFeature: isAvailableCustomAlert, userNextPlan: userCustomNextPlan } = useCheckFeature({
    requiredPlan: customRequiredPlan,
  })
  const { isAvailableFeature: isAvailableWebhookAlert, userNextPlan: userWebhookNextPlan } = useCheckFeature({
    requiredPlan: webhookRequiredPlan,
  })
  const { isAvailableFeature: isAvailableGroupAlert, userNextPlan: userGroupNextPlan } = useCheckFeature({
    requiredPlan: groupRequiredPlan,
  })
  const { isAvailableFeature: isAvailableChannelAlert, userNextPlan: userChannelNextPlan } = useCheckFeature({
    requiredPlan: channelRequiredPlan,
  })

  return {
    userPermission,
    pagePermission,
    maxChannelQuota,
    maxCustomQuota,
    maxWatchedListQuota,
    watchedListQuota,
    customQuota,
    channelQuota,
    webhookQuota,
    groupQuota,
    monthlyQuota,
    watchlistRequiredPlan,
    customRequiredPlan,
    webhookRequiredPlan,
    groupRequiredPlan,
    channelRequiredPlan,
    userWatchlistNextPlan,
    userCustomNextPlan,
    userWebhookNextPlan,
    userGroupNextPlan,
    userChannelNextPlan,
    isAvailableWatchlistAlert,
    isAvailableCustomAlert,
    isAvailableWebhookAlert,
    isAvailableGroupAlert,
    isAvailableChannelAlert,
  }
}
