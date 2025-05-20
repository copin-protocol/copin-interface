import { useMemo } from 'react'

import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { formatNumber } from 'utils/helpers/format'
import { generatePermissionData } from 'utils/helpers/generatePermission'

const usePlanQuotas = () => {
  const permission = useSystemConfigStore((state) => state.permission)

  return useMemo(() => {
    return [
      {
        name: 'Alert Watchlist',
        usageKey: 'watchedListAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'watchedListQuota', (value) =>
          value ? formatNumber(value) : '--'
        ),
      },
      {
        name: 'Alert Monthly Quota',
        usageKey: 'monthlyAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'monthlyQuota'),
      },
      {
        name: 'Alert Channel Integration',
        usageKey: 'channelAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'channelQuota'),
      },
      {
        name: 'Alert Customization',
        usageKey: 'customAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'customPersonalQuota'),
      },
      {
        name: 'Alert Group Integration',
        usageKey: 'groupAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'groupQuota'),
      },
      {
        name: 'Alert Webhook Integration',
        usageKey: 'webhookAlerts',
        ...generatePermissionData(permission?.TRADER_ALERT, 'webhookQuota'),
      },
      {
        name: 'Exchange API Connections',
        usageKey: 'exchangeApis',
        ...generatePermissionData(permission?.COPY_TRADING, 'apiKeyQuota'),
      },
      {
        name: 'Copy Trade Settings',
        usageKey: 'copyTrades',
        ...generatePermissionData(permission?.COPY_TRADING, 'copyTradeQuota'),
      },
      {
        name: 'CSV Download Quota',
        usageKey: 'csvDownloads',
        ...generatePermissionData(permission?.TRADER_EXPLORER, 'exportExcelQuota'),
      },
    ]
  }, [permission])
}

export default usePlanQuotas
