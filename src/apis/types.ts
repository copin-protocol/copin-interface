import { CopyTradeStatusEnum, ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'

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
export type PaginationParmas = {
  limit?: number
  offset?: number
}

export interface RangeFilter {
  fieldName: string
  in?: string[]
  gte?: number
  lte?: number
}

export interface QueryFilter {
  fieldName: string
  value?: string | TimeFilterByEnum
}

export type RequestBodyApiData = {
  pagination?: PaginationParmas
  queries?: QueryFilter[]
  ranges?: RangeFilter[]
  sortBy?: string
  sortType?: SortTypeEnum
  keyword?: string
}

export type GetCopyTradeSettingsParams = GetApiParams & {
  accounts?: string[]
  userId?: string
  status?: CopyTradeStatusEnum
  protocol?: ProtocolEnum
}

export type GetMyPositionsParams = GetApiParams & {
  status?: string[]
  copyTrades?: string[]
  isLong?: boolean
  identifyKey?: string
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: string
}
