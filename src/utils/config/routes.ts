const ROUTES = {
  HOME: {
    path: '/',
  },
  HOME_EXPLORER: {
    path: '/',
  },
  HOME_FAVORITE: {
    path: '/favorite',
  },
  HOME_TOP_OPENINGS: {
    path: '/:protocol/m/top-openings',
    path_suffix: 'm/top-openings',
  },
  SEARCH: {
    path: '/search',
  },
  TRADER_DETAILS: {
    path: '/:protocol/trader/:address',
    path_prefix: '/trader',
  },
  POSITION_DETAILS: {
    path: '/:protocol/position',
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
  MY_REFERRAL: {
    path: '/me/referral',
  },
  WALLET_MANAGEMENT: {
    path: '/wallet-management',
  },
  STATS: {
    path: '/stats',
  },
  TOP_OPENINGS: {
    path: '/:protocol/top-openings',
    path_prefix: '/top-openings',
  },
  SHARED_BACKTEST_SINGLE: {
    path: '/:protocol/shared-backtest/single/:id',
    path_prefix: '/shared-backtest/single',
  },
  SHARED_BACKTEST_MULTIPLE: {
    path: '/:protocol/shared-backtest/multiple/:id',
    path_prefix: '/shared-backtest/multiple',
  },
}

export default ROUTES
