import {
  CopierLeaderBoardExchangeType,
  CopierLeaderboardTimeFilterEnum,
  CopyTradePlatformEnum,
  SubscriptionPlanEnum,
} from 'utils/config/enums'

export interface CopierLeaderboardData {
  id: string
  exchangeType: CopierLeaderBoardExchangeType
  exchange: CopyTradePlatformEnum
  type: CopierLeaderboardTimeFilterEnum
  displayName: string
  ranking: number
  winRate: number
  totalWin: number
  totalLose: number
  estPnl: number
  volume: number
  statisticAt: string
  updatedAt: string
  createdAt: string
  plan: SubscriptionPlanEnum
  // custom field
  isMe: boolean
}
