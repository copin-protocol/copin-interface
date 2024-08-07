export interface FeeRebateData {
  epochLength?: number
  maxEpochs?: number
  currentEpochId?: number
  epochStart?: number
  epochEnd?: number
  maxReward?: number
  totalDistributedReward?: number
  claimableFees?: number
  claimedFees?: number
  ongoingFees?: number
  totalFees?: number
}

export interface EpochHistoryData {
  lastUpdated: number
  epochId: number
  epochStart: number
  epochEnd: number
  totalRewardPool: number
  status: number
  rebateData: EpochRebateData[]
}

export interface EpochRebateData {
  trader: string
  fee: number
}
