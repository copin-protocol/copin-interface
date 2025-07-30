import { gql } from '@apollo/client'

export const SEARCH_POSITIONS_INDEX = 'copin.positions'
export const SEARCH_ORDERS_INDEX = 'copin.orders'
export const SEARCH_TRADER_STATISTIC_INDEX = 'copin.position_statistics'

export const SEARCH_POSITIONS_FUNCTION_NAME = 'livePosition'
export const SEARCH_ORDERS_FUNCTION_NAME = 'searchOrders'
export const SEARCH_TRADERS_STATISTIC_FUNCTION_NAME = 'searchPositionStatistic'
export const SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME = 'searchTopOpeningPosition'
export const SEARCH_HOME_TRADERS_FUNCTION_NAME = 'homePositionStatistic'

export const SEARCH_TRADERS_STATISTIC_QUERY = getTraderStatisticQuery(SEARCH_TRADERS_STATISTIC_FUNCTION_NAME)

export const SEARCH_HOME_TRADERS_STATISTIC_QUERY = getTraderStatisticQuery(SEARCH_HOME_TRADERS_FUNCTION_NAME)

function getTraderStatisticQuery(functionName: string) {
  return gql`
  query Search($index: String!, $body: SearchPayload!) {
    ${functionName}(index: $index, body: $body) {
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
        longPnl
        shortPnl
        avgLeverage
        maxLeverage
        minLeverage
        totalLongVolume
        totalShortVolume
        sharpeRatio
        sortinoRatio
        winStreak
        loseStreak
        maxWinStreak
        maxLoseStreak
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
        realisedLongPnl
        realisedShortPnl
        realisedMaxDrawdown
        realisedMaxDrawdownPnl
        realisedProfitRate
        realisedGainLossRatio
        realisedProfitLossRatio
        realisedSharpeRatio
        realisedSortinoRatio
        totalGain
        pairs
        maxDrawdown
        maxDrawdownPnl
        ifLabels
        ifGoodMarkets
        ifBadMarkets
        statisticLabels
        aggregatedLabels
        realisedStatisticLabels
        realisedAggregatedLabels
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
}

export const SEARCH_DAILY_ORDERS_QUERY = gql`
  query Search($index: String!, $body: SearchPayload!) {
    ${SEARCH_ORDERS_FUNCTION_NAME}(index: $index, body: $body) {
      data  {
        id
        account
        key
        protocol
        txHash
        indexToken
        collateralToken
        sizeDeltaNumber
        sizeNumber
        collateralDeltaNumber
        collateralNumber
        collateralDeltaInTokenNumber
        sizeDeltaInTokenNumber
        realisedPnlNumber
        priceNumber
        sizeTokenNumber
        averagePriceNumber
        feeNumber
        fundingNumber
        realisedPnl
        isLong
        isOpen
        isClose
        leverage
        type
        logId
        blockNumber
        protocol
        blockTime
        createdAt
        pair
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

export const SEARCH_DAILY_POSITIONS_QUERY = gql`
  query Search($index: String!, $protocols: [String!]!, $body: SearchPayload!) {
    ${SEARCH_POSITIONS_FUNCTION_NAME}(index: $index, protocols: $protocols, body: $body) {
      data {
        id
        synthetixPositionId
        account
        smartAccount
        # name
        protocol
        indexToken
        collateralToken
        key
        reverseIndex
        logId
        # blockTime
        collateralInToken
        collateral #null
        lastCollateral #null
        size
        lastSizeNumber
        lastSize
        lastSizeInToken
        sizeInToken
        averagePrice
        # lastPriceNumber
        # maxSizeNumber
        fee
        # feeNumber
        feeInToken
        lastFunding
        funding
        fundingInToken
        # totalVolume
        pnl #null
        roi #null
        leverage #null
        orderCount
        orderIncreaseCount
        orderDecreaseCount
        openBlockNumber
        openBlockTime
        closeBlockNumber
        closeBlockTime
        durationInSecond
        isLong
        isWin
        isLiquidate
        # marginMode
        status
        txHashes
        # orderIds
        # orders
        pair
        createdAt
        realisedPnlInToken
        realisedPnl
        realisedRoi
        updatedAt
        createdAt
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

export const SEARCH_DAILY_POSITION_ID_QUERY = gql`
  query Search($index: String!, $protocols: [String!]!, $body: SearchPayload!) {
    ${SEARCH_POSITIONS_FUNCTION_NAME}(index: $index, protocols: $protocols, body: $body) {
      data {
        id
        synthetixPositionId
        account
        smartAccount
        protocol
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

export const SEARCH_TOP_OPENING_POSITIONS_QUERY = gql`
  query Search($index: String!, $protocols: [String!]!, $body: SearchPayload!) {
    ${SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME}(index: $index, protocols: $protocols, body: $body) {
      data {
        id
        synthetixPositionId
        account
        smartAccount
        # name
        protocol
        indexToken
        collateralToken
        key
        reverseIndex
        logId
        # blockTime
        collateralInToken
        collateral #null
        lastCollateral #null
        size
        lastSizeNumber
        lastSize
        lastSizeInToken
        sizeInToken
        averagePrice
        # lastPriceNumber
        # maxSizeNumber
        fee
        # feeNumber
        feeInToken
        lastFunding
        funding
        fundingInToken
        # totalVolume
        pnl #null
        roi #null
        leverage #null
        orderCount
        orderIncreaseCount
        orderDecreaseCount
        openBlockNumber
        openBlockTime
        closeBlockNumber
        closeBlockTime
        durationInSecond
        isLong
        isWin
        isLiquidate
        # marginMode
        status
        txHashes
        orderIds
        # orders
        createdAt
        realisedPnlInToken
        realisedPnl
        realisedRoi
        pair
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
