import { useMemo } from 'react'

import { HlAccountData, HlAccountSpotData } from 'entities/hyperliquid'

const useHyperliquidAccountSummary = ({
  hlAccountData,
  hlAccountSpotData,
}: {
  hlAccountData?: HlAccountData
  hlAccountSpotData?: HlAccountSpotData[]
}) => {
  const accountValue = Number(hlAccountData?.marginSummary?.accountValue)
  const totalNtlPos = Number(hlAccountData?.marginSummary?.totalNtlPos)
  const totalMarginUsed = Number(hlAccountData?.marginSummary?.totalMarginUsed)
  const withdrawable = Number(hlAccountData?.withdrawable)
  const withdrawablePercent = (withdrawable / accountValue) * 100

  let unrealizedPnl = 0
  let longValue = 0
  let shortValue = 0

  hlAccountData?.assetPositions?.forEach((pos) => {
    const value = Number(pos.position.positionValue)
    const pnl = Number(pos.position.unrealizedPnl)
    unrealizedPnl += pnl
    if (Number(pos.position.szi) >= 0) {
      longValue += value
    } else {
      shortValue += value
    }
  })

  const totalPosValue = longValue + shortValue
  const longPercent = totalPosValue > 0 ? (longValue / totalPosValue) * 100 : 0
  const shortPercent = totalPosValue > 0 ? (shortValue / totalPosValue) * 100 : 0

  const marginUsage = accountValue > 0 ? (totalMarginUsed / accountValue) * 100 : 0
  const leverage = accountValue > 0 ? totalNtlPos / accountValue : 0
  const roe = accountValue > 0 ? (unrealizedPnl / accountValue) * 100 : 0

  const directionBias = longValue >= shortValue ? 'LONG' : 'SHORT'

  const spotValue = useMemo(() => {
    return (
      hlAccountSpotData?.reduce((sum, item) => {
        return sum + item.currentValue
      }, 0) ?? 0
    )
  }, [hlAccountSpotData])
  const totalValue = accountValue + spotValue

  return {
    totalValue,
    spotValue,
    accountValue,
    totalNtlPos,
    totalPosValue,
    totalMarginUsed,
    withdrawable,
    withdrawablePercent,
    unrealizedPnl,
    longValue,
    shortValue,
    longPercent,
    shortPercent,
    marginUsage,
    leverage,
    roe,
    directionBias,
  }
}

export default useHyperliquidAccountSummary
