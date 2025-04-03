import { Dispatch, ReactNode, SetStateAction } from 'react'

import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { TimeFilterByEnum } from 'utils/config/enums'

import { CustomAlertFormValues } from '../types'

export interface TraderFilterProps {
  defaultValues?: CustomAlertFormValues
  onBack: () => void
  onApply: (filters: CustomAlertFormValues) => void
  matchingTraderCount: number
  setMatchingTraderCount: (value: number) => void
  submitting?: boolean
  isNew?: boolean
}

export interface TimeframeOption {
  label: ReactNode
  value: string
}

export interface TraderFilterState {
  name?: string
  description?: string
  timeFrame: TimeFilterByEnum
  protocols: string[] | 'all'
  pairs: string[] | 'all'
  condition: ConditionFormValues<TraderData>
}

export interface TraderFilterFormProps {
  isMobile: boolean
  timeFrame: TimeFilterByEnum
  setTimeFrame: (value: TimeFilterByEnum) => void
  protocols: string[] | 'all'
  setProtocols: (value: string[] | 'all') => void
  pairs: string[] | 'all'
  setPairs: (value: string[] | 'all') => void
  protocolOptions: { label: ReactNode; value: string }[]
  pairOptions: { label: ReactNode; value: string }[]
  conditionFormValues: ConditionFormValues<TraderData>
  setConditionFormValues: Dispatch<SetStateAction<ConditionFormValues<TraderData>>>
  matchingTraderCount: number
  setMatchingTraderCount: (value: number) => void
}

export interface TraderFilterFooterProps {
  hasChange: boolean
  name?: string
  description?: string
  timeFrame: TimeFilterByEnum
  protocols: string[] | 'all'
  pairs: string[] | 'all'
  conditionFormValues: ConditionFormValues<TraderData>
  matchingTraderCount: number
  limitFilterTraders: number
  changeName?: (value?: string) => void
  changeDescription?: (value?: string) => void
  handleResetFilter: () => void
  handleApplyFilter: (form?: CustomAlertFormValues) => void
  submitting?: boolean
  isNew?: boolean
}
