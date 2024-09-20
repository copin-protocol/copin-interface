import { gql } from '@apollo/client'

export const SEARCH_TOP_OPENING_POSITIONS_QUERY = gql`
  query Search($index: String!, $protocols: [String!]!, $body: SearchPayload!) {
    searchTopOpeningPosition(index: $index, protocols: $protocols, body: $body) {
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

// id
//         synthetixPositionId
//         account
//         smartAccount
//         # name
//         protocol
//         indexToken
//         collateralToken
//         key
//         reverseIndex
//         logId
//         # blockTime
//         collateralInToken
//         collateral #null
//         lastCollateral #null
//         size
//         lastSizeNumber
//         lastSize
//         lastSizeInToken
//         sizeInToken
//         averagePrice
//         # lastPriceNumber
//         # maxSizeNumber
//         fee
//         # feeNumber
//         feeInToken
//         lastFunding
//         funding
//         fundingInToken
//         # totalVolume
//         pnl #null
//         roi #null
//         leverage #null
//         orderCount
//         orderIncreaseCount
//         orderDecreaseCount
//         openBlockNumber
//         openBlockTime
//         closeBlockNumber
//         closeBlockTime
//         durationInSecond
//         isLong
//         isWin
//         isLiquidate
//         # marginMode
//         status
//         txHashes
//         orderIds
//         # orders
//         createdAt
//         realisedPnlInToken
//         realisedPnl
//         realisedRoi
