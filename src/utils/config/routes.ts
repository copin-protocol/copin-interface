const ROUTES = {
  HOME: {
    path: '/',
  },
  LITE: {
    path: '/lite',
  },
  TRADERS_EXPLORER: {
    path: '/:protocol/explorer',
    path_prefix: '/explorer',
  },
  ALL_TRADERS_EXPLORER: {
    path: '/explorer',
    path_prefix: '/explorer',
  },
  OPEN_INTEREST: {
    path: '/:protocol/open-interest',
    path_prefix: '/open-interest',
  },
  OPEN_INTEREST_OVERVIEW: {
    path: '/open-interest/overview',
  },
  OPEN_INTEREST_POSITIONS: {
    path: '/open-interest/positions',
  },
  ROOT_OPEN_INTEREST_POSITIONS: {
    path: '/open-interest',
  },
  LEADERBOARD: {
    path: '/:protocol/trader-board',
    path_prefix: '/trader-board',
  },
  COPIER_LEADERBOARD: {
    path: '/copier-leaderboard',
  },
  COPIER_RANKING: {
    path: '/copier-ranking',
  },
  BOOKMARKS: {
    path: '/bookmarks',
  },
  SEARCH: {
    path: '/search',
  },
  SEARCH_TX_HASH: {
    path: '/tx/:txHash',
    path_prefix: '/tx',
  },
  TRADER_DETAILS: {
    path: '/:protocol/trader/:address',
    path_prefix: '/trader',
  },
  POSITION_DETAILS: {
    path: '/:protocol/position/:id',
    path_prefix: '/position',
  },
  SHARED_POSITION_DETAILS: {
    path: '/:protocol/position/share/:sharedId',
    path_prefix: '/position/share',
  },
  MY_PROFILE: {
    path: '/me',
  },
  MY_MANAGEMENT: {
    path: '/me/api-wallet',
  },
  MY_HISTORY: {
    path: '/me/history',
  },
  USER_DCP_MANAGEMENT: {
    path: '/me/smart-wallet',
  },
  USER_VAULT_MANAGEMENT: {
    path: '/me/vault',
  },
  USER_IF_MANAGEMENT: {
    path: '/me/if',
  },
  USER_ACTIVITY: {
    path: '/me/activity',
    path_prefix: '/me/activity',
  },
  WALLET_MANAGEMENT: {
    path: '/wallet-management',
  },
  SETTINGS: {
    path: '/settings',
  },
  REFERRAL: {
    path: '/settings/referral',
  },
  USER_SUBSCRIPTION: {
    path: '/my-subscription',
  },
  USER_SUBSCRIPTION_PAYMENT_HISTORY: {
    path: '/my-subscription/payment-history',
  },
  ALERT: {
    path: '/alerts',
  },
  ALERT_LOGS: {
    path: '/alerts/logs',
  },
  ALERT_LIST: {
    path: '/alerts',
  },
  LINK_BOT_ALERT: {
    path: '/link/telegram',
  },
  ALERT_SETTING_DETAILS: {
    path: '/alert/:alertType/:alertId',
    path_prefix: '/alert',
  },
  STATS: {
    path: '/stats',
  },
  STATS_CEX: {
    path: '/stats-cex',
  },
  SYSTEM_STATUS: {
    path: '/system',
  },
  NODE_STATUS: {
    path: '/system/node',
  },
  WALLET_WATCHER: {
    path: '/system/wallet',
  },
  PROTOCOL_STATUS: {
    path: '/system/protocol',
  },
  SHARED_BACKTEST_SINGLE: {
    path: '/:protocol/shared-backtest/single/:id',
    path_prefix: '/shared-backtest/single',
  },
  SHARED_BACKTEST_MULTIPLE: {
    path: '/:protocol/shared-backtest/multiple/:id',
    path_prefix: '/shared-backtest/multiple',
  },
  SUBSCRIPTION: {
    path: '/subscription',
  },
  COMPARING_TRADERS: {
    path: '/compare',
  },
  TRADER_DETAILS_WRAPPER: {
    path: '/trader/:address',
    path_prefix: '/trader',
  },
  TRADER_DETAILS_MULTI_EXCHANGE: {
    path: '/trader/:address/:protocol',
    alter_ath: '/trader/:address',
    path_prefix: '/trader',
  },
  TRADER_EXCHANGES_STATS: {
    path: '/trader/stats/:address/:protocol',
    path_prefix: '/trader/stats',
  },
  EVENT_DETAILS: {
    path: '/event/:id',
    path_prefix: 'event',
  },
  EVENTS: {
    path: '/events',
  },
  VAULT_DETAILS: {
    path: '/vaults/:address',
    path_prefix: '/vaults',
  },
  FEE_REBATE: {
    path: '/fee-rebate',
  },
  GNS_FEE_REBATE: {
    path: '/fee-rebate/gns',
  },
  REFERRAL_MANAGEMENT: {
    path: '/referral',
  },
  LIVE_TRADES: {
    path: '/live-trades',
  },
  LIVE_TRADES_ORDERS: {
    path: '/live-trades/orders',
  },
  LIVE_TRADES_POSITIONS: {
    path: '/live-trades/positions',
  },
  PERP_DEXS_EXPLORER: {
    path: '/perp-explorer',
  },
  PERP_DEX_DETAILS: {
    path: '/perp-explorer/:perpdex',
    path_prefix: '/perp-explorer',
  },
  SECURITY: {
    path: '/security',
  },
  DEVICE_LOGS: {
    path: '/security/device-logs',
  },
  // CHECKOUT: {
  //   path: '/checkout',
  // },
}

export default ROUTES
