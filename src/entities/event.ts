export interface UserEventRankingData {
  id: string
  userId: string
  username: string
  volume: number
  estimateReward: number
  ranking?: number
  registerDate: string
  tradingEventId: string
  txHash?: string
  createdAt: string
}

export interface EventDetailsData {
  id: string
  title: string
  description: string
  registerDate: string
  startDate: string
  endDate: string
  status: TradingEventStatusEnum
  maxReward: number
  rewardMilestones: { volume: number; reward: number; distribution: { rank: string; reward: number }[] }[]
  createdAt: string
}

export enum TradingEventStatusEnum {
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
  ENDED = 'ENDED',
}
