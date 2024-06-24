import { ReactNode, createContext, useContext } from 'react'
import { useQuery } from 'react-query'

import { getListEvent } from 'apis/event'
import { getVolumeLimit } from 'apis/systemApis'
import { VolumeLimitData } from 'entities/system'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export interface SystemConfigContext {
  volumeLimit: VolumeLimitData | undefined
  eventId: string | undefined
}

const SystemConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const { data: volumeLimit } = useQuery([QUERY_KEYS.GET_SYSTEM_CONFIG], () => getVolumeLimit(), {
    retry: 0,
  })
  const { data: events } = useQuery([QUERY_KEYS.GET_EVENT_COMPETITION, 'allEvents'], getListEvent)

  const contextValue: SystemConfigContext = {
    volumeLimit,
    eventId: events?.[0]?.id,
  }

  return <SystemConfigContext.Provider value={contextValue}>{children}</SystemConfigContext.Provider>
}

export const useSystemConfigContext = () => useContext(SystemConfigContext)

export function getMaxVolumeCopy({
  plan,
  isRef,
  volumeLimitData,
}: {
  plan: SubscriptionPlanEnum | undefined
  isRef: boolean
  volumeLimitData: VolumeLimitData | undefined
}) {
  if (!volumeLimitData || plan == null) return 0
  if (isRef) {
    if (plan === SubscriptionPlanEnum.VIP) return volumeLimitData.volumeVipReferral
    if (plan === SubscriptionPlanEnum.PREMIUM) return volumeLimitData.volumePremiumReferral
    return volumeLimitData.volumeReferral
  } else {
    if (plan === SubscriptionPlanEnum.VIP) return volumeLimitData.volumeVipWoReferral
    if (plan === SubscriptionPlanEnum.PREMIUM) return volumeLimitData.volumePremiumWoReferral
    return volumeLimitData.volumeWoReferral
  }
}
