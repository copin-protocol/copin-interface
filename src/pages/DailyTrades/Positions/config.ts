import { gql } from '@apollo/client'

export const SEARCH_POSITIONS_INDEX = 'copin.positions'
export const SEARCH_POSITIONS_FUNCTION_NAME = 'searchTopOpeningPosition'

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
