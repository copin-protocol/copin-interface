import { EventTypeEnum, RewardSymbolEnum } from 'utils/config/enums'

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
  slug: string
  title: string
  description: string
  bannerUrl: string
  thumbUrl?: string
  blogUrl?: string
  tutorialUrl?: string
  registerDate: string
  startDate: string
  endDate: string
  type: EventTypeEnum
  status: TradingEventStatusEnum
  rewardSymbol: RewardSymbolEnum
  maxReward: number
  rewardMilestones: { volume: number; reward: number; distribution: { rank: string; reward: number }[] }[]
  createdAt: string
  isPublic?: boolean
}

export enum TradingEventStatusEnum {
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
  ENDED = 'ENDED',
}
