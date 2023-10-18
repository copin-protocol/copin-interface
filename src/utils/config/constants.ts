import { isMobile } from 'hooks/helpers/useIsMobile'

export const SUPPORTED_LOCALES = ['en']
export const DEFAULT_LOCALE = 'en'

export const LINKS = {
  website: 'https://copin.io',
  webapp: 'https://app.copin.io',
  arbitrumExplorer: 'https://arbiscan.io',
  gmxHouse: 'https://www.gmx.house/arbitrum',
  tradeGMX: 'https://gmx.io/#/?ref=copin',
  tradeKwenta: 'https://kwenta.eth.limo/?ref=copin',
  github: 'https://github.com/copin-protocol',
  twitter: 'https://twitter.com/intent/follow?region=follow_link&screen_name=copin_io',
  discord: 'https://discord.gg/jaJu8USARd',
  telegram: 'https://t.me/Copin_io',
  docs: 'https://docs.copin.io/',
  policy: 'https://docs.copin.io/another/privacy-policy',
  termOfUse: 'https://docs.copin.io/another/terms-of-service',
  upgradePremium: 'https://docs.copin.io/upgrade-to-premium',
  referralProgram: 'https://docs.copin.io/features/referral-program',
}

export const NAVBAR_HEIGHT = 60
export const FOOTER_HEIGHT = 40

export const FONT_FAMILY = 'Anuphan'
export const DATE_FORMAT = 'YYYY/MM/DD'
export const DAYJS_FULL_DATE_FORMAT = 'YYYY/MM/DD - HH:mm'
export const DEFAULT_LIMIT = 20
export const DEFAULT_LIMIT_VALUES = [20, 50, 100]
export const MIN_PARSE_ETHER = 0.00000001
export const MIN_AMOUNT = 0.01
export const SEARCH_DEBOUNCE_TIME = 200 //ms

export const COUNTDOWN_TIME = 60 // s
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export const CHART_DAYS_DURATION = 30
export const CHART_DATE_FORMAT = 'DD.MM'
export const CHART_MIN_HEIGHT = 320
export const YAXIS_WIDTH = isMobile ? 50 : 85
export const MIN_TICK_GAP = 30

export const DELAY_SYNC = 3 * 1000 //milliseconds

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 //mb

export const DEFAULT_COVER_IMAGE_URL = '/images/cover.png'

export const REFERRAL_CODE_LENGTH = 6
