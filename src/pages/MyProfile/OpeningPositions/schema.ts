import * as yup from 'yup'

import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'

export interface OnchainPositionData {
  index: number
  indexToken: string
  leverage: number
  collateral: number
  size: number
  averagePrice: number
  address: string
  copyPositionId?: string
  source?: string
  sourceProtocol?: ProtocolEnum
  fee?: number
  createdAt?: string
  lastOrderAt?: string
  tp?: number
  sl?: number
  pnl?: number
  roi?: number
  isLong: boolean
  protocol: ProtocolEnum
  status: PositionStatusEnum
}

export const configSchema = yup.object({
  enableMaxPositions: yup.boolean(),
  maxPositions: yup.number().when('enableMaxPositions', {
    is: true,
    then: (schema) => schema.min(1).required().label('Max Positions'),
  }),
})

export interface CopyTradeConfigFormValues {
  enableMaxPositions: boolean
  maxPositions: number
}
export const fieldName: { [key in keyof CopyTradeConfigFormValues]: keyof CopyTradeConfigFormValues } = {
  enableMaxPositions: 'enableMaxPositions',
  maxPositions: 'maxPositions',
}

export const defaultFormValues: CopyTradeConfigFormValues = {
  enableMaxPositions: false,
  maxPositions: 5,
}
