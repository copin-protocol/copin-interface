import { Trans } from '@lingui/macro'

import { SubscriptionFeatureEnum } from 'utils/config/enums'

import { UpgradeBenefitConfig } from './types'

export const UPGRADE_BENEFIT_CONFIG: Partial<Record<SubscriptionFeatureEnum, UpgradeBenefitConfig>> = {
  [SubscriptionFeatureEnum.TRADER_EXPLORER]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    modalMaxWidth: 800,
    listBenefitConfig: [
      {
        title: <Trans>More Metrics</Trans>,
        description: <Trans>Combine deeper insights to make good decisions</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_1.png',
      },
      {
        title: <Trans>More Filters</Trans>,
        description: <Trans>Find like-minded traders with advanced filters</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_2.png',
      },
      {
        title: <Trans>Percentile Filter</Trans>,
        description: <Trans>Filter by ranking and easily spot top performers</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_3.png',
      },
      {
        title: <Trans>More Protocols</Trans>,
        description: <Trans>Wider trader coverage for data-driven calls</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_4.png',
      },
      {
        title: <Trans>More CSV Download</Trans>,
        description: <Trans>Access more data for trader analysis</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_5.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.TRADER_FAVORITE]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    modalMaxWidth: 500,
    listBenefitConfig: [
      {
        title: <Trans>More Metrics</Trans>,
        description: <Trans>Combine deeper insights to make good decisions</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_1.png',
      },
      {
        title: <Trans>More Protocols</Trans>,
        description: <Trans>Wider trader coverage for data-driven calls</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_4.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.COPY_TRADE]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features to manage your copy trades</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>More Copy Trade Settings</Trans>,
        description: <Trans>Unlock more copy trade settings to optimize your profit strategy</Trans>,
        imageSrc: '/images/subscriptions/subscription_copy_trade_benefit_1.png',
      },
      {
        title: <Trans>Multiple-Traders Setting</Trans>,
        description: <Trans>Allows for easy management of traders with the same settings</Trans>,
        imageSrc: '/images/subscriptions/subscription_copy_trade_benefit_2.png',
      },
      {
        title: <Trans>Bulk Action Management</Trans>,
        description: <Trans>Bulk edit / clone / delete your copy trades in one go</Trans>,
        imageSrc: '/images/subscriptions/subscription_copy_trade_benefit_3.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.LIVE_TRADES]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>See Traders, collateral and more</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>More Metrics</Trans>,
        description: <Trans>Combine deeper insights to make good decisions</Trans>,
        imageSrc: '/images/subscriptions/subscription_live_trades_benefit_1.png',
      },
      {
        title: <Trans>More Protocols</Trans>,
        description: <Trans>Wider trader coverage for data-driven calls</Trans>,
        imageSrc: '/images/subscriptions/subscription_live_trades_benefit_2.png',
      },
      {
        title: <Trans>Live Data</Trans>,
        description: <Trans>Real-time data help you quickly stay ahead of the market</Trans>,
        imageSrc: '/images/subscriptions/subscription_live_trades_benefit_3.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.TRADER_PROFILE]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>More Protocols</Trans>,
        description: <Trans>Wider trader coverage for data-driven calls</Trans>,
        imageSrc: '/images/subscriptions/subscription_explorer_benefit_4.png',
      },
      {
        title: <Trans>More Tools</Trans>,
        description: <Trans>Unlock Backtest, Compare Trader and Analyze By AI</Trans>,
        imageSrc: '/images/subscriptions/subscription_trader_profile_benefit_1.png',
      },
      {
        title: <Trans>Token Preference</Trans>,
        description: <Trans>Know exactly which tokens this trader dominates</Trans>,
        imageSrc: '/images/subscriptions/subscription_trader_profile_benefit_2.png',
      },
      {
        title: <Trans>Full History</Trans>,
        description: <Trans>Exploring all trader’s history positions</Trans>,
        imageSrc: '/images/subscriptions/subscription_trader_profile_benefit_3.png',
      },
      {
        title: <Trans>More Time Frames</Trans>,
        description: <Trans>Instantly track trader daily performance</Trans>,
        imageSrc: '/images/subscriptions/subscription_trader_profile_benefit_4.png',
      },
      {
        title: <Trans>More Trader Ranking</Trans>,
        description: <Trans>Easily see how a trader stacks up against the rest</Trans>,
        imageSrc: '/images/subscriptions/subscription_trader_profile_benefit_5.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.TRADER_ALERT]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>More Watchlist Traders</Trans>,
        description: <Trans>Analyze traders behavior pre-copy trade setup</Trans>,
        imageSrc: '/images/subscriptions/subscription_alert_benefit_1.png',
      },
      {
        title: <Trans>Unlock Custom Alert</Trans>,
        description: <Trans>Allows you to personalize alert settings to suit your needs</Trans>,
        imageSrc: '/images/subscriptions/subscription_alert_benefit_2.png',
      },
      {
        title: <Trans>More Monthly Alert Quota</Trans>,
        description: <Trans>No missed signals from copied traders or watchlist</Trans>,
        imageSrc: '/images/subscriptions/subscription_alert_benefit_3.png',
      },
      {
        title: <Trans>More Alert Channels</Trans>,
        description: <Trans>Alert groups or trigger webhooks to stay synced with your community</Trans>,
        imageSrc: '/images/subscriptions/subscription_alert_benefit_4.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.OPEN_INTEREST]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    modalMaxWidth: 500,
    listBenefitConfig: [
      {
        title: <Trans>More Filters</Trans>,
        description: <Trans>Discover deeper insights with advanced filtering</Trans>,
        imageSrc: '/images/subscriptions/subscription_oi_benefit_1.png',
      },
      {
        title: <Trans>More Protocols</Trans>,
        description: <Trans>Broaden your view with more Open Interest data</Trans>,
        imageSrc: '/images/subscriptions/subscription_oi_benefit_2.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.COPY_MANAGEMENT]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>More Exchange support</Trans>,
        description: <Trans>Unlocking more exchanges brings more choices for your strategies</Trans>,
        imageSrc: '/images/subscriptions/subscription_copy_wallet_benefit_1.png',
      },
      {
        title: <Trans>More API connection</Trans>,
        description: <Trans>Unlock more APIs to optimize capital allocation and maximize profits</Trans>,
        imageSrc: '/images/subscriptions/subscription_copy_wallet_benefit_2.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.CEX_DEPTH]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>Depth Overview</Trans>,
        description: <Trans>Check depth levels of supported CEXs integrated with Copin</Trans>,
        imageSrc: '/images/subscriptions/subscription_cex_depth_benefit_1.png',
      },
      {
        title: <Trans>Copy Slippage Estimation</Trans>,
        description: <Trans>Check volume impact at every 0.1% depth level for each trader and pair</Trans>,
        imageSrc: '/images/subscriptions/subscription_cex_depth_benefit_2.png',
      },
    ],
  },
  [SubscriptionFeatureEnum.PERP_EXPLORER]: {
    title: <Trans>UPGRADE FOR MORE FUNCTIONALITY</Trans>,
    description: <Trans>Unlock more powerful features and gain deeper market insights</Trans>,
    listBenefitConfig: [
      {
        title: <Trans>Exchanges Overview</Trans>,
        description: <Trans>See volume, OI & PnL across all perpetual DEXes</Trans>,
        imageSrc: '/images/subscriptions/subscription_perp_explorer_benefit_1.png',
      },
      {
        title: <Trans>Exchange Details</Trans>,
        description: <Trans>Dive into performance of each exchange over time</Trans>,
        imageSrc: '/images/subscriptions/subscription_perp_explorer_benefit_2.png',
      },
      {
        title: <Trans>Exchange Events</Trans>,
        description: <Trans>Never miss every significant event on any exchange</Trans>,
        imageSrc: '/images/subscriptions/subscription_perp_explorer_benefit_3.png',
      },
    ],
  },
}
