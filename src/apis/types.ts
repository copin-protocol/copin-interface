import { CopierLeaderboardData } from 'entities/copier'
import { ResponseTraderData } from 'entities/trader'
import {
  CopyTradeStatusEnum,
  LeaderboardTypeEnum,
  ProtocolEnum,
  SortTypeEnum,
  TimeFilterByEnum,
  TraderLabelEnum,
} from 'utils/config/enums'

export class ResponseError extends Error {
  messages: string[]
  constructor(messages: string[]) {
    super()
    this.message = messages.join('. ')
    this.messages = messages
  }
}

export type GetApiParams = {
  limit?: number
  offset?: number
}

export interface RangeFilter<T = string> {
  fieldName: T
  in?: string[]
  gte?: number
  lte?: number
}

export interface QueryFilter {
  fieldName: string
  value?: string | TimeFilterByEnum
}

export type PaginationParams = {
  limit?: number
  offset?: number
}
export type RequestBodyApiData = {
  pagination?: PaginationParams
  queries?: QueryFilter[]
  ranges?: RangeFilter[]
  sortBy?: string
  sortType?: SortTypeEnum
  keyword?: string
  returnRanking?: boolean
  returnPnlStatistic?: boolean
} & Partial<Record<string, any>>

export type SearchTradersParams = PaginationParams & {
  keyword?: string
  protocol?: ProtocolEnum
  protocols?: ProtocolEnum[]
  sortBy?: string
  sortType?: SortTypeEnum
}
export type SearchPositionByTxHashParams = PaginationParams & {
  txHash: string
  protocol?: ProtocolEnum
  protocols?: ProtocolEnum[]
  sortBy?: string
  sortType?: SortTypeEnum
}

export type GetCopyTradeSettingsParams = PaginationParams & {
  accounts?: string[]
  userId?: string
  status?: CopyTradeStatusEnum
  protocol?: ProtocolEnum
}

export type GetMyPositionsParams = PaginationParams & {
  status?: string[]
  isLong?: boolean
  identifyKey?: string
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: string
  copyWalletId?: string
}
export type GetMyPositionRequestBody = {
  copyTradeIds?: string[]
  traders?: string[]
  copyWalletId?: string
  copyWalletIds?: string[]
}

export type GetLeaderboardParams = PaginationParams & {
  queryDate?: number
  keyword?: string
  protocol?: ProtocolEnum
  statisticType?: LeaderboardTypeEnum
  sortBy?: string
  sortType?: SortTypeEnum
}

export type GetCopierLeaderboardParams = PaginationParams & {
  exchangeType?: CopierLeaderboardData['exchangeType']
  exchange?: CopierLeaderboardData['exchange']
  type?: CopierLeaderboardData['type']
  keyword?: string
  sortBy?: string
  sortType?: SortTypeEnum
  statisticAt?: string
}

export type GetTraderByLabelPayload = {
  statisticType: TimeFilterByEnum
  labels: TraderLabelEnum[]
  sortBy: keyof ResponseTraderData
  sortType: SortTypeEnum
  protocols: ProtocolEnum[]
}
