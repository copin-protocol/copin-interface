const ROUTES = {
  HOME: {
    path: '/',
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
  MY_PROFILE: {
    path: '/me',
  },
  MY_PROFILE_OLD: {
    path: '/me-old',
  },
  HISTORY: {
    path: '/history',
  },
  BACKTEST: {
    path: '/backtest',
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
  REFERRAL: {
    path: '/my-referral',
  },
}

export default ROUTES
