import { ApiListResponse } from 'apis/api'
import { TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'

import { CustomAlertFormValues } from '../types'

export interface TraderGroupProps {
  defaultValues?: CustomAlertFormValues
  groupTraders?: ApiListResponse<TraderAlertData>
  onBack: () => void
  onApply: (filters: CustomAlertFormValues) => void
  matchingTraderCount: number
  setMatchingTraderCount: (value: number) => void
  submitting?: boolean
  isNew?: boolean
}

export interface MobileTraderItemProps {
  data: TraderAlertData
  onUpdateWatchlist: (data: TraderAlertData) => void
  onRemoveWatchlist: (data: TraderAlertData) => void
}

export interface TraderGroupHeaderProps {
  name?: string
  totalTrader: number
  maxTraderAlert: number | undefined
  hasChange: boolean
  isNew?: boolean
  onBack: () => void
}

export interface TraderGroupSearchProps {
  totalTrader: number
  maxTraderAlert: number | undefined
  isVIPUser: boolean | null | undefined
  ignoreSelectTraders: { account: string; protocol: ProtocolEnum }[] | undefined
  searchText: string
  setSearchText: (value: string) => void
  onAddWatchlist: (data: TraderData) => void
  onRemoveWatchlist: (data: TraderData) => void
}

export interface TraderGroupListProps {
  isMobile: boolean
  paginatedTraders: ApiListResponse<TraderAlertData>
  columns: any[]
  onUpdateWatchlist: (data: TraderAlertData) => void
  onRemoveWatchlist: (data: TraderAlertData) => void
}

export interface TraderGroupFooterProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  filteredTraders: TraderAlertData[]
  paginatedTraders: ApiListResponse<TraderAlertData>
  hasChange: boolean
  handleReset: () => void
  handleApply: (form?: CustomAlertFormValues) => void
  submitting?: boolean
  isNew?: boolean
  traderGroupAdd: TraderAlertData[] | undefined
  traderGroupUpdate: TraderAlertData[] | undefined
  traderGroupRemove: TraderAlertData[] | undefined
  name?: string
  description?: string
}

// Define reducer state
export interface TraderGroupState {
  name: string | undefined
  description: string | undefined
  traderGroupAdd: TraderAlertData[] | undefined
  traderGroupUpdate: TraderAlertData[] | undefined
  traderGroupRemove: TraderAlertData[] | undefined
}

// Define reducer action types
export type TraderGroupAction =
  | { type: 'SET_NAME'; payload: string | undefined }
  | { type: 'SET_DESCRIPTION'; payload: string | undefined }
  | { type: 'ADD_TRADER'; payload: TraderData }
  | { type: 'ADD_TRADER'; payload: TraderData }
  | { type: 'UPDATE_TRADER'; payload: TraderAlertData }
  | { type: 'REMOVE_TRADER'; payload: TraderAlertData }
  | { type: 'RESET'; payload: CustomAlertFormValues | undefined }
