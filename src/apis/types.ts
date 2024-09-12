import { CopierLeaderboardData } from 'entities/copier'
import {
  CopyTradeStatusEnum,
  LeaderboardTypeEnum,
  ProtocolEnum,
  SortTypeEnum,
  TimeFilterByEnum,
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

type PaginationParams = {
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

export type SearchTradersParams = GetApiParams & {
  keyword?: string
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
}

export type GetCopyTradeSettingsParams = GetApiParams & {
  accounts?: string[]
  userId?: string
  status?: CopyTradeStatusEnum
  protocol?: ProtocolEnum
}

export type GetMyPositionsParams = GetApiParams & {
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

export type GetLeaderboardParams = GetApiParams & {
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
}
