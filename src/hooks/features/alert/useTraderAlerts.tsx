import { useQuery } from 'react-query'

import { getAllGroupAlertApi, getTraderAlertListApi } from 'apis/alertApis'
import { AlertCategoryEnum, AlertCustomType } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export function useTraderAlerts(address?: string, protocol?: any) {
  const { data, isLoading: isLoadingAlert } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, address, protocol],
    () => getTraderAlertListApi({ address, protocol }),
    { enabled: !!address && !!protocol }
  )

  const { data: allGroupAlert, isLoading: isLoadingGroup } = useQuery(
    [address, protocol],
    () => getAllGroupAlertApi({ address, protocol }),
    { enabled: !!address && !!protocol }
  )

  // @ts-ignore
  const activeGroups = allGroupAlert?.activeGroups || []
  // @ts-ignore
  const inactiveGroups = allGroupAlert?.inactiveGroups || []
  const groupAlerts =
    [
      ...activeGroups.map((alert: any) => ({ ...alert, isActive: true })),
      ...inactiveGroups.map((alert: any) => ({ ...alert, isActive: false })),
    ]
      ?.filter((alert: any) => [AlertCustomType.TRADER_GROUP, AlertCustomType.TRADER_BOOKMARK].includes(alert.type))
      ?.map((alert: any) => ({
        userId: alert.userId,
        name: alert.name || '',
        id: alert._id,
        category: AlertCategoryEnum.CUSTOM,
        isActive: alert.isActive,
      })) || []

  const currentAlert = data?.data?.[0]

  return {
    currentAlert,
    groupAlerts,
    isLoading: isLoadingAlert || isLoadingGroup,
  }
}
