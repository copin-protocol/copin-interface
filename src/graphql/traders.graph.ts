import { gql } from '@apollo/client'

export const SEARCH_TRADERS_QUERY = gql`
  query Search($index: String!, $body: SearchPayload!) {
    searchPositionStatistic(index: $index, body: $body) {
      data {
        id
        account
        protocol
        type
        maxDuration
        minDuration
        avgDuration
        realisedTotalGain #totalGain
        totalLose
        totalLoss
        totalWin
        totalTrade
        totalLiquidation
        totalLiquidationAmount
        totalFee
        avgVolume
        totalVolume
        gainLossRatio
        orderPositionRatio
        profitLossRatio
        winRate
        longRate
        profitRate
        pnl
        unrealisedPnl
        avgRoi
        maxRoi
        maxPnl
        avgLeverage
        maxLeverage
        minLeverage
        runTimeDays
        indexTokens
        lastTradeAt
        lastTradeAtTs
        statisticAt
        createdAt
        updatedAt
        realisedTotalGain
        realisedTotalLoss
        realisedPnl
        realisedAvgRoi
        realisedMaxRoi
        realisedMaxPnl
        realisedMaxDrawdown
        realisedMaxDrawdownPnl
        realisedProfitRate
        realisedGainLossRatio
        realisedProfitLossRatio
        totalGain
        pairs
      }
      meta {
        total
        limit
        offset
        totalPages
      }
    }
  }
`
