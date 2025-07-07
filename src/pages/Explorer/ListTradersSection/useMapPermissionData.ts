import { ResponseTraderData } from 'entities/trader'

export default function useMapPermissionData() {
  const getData = (sourceData: ResponseTraderData) => {
    const result: Partial<ResponseTraderData> = {
      ...sourceData,
    }
    const sourcePair = result.pairs
    if (sourcePair == null) {
      result.pairs = ['ETH-USDT', 'BTC-USDT', 'SOL-USDT']
    }

    const sourceLastTradeAt = result.lastTradeAt
    if (sourceLastTradeAt == null) {
      result.lastTradeAt = new Date().toUTCString()
    }
    TRADER_STATISTIC_NUMBER_FIELD.forEach((field) => {
      const source = result[field]
      if (source == null) {
        result[field] = field === 'unrealisedPnl' ? ('' as any) : (Math.round(Math.random() * 10000) as any) ////prevent random unRealisedPnl when switch Pnl button
      }
    })

    return result as ResponseTraderData
  }
  return { getData }
}

const TRADER_STATISTIC_NUMBER_FIELD: (keyof ResponseTraderData)[] = [
  'lastTradeAtTs',
  'avgRoi',
  'pnl',
  'realisedAvgRoi',
  'realisedPnl',
  'winRate',
  'totalVolume',
  'avgLeverage',
  'avgVolume',
  'maxLeverage',
  'minLeverage',
  'profitLossRatio',
  'realisedProfitLossRatio',
  'runTimeDays',
  'avgDuration',
  'totalFee',
  'totalLiquidation',
  'totalLose',
  'totalTrade',
  'maxDuration',
  'minDuration',
  'longRate',
  'orderPositionRatio',
  'gainLossRatio',
  'maxDrawdown',
  'maxDrawdownPnl',
  'maxRoi',
  'profitRate',
  'totalGain',
  'totalLoss',
  'totalLongVolume',
  'totalShortVolume',
  'sharpeRatio',
  'sortinoRatio',
  'winStreak',
  'loseStreak',
  'maxWinStreak',
  'maxLoseStreak',
  'longPnl',
  'shortPnl',
  'realisedLongPnl',
  'realisedShortPnl',
  'realisedSharpeRatio',
  'realisedSortinoRatio',
  'realisedGainLossRatio',
  'realisedMaxDrawdown',
  'realisedMaxDrawdownPnl',
  'realisedMaxRoi',
  'realisedProfitRate',
  'realisedTotalGain',
  'realisedTotalLoss',
  'totalWin',
  'unrealisedPnl',
]
