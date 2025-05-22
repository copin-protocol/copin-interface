import { ReactNode, useMemo } from 'react'

import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { PlanProtocol } from 'pages/Subscription/PlanProtocols'
import { WAITLIST_EXCHANGES } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { EXCHANGES_INFO } from 'utils/config/platforms'
import { formatDuration, formatNumber } from 'utils/helpers/format'
import { generatePermissionData } from 'utils/helpers/generatePermission'
import { getItemsAndRequiredPlan } from 'utils/helpers/transform'

export interface PlanPermission {
  category: string
  features: Array<{
    name: string
    [SubscriptionPlanEnum.FREE]: boolean | ReactNode
    [SubscriptionPlanEnum.STARTER]: boolean | ReactNode
    [SubscriptionPlanEnum.PRO]: boolean | ReactNode
    [SubscriptionPlanEnum.ELITE]: boolean | ReactNode
  }>
}

export const usePlanPermissions = (): PlanPermission[] => {
  const permission = useSystemConfigStore((state) => state.permission)

  return useMemo(() => {
    const protocolsByPlan = getItemsAndRequiredPlan('protocolAllowed', permission?.PROTOCOL)
    return [
      {
        category: 'DATA',
        features: [
          {
            name: 'Protocols',
            ...generatePermissionData(
              permission?.PROTOCOL,
              'protocolAllowed',
              (value, currentPlan, prevPlan) => (
                <PlanProtocol protocols={protocolsByPlan} prevPlan={prevPlan} currentPlan={currentPlan} />
              ),
              false
            ),
          },
          // {
          //   name: 'Latest Activities',
          //   [SubscriptionPlanEnum.FREE]: true,
          //   [SubscriptionPlanEnum.STARTER]: true,
          //   [SubscriptionPlanEnum.PRO]: true,
          //   [SubscriptionPlanEnum.ELITE]: true,
          // },
          {
            name: 'Trader Explorer Metrics',
            ...generatePermissionData(
              permission?.TRADER_EXPLORER,
              'fieldsAllowed',
              (value: string[], currentPlan) => {
                if (currentPlan === SubscriptionPlanEnum.ELITE) {
                  return 'Unlimited'
                }
                return value.filter((field) => !field.includes('realised') && !['account', 'type'].includes(field))
                  .length
              },
              false
            ),
          },
          {
            name: 'Metric Filtering',
            ...generatePermissionData(
              permission?.TRADER_EXPLORER,
              'maxFilterFields',
              (value, currentPlan) => {
                if (currentPlan === SubscriptionPlanEnum.ELITE) {
                  return 'Unlimited'
                }
                return value
              },
              true
            ),
          },
          {
            name: 'Ranking Filtering',
            ...generatePermissionData(permission?.TRADER_EXPLORER, 'isEnableRankingFilter'),
          },
        ],
      },
      {
        category: 'TRADER PROFILE',
        features: [
          {
            name: 'ALL, 60D, 30D, 15D, 7D Stats',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'timeFramesAllowed', (value) =>
              value?.includes('FULL')
            ),
          },
          {
            name: 'Last 24h, Yesterday Stats',
            ...generatePermissionData(
              permission?.TRADER_PROFILE,
              'timeFramesAllowed',
              (value) => value?.includes('D1') && value?.includes('L24H')
            ),
          },
          {
            name: 'Token Preferences',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'isEnableTokenStats'),
          },
          {
            name: 'Opening Positions',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'isEnableOpeningPosition'),
          },
          {
            name: 'Position History',
            ...generatePermissionData(
              permission?.TRADER_PROFILE,
              'maxPositionHistory',
              (value) => (value > 0 ? `Last ${value} records` : 'Unlimited'),
              true
            ),
          },

          {
            name: 'Trader Metrics Ranking',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'traderRankingFields', (value) => value.length, true),
          },
        ],
      },
      {
        category: 'MARKET INSIGHTS',
        features: [
          {
            name: 'Open Interest',
            ...generatePermissionData(permission?.OPEN_INTEREST, 'isEnabled'),
          },
          {
            name: 'Open Interest Filtering',
            ...generatePermissionData(permission?.OPEN_INTEREST, 'allowedFilter'),
          },
          {
            name: 'Perp Explorer',
            ...generatePermissionData(permission?.PERP_EXPLORER, 'isEnabled'),
          },
          {
            name: 'Live Orders',
            ...generatePermissionData(permission?.LIVE_TRADES, undefined, (value) => {
              let str = ''
              if (value.liveOrderDelaySeconds) {
                str += `${formatDuration(value.liveOrderDelaySeconds, undefined, true)} delayed`
              } else {
                str += `Realtime`
              }
              if (!value.orderFieldsAllowed?.includes('*')) {
                str += ` - Limited info`
              }
              return str
            }),
          },
          {
            name: 'Live Positions',
            // TODO: Update when make rule for live order
            ...generatePermissionData(permission?.LIVE_TRADES, undefined, (value) => {
              let str = ''
              if (value.livePositionDelaySeconds) {
                str += `${formatDuration(value.livePositionDelaySeconds, undefined, true)} delayed`
              } else {
                str += `Realtime`
              }
              if (!value.positionFieldsAllowed?.includes('*')) {
                str += ` - Limited info`
              }
              return str
            }),
          },

          {
            name: 'AI Analyzer (Coming Soon)',
            [SubscriptionPlanEnum.FREE]: false,
            [SubscriptionPlanEnum.STARTER]: false,
            [SubscriptionPlanEnum.PRO]: true,
            [SubscriptionPlanEnum.ELITE]: true,
          },
        ],
      },
      {
        // TODO: Update when make rule for alert
        category: 'ALERT SIGNAL',
        features: [
          {
            name: 'Watchlist',
            ...generatePermissionData(
              permission?.TRADER_ALERT,
              'watchedListQuota',
              (value) => `${value} traders`,
              true
            ),
          },
          {
            name: 'Monthly Quota',
            ...generatePermissionData(permission?.TRADER_ALERT, 'monthlyQuota', (value) => formatNumber(value)),
          },
          {
            name: 'Channel Integration',
            ...generatePermissionData(permission?.TRADER_ALERT, 'channelQuota'),
          },
          {
            name: 'Alert Customization',
            ...generatePermissionData(permission?.TRADER_ALERT, 'customPersonalQuota', (value) => {
              if (value === 0) {
                return false
              }
              return value
            }),
          },
          {
            name: 'Group Integration',
            ...generatePermissionData(permission?.TRADER_ALERT, 'groupQuota', (value) => {
              if (value === 0) {
                return false
              }
              return value
            }),
          },

          {
            name: 'Webhook Integration',
            ...generatePermissionData(permission?.TRADER_ALERT, 'webhookQuota', (value) => {
              if (value === 0) {
                return false
              }
              return value
            }),
          },
        ],
      },
      {
        // TODO: Update when make rule for copy trade
        category: 'COPY TRADE & TOOLS',
        features: [
          {
            name: 'Supported Exchanges',
            ...generatePermissionData(permission?.COPY_TRADING, 'exchangeAllowed', (value) => {
              return value
                ?.map((exchange: any) =>
                  WAITLIST_EXCHANGES.includes(exchange)
                    ? `${EXCHANGES_INFO[exchange].name} (Coming soon)`
                    : EXCHANGES_INFO[exchange].name
                )
                .join(', ')
            }),
          },
          {
            name: 'Copyable Protocols',
            [SubscriptionPlanEnum.FREE]: 'Accessible protocols',
            [SubscriptionPlanEnum.STARTER]: 'Accessible protocols',
            [SubscriptionPlanEnum.PRO]: 'Accessible protocols',
            [SubscriptionPlanEnum.ELITE]: (
              <span>
                Plus <b>early-access</b> protocols
              </span>
            ),
          },
          {
            name: 'Exchange API Connections',
            ...generatePermissionData(permission?.COPY_TRADING, 'apiKeyQuota', (value) => {
              return `${value} ${value > 1 ? 'Wallets' : 'Wallet'}`
            }),
          },
          {
            name: 'Copy Trades',
            ...generatePermissionData(permission?.COPY_TRADING, 'copyTradeQuota', (value) => {
              return `${value} Copy ${value > 1 ? 'Trades' : 'Trade'}`
            }),
          },
          {
            name: 'Copin Signal License',
            [SubscriptionPlanEnum.FREE]: false,
            [SubscriptionPlanEnum.STARTER]: 'Personal',
            [SubscriptionPlanEnum.PRO]: 'Personal',
            [SubscriptionPlanEnum.ELITE]: 'Personal',
          },
          {
            name: 'Copy Trades Bulk Action',
            ...generatePermissionData(permission?.COPY_TRADING, 'isEnableBulkAction'),
          },
          {
            name: 'Multiple-Accounts Copying',
            ...generatePermissionData(permission?.COPY_TRADING, 'isEnableMultiAccount'),
          },
          {
            name: 'Trader Comparison',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'isEnableCompareTrader'),
          },
          {
            name: 'Backtesting',
            ...generatePermissionData(permission?.TRADER_PROFILE, 'isEnableBackTest'),
          },
          {
            name: 'Referral Code Customization',
            ...generatePermissionData(permission?.USER, 'allowedCustomReferralCode'),
          },
          {
            name: 'CEX Depths',
            ...generatePermissionData(permission?.TRADER_EXPLORER, 'isEnableCexDepth'),
          },
          {
            name: 'CSV Download Quota',
            ...generatePermissionData(permission?.TRADER_EXPLORER, 'exportExcelQuota', (value) =>
              value > 0 ? `${formatNumber(value)} Rows` : 'Unlimited'
            ),
          },
          // TODO: Update when make rule for trader label
          {
            name: 'Trader Labels (Coming Soon)',
            [SubscriptionPlanEnum.FREE]: false,
            [SubscriptionPlanEnum.STARTER]: false,
            [SubscriptionPlanEnum.PRO]: 'Yes',
            [SubscriptionPlanEnum.ELITE]: 'Yes & Exclusive',
          },
        ],
      },
    ]
  }, [permission])
}
