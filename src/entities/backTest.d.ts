import { ProtocolEnum, SLTPTypeEnum, SortTypeEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'

import { PositionData } from './trader'

export interface RequestBackTestData {
  accounts: string[]
  balance: number
  orderVolume: number
  tokenAddresses?: string[]
  leverage: number
  fromTime: number
  toTime: number
  lookBackOrders?: number | null
  volumeProtection?: boolean
  enableStopLoss?: boolean
  enableTakeProfit?: boolean
  stopLossAmount?: number
  stopLossType?: SLTPTypeEnum
  takeProfitAmount?: number
  takeProfitType?: SLTPTypeEnum
  reverseCopy?: boolean
  maxVolMultiplier?: number | null
  isReturnPositions?: boolean
  copyAll?: boolean
}

export type UpdateBackTestData = Partial<RequestBackTestData>

export interface SimulatorPosition {
  position?: PositionData
  preBalance?: number
  balance?: number
  profit?: number
  roi?: number
  volMultiplier?: number
  stopLoss?: boolean
  liquidate?: boolean
}

export interface BackTestResultData {
  account: string
  protocol: ProtocolEnum
  totalWin: number
  totalLose: number
  totalGain: number
  totalLoss: number
  minPnl: number
  maxPnl: number
  simulatorPositions?: SimulatorPosition[]
  maxDrawDown: number
  maxDrawUp: number
  maxDrawDownRoi: number
  maxDrawDownPnl: number
  maxVolMultiplier: number
  minRoi: number
  maxRoi: number
  avgRoi: number
  profit: number
  roi: number
  orderPositionRatio: number
  gainLossRatio: number
  winLoseRatio: number
  profitLossRatio: number
  totalTrade: number
  totalStopLoss: number
  totalTakeProfit?: number
  totalLiquidate: number
  roiWMaxDrawDownRatio: number
  profitRate: number
  winRate: number
  fundTier: string
  volumeSuggestion: number
}

export interface BackTestTradersResultData {
  id?: string
  account?: string
  totalWin?: number
  totalLose?: number
  totalGain?: number
  totalLoss?: number
  profit?: number
  type?: TimeFrameEnum
  statisticAt?: string
  minPnl?: number
  maxDrawDown?: number
  maxDrawUp?: number
  roi?: number
  roiWMaxDrawDownRatio?: number
  winLoseRatio?: number
  // maxDrawDownRoi?: number
  // maxDrawDownPnl?: number
  // maxDuration?: number
  // minDuration?: number
  // avgDuration?: number
  // profitLossRatio?: 4.410594348613693
  // minRoi?: -13.77
  // maxRoi?: 57.5
  // avgRoi?: 9.6645
  // avgVolume?: 6062.664675
}
export interface RequestBackTestTradersData {
  statisticType: TimeFilterByEnum
  balance: number
  volume: number
  leverage: number
  volumeProtection: boolean
  lookBackOrders: number | null
  fromTime: number
  toTime: number
  limit: number
  ranges: {
    fieldName: keyof BackTestTradersResultData
    gte?: number
    lte?: number
  }[]
  sorts: {
    sortBy: keyof BackTestTradersResultData
    sortType: SortTypeEnum
  }[]
}
