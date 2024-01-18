const ROUTES = {
  HOME: {
    path: '/',
  },
  TRADERS_EXPLORER: {
    path: '/:protocol/explorer',
    path_prefix: '/explorer',
  },
  OPEN_INTEREST: {
    path: '/:protocol/open-interest',
    path_prefix: '/open-interest',
  },
  OPEN_INTEREST_BY_MARKETS: {
    path: '/:protocol/open-interest/markets',
    path_prefix: '/open-interest/markets',
  },
  OPEN_INTEREST_BY_MARKET: {
    path: '/:protocol/open-interest/market/:symbol',
    path_prefix: '/open-interest/market',
  },
  LEADERBOARD: {
    path: '/:protocol/leaderboard',
    path_prefix: '/leaderboard',
  },
  FAVORITES: {
    path: '/favorites',
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
    path: '/me/management',
  },
  MY_HISTORY: {
    path: '/me/history',
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
    path: '/settings/subscription',
  },
  ALERT_LIST: {
    path: '/settings/alert-list',
  },
  LINK_BOT_ALERT: {
    path: '/link/telegram',
  },
  STATS: {
    path: '/stats',
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
}

export default ROUTES
