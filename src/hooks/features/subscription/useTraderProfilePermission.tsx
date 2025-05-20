import { TraderProfilePermission, TraderProfilePermissionConfig } from 'entities/permission'
import { ProtocolEnum, SubscriptionPermission, TimeFrameEnum } from 'utils/config/enums'
import { decodeRealised } from 'utils/helpers/handleRealised'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'
import useProtocolPermission from './useProtocolPermission'

export default function useTraderProfilePermission({ protocol }: { protocol?: ProtocolEnum }) {
  const { allowedSelectProtocols, pagePermission: protocolPagePermission } = useProtocolPermission()
  const { userPermission, pagePermission, myProfile } = useGetSubscriptionPermission<
    TraderProfilePermission,
    TraderProfilePermissionConfig
  >({
    section: SubscriptionPermission.TRADER_PROFILE,
  })
  const requiredPlanToUnlimitedPosition = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.isEnablePosition && pagePermission?.[plan]?.maxPositionHistory === 0,
  })
  const requiredPlanToViewPosition = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnablePosition,
  })
  const requiredPlanToBacktest = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableBackTest,
  })
  const requiredPlanToCompareTrader = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableCompareTrader,
  })
  const requiredPlanToTokenStats = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableTokenStats,
  })
  const requiredPlanToTraderStats = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableTraderStats,
  })
  const requiredPlanToTraderRanking = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.traderRankingFields?.length,
  })
  const requiredPlanToMaxTraderRanking = getRequiredPlan({
    conditionFn: (plan) =>
      !!pagePermission?.[plan]?.traderRankingFields?.length && pagePermission?.[plan]?.traderRankingFields?.length > 6,
  })
  const requiredPlanToProtocol = getRequiredPlan({
    conditionFn: (plan) => (protocol && protocolPagePermission?.[plan]?.protocolAllowed?.includes(protocol)) || false,
  })
  const requiredPlanToLast24H = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.timeFramesAllowed?.includes(TimeFrameEnum.LAST_24H),
  })
  const requiredPlanToYesterday = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.timeFramesAllowed?.includes(TimeFrameEnum.A_DAY),
  })
  const getRequiredPlanByTimeframe = (timeframe: TimeFrameEnum) =>
    getRequiredPlan({
      conditionFn: (plan) => !!pagePermission?.[plan]?.timeFramesAllowed?.includes(timeframe),
    })
  const getEnableByTimeframe = (timeframe: TimeFrameEnum) => timeFramesAllowed?.includes(timeframe)
  const isEnablePosition = userPermission?.isEnablePosition
  const isEnableOpeningPosition = userPermission?.isEnableOpeningPosition
  const isEnableCompareTrader = userPermission?.isEnableCompareTrader
  const isEnableTraderStats = userPermission?.isEnableTraderStats
  const isEnableTokenStats = userPermission?.isEnableTokenStats
  const isEnableBackTest = userPermission?.isEnableBackTest
  const traderRankingFields = userPermission?.traderRankingFields?.map((e) => decodeRealised(e)) ?? []
  const isEnableTraderRanking = traderRankingFields.length > 0
  const maxPositionHistory = userPermission?.maxPositionHistory ?? 0
  const isUnlimitedPosition = isEnablePosition && maxPositionHistory === 0
  const isAllowedProtocol = protocol && allowedSelectProtocols.includes(protocol)
  const timeFramesAllowed = userPermission?.timeFramesAllowed ?? []
  const isEnableLast24H = timeFramesAllowed?.includes(TimeFrameEnum.LAST_24H)
  const isEnableYesterday = timeFramesAllowed?.includes(TimeFrameEnum.A_DAY)

  return {
    myProfile,
    userPermission,
    pagePermission,
    isEnableBackTest,
    isEnableTraderStats,
    isEnableTokenStats,
    isEnableCompareTrader,
    isEnableOpeningPosition,
    isEnablePosition,
    maxPositionHistory,
    isUnlimitedPosition,
    traderRankingFields,
    isEnableTraderRanking,
    isAllowedProtocol,
    timeFramesAllowed,
    isEnableLast24H,
    isEnableYesterday,
    requiredPlanToUnlimitedPosition,
    requiredPlanToViewPosition,
    requiredPlanToBacktest,
    requiredPlanToCompareTrader,
    requiredPlanToTokenStats,
    requiredPlanToTraderStats,
    requiredPlanToTraderRanking,
    requiredPlanToMaxTraderRanking,
    requiredPlanToProtocol,
    requiredPlanToLast24H,
    requiredPlanToYesterday,
    getRequiredPlanByTimeframe,
    getEnableByTimeframe,
  }
}
