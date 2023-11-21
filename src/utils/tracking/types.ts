export interface EventGoogleAnalytic {
  category: EventCategory
  action: string
  label: string
}

export enum EventCategory {
  FILTER = 'FILTER',
  FAVORITES = 'FAVORITES',
  BACK_TEST = 'BACKTEST',
  COPY_TRADE = 'COPY_TRADE',
  MULTI_CHAIN = 'MULTI_CHAIN',
  ROUTES = 'ROUTES',
  SEARCH = 'SEARCH',
  LAYOUT = 'LAYOUT',
  CHART = 'CHART',
}

export const EVENT_ACTIONS = {
  [EventCategory.COPY_TRADE]: {
    OPEN_COPY_TRADE: 'open_copy_trade',
    REQUEST_COPY_TRADE: 'request_copy_trade',
    CLONE_COPY_TRADE: 'clone_copy_trade',
  },
  [EventCategory.BACK_TEST]: {
    OPEN_SINGLE: 'open_backtest_single',
    OPEN_MULTIPLE: 'open_backtest_multiple',
    REQUEST_SINGLE: 'request_backtest_single',
    REQUEST_MULTIPLE: 'request_backtest_multiple',
    SET_STRATEGY_MULTIPLE: 'set_strategy_backtest_multiple',
    CONTINUE_MULTIPLE: 'continue_backtest_multiple',
    VIEW_RESULT: 'view_backtest_result',
  },
  [EventCategory.FILTER]: {
    CUSTOM_RANGE: 'filer_custom_range',
    SUGGESTION: 'filter_suggestion',
    NORMAL: 'filter_normal',
    RESET_DEFAULT: 'filter_reset_default',
    D7: 'filter_7_days',
    D15: 'filter_14_days',
    D30: 'filter_30_days',
    D60: 'filter_60_days',
  },
  [EventCategory.FAVORITES]: {
    ADD_FAVORITE_WITH_NOTE: 'add_favorite_with_note',
    ADD_FAVORITE_WITHOUT_NOTE: 'add_favorite_without_note',
    REMOVE_FAVORITE: 'remove_favorite',
    CANCEL_FAVORITE: 'cancel_favorite',
    OPEN_FAVORITES: 'open_favorites',
  },
  [EventCategory.MULTI_CHAIN]: {
    SWITCH_GMX: 'switch_gmx',
    SWITCH_KWENTA: 'switch_kwenta',
  },
  [EventCategory.ROUTES]: {
    MY_PROFILE: 'my_profile',
    WALLET_MANAGEMENT: 'wallet_management',
    HISTORY: 'history',
    TOP_OPENING_POSITIONS_ALL: 'top_opening_positions_all',
    JOIN_DISCORD: 'join_discord',
    JOIN_TELEGRAM: 'join_telegram',
    JOIN_TWITTER: 'join_twitter',
    JOIN_GITHUB: 'join_github',
    MY_REFERRAL: 'my_referral',
    ALERT_LIST: 'alert_list',
    USER_ACTIVITY: 'user_activity',
    SUBSCRIPTION: 'SUBSCRIPTION',
    USER_SUBSCRIPTION: 'USER_SUBSCRIPTION',
  },
  [EventCategory.SEARCH]: {
    SEARCH_CLICK: 'search_click',
    SEARCH_ENTER: 'search_enter',
    SEARCH_CUSTOM_ADD: 'search_custom_add',
  },
  [EventCategory.CHART]: {
    VIEW_ORDER_MARKER: 'view_order_marker',
  },
  [EventCategory.LAYOUT]: {
    EXPAND_EXPLORER_MAIN: 'expand_explorer_main',
    HIDE_EXPLORER_MAIN: 'expand_explorer_main',
    EXPAND_EXPLORER_LIST: 'expand_explorer_list',
    HIDE_EXPLORER_LIST: 'hide_explorer_list',
    EXPAND_EXPLORER_FILTER: 'expand_explorer_filter',
    HIDE_EXPLORER_FILTER: 'hide_explorer_filter',
    SHOW_HEATMAP_ACTIVITY: 'show_trader_heatmap_activity',
    HIDE_HEATMAP_ACTIVITY: 'hide_trader_heatmap_activity',
    SHOW_PNL_CHART: 'show_trader_pnl_chart',
    HIDE_PNL_CHART: 'hide_trader_pnl_chart',
    EXPAND_POSITION_FULL: 'expand_trader_position_full',
    HIDE_POSITION_FULL: 'hide_trader_position_full',
    EXPAND_POSITION_TOP: 'expand_trader_position_top',
    HIDE_POSITION_TOP: 'hide_trader_position_top',
    EXPAND_CHART_POSITION_FULL: 'expand_chart_position_full',
    HIDE_CHART_POSITION_FULL: 'hide_chart_position_full',
  },
}
