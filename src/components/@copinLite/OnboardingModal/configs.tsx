import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { TraderLabelEnum } from 'utils/config/enums'

export const LABEL_CONFIG_MAPPING: Record<
  TraderLabelEnum,
  { label: ReactNode; tooltipContent: ReactNode; key: TraderLabelEnum }
> = {
  [TraderLabelEnum.SHORT_TERM]: {
    label: <Trans>Short Term (Day)</Trans>,
    tooltipContent: <Trans>Position average duration less than 24 hours.</Trans>,
    key: TraderLabelEnum.SHORT_TERM,
  },
  [TraderLabelEnum.MIDDLE_TERM]: {
    label: <Trans>Middle Term (Week)</Trans>,
    tooltipContent: <Trans>Position average duration between 24 hours to 7 days.</Trans>,
    key: TraderLabelEnum.MIDDLE_TERM,
  },
  [TraderLabelEnum.LONG_TERM]: {
    label: <Trans>Long Term (Month)</Trans>,
    tooltipContent: <Trans>Position average duration more than 7 days.</Trans>,
    key: TraderLabelEnum.LONG_TERM,
  },
  [TraderLabelEnum.SHARK_WHALE]: {
    label: <Trans>Shark / Whale</Trans>,
    tooltipContent: <Trans>Traders have average volume more than $1M</Trans>,
    key: TraderLabelEnum.SHARK_WHALE,
  },
  [TraderLabelEnum.TOP_PROFIT]: {
    label: <Trans>Top Profit</Trans>,
    tooltipContent: <Trans>Traders have profit rate more than 80%.</Trans>,
    key: TraderLabelEnum.TOP_PROFIT,
  },
  [TraderLabelEnum.HIGH_FREQUENCY]: {
    label: <Trans>High Frequency</Trans>,
    tooltipContent: <Trans>Traders trade more than 1 position a day.</Trans>,
    key: TraderLabelEnum.HIGH_FREQUENCY,
  },
  [TraderLabelEnum.WIN_STREAK]: {
    label: <Trans>Win Streak</Trans>,
    tooltipContent: <Trans>Traders has win rate more than 80%</Trans>,
    key: TraderLabelEnum.WIN_STREAK,
  },
  [TraderLabelEnum.TIER1_PAIRS]: {
    label: <Trans>BTC / ETH</Trans>,
    tooltipContent: <Trans>Traders usually trade BTC/ETH.</Trans>,
    key: TraderLabelEnum.TIER1_PAIRS,
  },
  [TraderLabelEnum.ALTCOIN_PAIRS]: {
    label: <Trans>Altcoins</Trans>,
    tooltipContent: <Trans>Traders usually trade Altcoin.</Trans>,
    key: TraderLabelEnum.ALTCOIN_PAIRS,
  },
  [TraderLabelEnum.MEME_PAIRS]: {
    label: <Trans>Meme</Trans>,
    tooltipContent: <Trans>Traders usually trade Meme Coin.</Trans>,
    key: TraderLabelEnum.MEME_PAIRS,
  },
}

export const LIST_FIND_TRADER_CONFIG = Object.values(LABEL_CONFIG_MAPPING)
