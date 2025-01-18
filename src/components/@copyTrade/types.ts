import { ReactNode } from 'react'

import {
  CopyTradePlatformEnum,
  CopyTradeSideEnum,
  CopyTradeTypeEnum,
  ProtocolEnum,
  SLTPTypeEnum,
} from 'utils/config/enums'

export interface CopyTradeFormValues {
  totalVolume?: number
  multipleCopy: boolean
  account?: string
  accounts?: string[]
  volume: number
  leverage: number
  tokenAddresses: string[]
  excludingTokenAddresses: string[]
  type?: CopyTradeTypeEnum
  protocol?: ProtocolEnum
  side: CopyTradeSideEnum
  stopLossType: SLTPTypeEnum
  stopLossAmount: number | undefined
  takeProfitType: SLTPTypeEnum
  takeProfitAmount: number | undefined
  lookBackOrders: number | null | undefined
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  serviceKey: string
  title: string
  reverseCopy: boolean
  duplicateToAddress?: string
  maxMarginPerPosition: number | null
  skipLowLeverage: boolean
  lowLeverage: number | undefined
  skipLowCollateral: boolean
  lowCollateral: number | undefined
  skipLowSize: boolean
  lowSize: number | undefined
  agreement: boolean
  copyAll: boolean
  hasExclude: boolean
}

export interface ExchangeOptions {
  value: CopyTradePlatformEnum
  label: ReactNode
  isDisabled?: boolean
}
