import { themeColors } from 'theme/colors'
import { getCurrentTimezone } from 'utils/helpers/transform'

import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  ResolutionString,
  TimeFrameItem,
  Timezone,
} from '../../../public/static/charting_library'

export const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: 'BTC/USDT',
  interval: '15' as ResolutionString,
  library_path: '/static/charting_library/',
  locale: 'en',
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'copin',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
}
const disabledFeatures: ChartingLibraryFeatureset[] = [
  'header_indicators',
  'header_quick_search',
  'volume_force_overlay',
  // 'show_logo_on_all_charts',
  // 'caption_buttons_text_if_possible',
  'create_volume_indicator_by_default',
  'header_compare',
  // 'compare_symbol',
  'display_market_status',
  // 'header_interval_dialog_button',
  'show_interval_dialog_on_key_press',
  'header_symbol_search',
  'popup_hints',
  'header_in_fullscreen_mode',
  'use_localstorage_for_settings',
  'right_bar_stays_on_scroll',
  'symbol_info',
  'compare_symbol_search_spread_operators',
  'show_symbol_logo_for_compare_studies',
  'go_to_date',
  'timeframes_toolbar',
]
const enabledFeatures: ChartingLibraryFeatureset[] = [
  'show_exchange_logos',
  'side_toolbar_in_fullscreen_mode',
  'header_in_fullscreen_mode',
  'hide_resolution_in_legend',
  'items_favoriting',
  'hide_left_toolbar_by_default',
]

const timeFrames = [
  { text: '3M', resolution: '240', description: '3 Months' },
  { text: '1M', resolution: '60', description: '1 Month' },
  { text: '7D', resolution: '30', description: '7 Days' },
  { text: '1D', resolution: '5', description: '1 Day' },
] as TimeFrameItem[]

const supportTimezone = getCurrentTimezone() as Timezone

export const DEFAULT_CHART_REALTIME_PROPS: Partial<ChartingLibraryWidgetOptions> = {
  locale: 'en',
  timezone: supportTimezone,
  library_path: '/static/charting_library/',
  interval: '5' as ResolutionString,
  fullscreen: false,
  autosize: true,
  debug: false,
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  theme: 'dark',
  time_frames: timeFrames,
  toolbar_bg: themeColors.neutral8,
  custom_css_url: '/static/styles-customize.css',

  overrides: {
    'paneProperties.background': themeColors.neutral8,
    'paneProperties.backgroundType': 'solid',
  },
}
