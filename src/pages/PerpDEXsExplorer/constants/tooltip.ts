import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

export const TOOLTIP_CONTENT_MAPPING: Partial<Record<keyof PerpDEXSourceResponse, string>> = {
  type: 'The type of perp DEX, either Index-based (prices derived from an aggregate market index) or Orderbook-based (traditional order-matching system).',
  marginModes:
    'Available margin modes on the perp DEX, including Isolated (margin applies only to a specific position) and Cross (shared margin across multiple positions).',
  positionModes:
    'Supported position modes on the perp DEX, including One-way (single position direction) and Hedge (ability to hold both long and short positions simultaneously).',
  runTime:
    'The operational duration of the perp DEX, starting from the deployment date of its first contract on the blockchain.',
  collateralAssets: 'Types of assets that can be used as collateral for trading (e.g., USDT, ETH).',
  minCollateral: 'The minimum amount of collateral required to open a trade on the perp DEX.',
  minLeverage:
    'The lowest / highest leverage multiplier available for trades, defining the minimum / maximum borrowing capacity.',
  pairs: 'Supported trading pairs available on the perp DEX',
  oneClickTrading: 'Indicates if the perp DEX supports one-click trading functionality for faster execution.',
  token: 'The native token associated with the perp DEX, which may be used for fees, staking, or rewards.',
  invested: 'Total funds invested in the perp DEX across various funding rounds or investor contributions.',
  audit: 'Link to the security audit report(s) for the perp DEX’s smart contracts.',
  minTradingFee: 'The minimum / maximum trading fee percentage charged per transaction on the platform.',
  makerFee: 'The fee percentage for "maker" and "taker" orders on the perp DEX.',
  // takerFee: 'The fee percentage for "taker" orders that remove liquidity from the order book.',
  borrowFee: 'The percentage fee for borrowing funds for margin or leveraged trading on the perp DEX.',
  hasFundingFee:
    'Periodic fee exchanged between long and short positions to balance the open interest on the platform.',
  minReferralCommission:
    'The lowest / highest commission percentage given to users for referring others to the perp DEX.',
  rewards: 'Indicates if the perp DEX provides rewards or incentives for traders.',
  volume1d: 'Total trading volume across all traders over 1 day time frames.',
  volume7d: 'Total trading volume across all traders over 7 day time frames.',
  volume30d: 'Total trading volume across all traders over 30 day time frames.',
  volume: 'Total trading volume across all traders.',
  traders1d: 'Total number of active traders within specified time periods: 1 day.',
  traders7d: 'Total number of active traders within specified time periods: 7 days.',
  traders30d: 'Total number of active traders within specified time periods: 30 days.',
  traders: 'Total number of active traders within specified time periods: all-time.',
  traderPnl1d: 'Aggregate profit and loss (PnL) of traders over 1 day timeframes.',
  traderPnl7d: 'Aggregate profit and loss (PnL) of traders over 7 day timeframes.',
  traderPnl30d: 'Aggregate profit and loss (PnL) of traders over 30 day timeframes.',
  traderPnl: 'Aggregate profit and loss (PnL) of traders.',
  oi1d: 'Total open interest across all traders, representing the sum of open positions for 1 day timeframe.',
  oi7d: 'Total open interest across all traders, representing the sum of open positions for 7 day timeframe.',
  oi30d: 'Total open interest across all traders, representing the sum of open positions for 30 day timeframe.',
  oi: 'Total open interest across all traders, representing the sum of open positions.',
  revenue1d: 'Total protocol revenue from trading fees collected in one day.',
  revenue7d: 'Total protocol revenue from trading fees collected in a week.',
  revenue30d: 'Total protocol revenue from trading fees collected in a month.',
  revenue: 'Total protocol revenue from trading fees collected.',
  liquidations1d: 'Amount liquidated from traders’ positions in one day.',
  liquidations7d: 'Amount liquidated from traders’ positions in a week.',
  liquidations30d: 'Amount liquidated from traders’ positions in a month.',
  liquidations: 'Amount liquidated from traders’ positions.',
  longRatio1d: 'Ratio of long to short positions across all trading pairs on the Perp DEX.',
  longRatio7d: 'Ratio of long to short positions across all trading pairs on the Perp DEX.',
  longRatio30d: 'Ratio of long to short positions across all trading pairs on the Perp DEX.',
  longRatio: 'Ratio of long to short positions across all trading pairs on the Perp DEX.',
  longPnl1d: 'Total profit and loss (PnL) from long positions.',
  longPnl7d: 'Total profit and loss (PnL) from long positions.',
  longPnl30d: 'Total profit and loss (PnL) from long positions.',
  longPnl: 'Total profit and loss (PnL) from long positions.',
  shortPnl1d: 'Total profit and loss (PnL) from short positions.',
  shortPnl7d: 'Total profit and loss (PnL) from short positions.',
  shortPnl30d: 'Total profit and loss (PnL) from short positions.',
  shortPnl: 'Total profit and loss (PnL) from short positions.',
  longLiquidations1d: 'Amount of long positions liquidated.',
  longLiquidations7d: 'Amount of long positions liquidated.',
  longLiquidations30d: 'Amount of long positions liquidated.',
  longLiquidations: 'Amount of long positions liquidated.',
  shortLiquidations1d: 'Amount of short positions liquidated.',
  shortLiquidations7d: 'Amount of short positions liquidated.',
  shortLiquidations30d: 'Amount of short positions liquidated.',
  shortLiquidations: 'Amount of short positions liquidated.',
  avgPositionDuration1d: 'Average time positions remain open on the perp DEX.',
  avgPositionDuration7d: 'Average time positions remain open on the perp DEX.',
  avgPositionDuration30d: 'Average time positions remain open on the perp DEX.',
  avgPositionDuration: 'Average time positions remain open on the perp DEX.',
  avgPositionSize1d: 'The average size of trading positions taken by traders.',
  avgPositionSize7d: 'The average size of trading positions taken by traders.',
  avgPositionSize30d: 'The average size of trading positions taken by traders.',
  avgPositionSize: 'The average size of trading positions taken by traders.',
  volumeShare1d:
    'Volume Share represents the trading market share of each exchange over the total trading volume of all PerpDEX exchanges.',
  volumeShare7d:
    'Volume Share represents the trading market share of each exchange over the total trading volume of all PerpDEX exchanges.',
  volumeShare30d:
    'Volume Share represents the trading market share of each exchange over the total trading volume of all PerpDEX exchanges.',
  volumeShare:
    'Volume Share represents the trading market share of each exchange over the total trading volume of all PerpDEX exchanges.',
  feePerMillion1d: 'Fee per million is the amount of fees an exchange earns per 1 million USD in trading volume.',
  feePerMillion7d: 'Fee per million is the amount of fees an exchange earns per 1 million USD in trading volume.',
  feePerMillion30d: 'Fee per million is the amount of fees an exchange earns per 1 million USD in trading volume.',
  feePerMillion: 'Fee per million is the amount of fees an exchange earns per 1 million USD in trading volume.',
  averageFeeRate1d:
    'Average Fee Rate represents the average percentage of transaction fees paid by users on the total transaction volume.',
  averageFeeRate7d:
    'Average Fee Rate represents the average percentage of transaction fees paid by users on the total transaction volume.',
  averageFeeRate30d:
    'Average Fee Rate represents the average percentage of transaction fees paid by users on the total transaction volume.',
  averageFeeRate:
    'Average Fee Rate represents the average percentage of transaction fees paid by users on the total transaction volume.',
  openInterestShare1d: 'Open interest share reflects the market dominance of each exchange based on total OI.',
  openInterestShare7d: 'Open interest share reflects the market dominance of each exchange based on total OI.',
  openInterestShare30d: 'Open interest share reflects the market dominance of each exchange based on total OI.',
  openInterestShare: 'Open interest share reflects the market dominance of each exchange based on total OI.',
  openInterestToVolumeRatio1d:
    'A high Open Interest to Volume Ratio indicates that most positions are held overnight or long term, while a low Open Interest to Volume Ratio indicates a liquid market with few long term open positions.',
  openInterestToVolumeRatio7d:
    'A high Open Interest to Volume Ratio indicates that most positions are held overnight or long term, while a low Open Interest to Volume Ratio indicates a liquid market with few long term open positions.',
  openInterestToVolumeRatio30d:
    'A high Open Interest to Volume Ratio indicates that most positions are held overnight or long term, while a low Open Interest to Volume Ratio indicates a liquid market with few long term open positions.',
  openInterestToVolumeRatio:
    'A high Open Interest to Volume Ratio indicates that most positions are held overnight or long term, while a low Open Interest to Volume Ratio indicates a liquid market with few long term open positions.',
}
