import * as yup from 'yup'

import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'

export const PASS_PHRASE_EXCHANGES = [
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.APEX,
]

export const apiWalletFormSchema = yup.object({
  name: yup.string().nullable().max(WALLET_NAME_MAX_LENGTH).label('Name'),
  apiKey: yup.string().required().label('API Key'),
  secretKey: yup.string().required().label('Secret Key'),
  passPhrase: yup
    .string()
    .when('exchange', (exchange, schema) => {
      if (PASS_PHRASE_EXCHANGES.includes(exchange)) return schema.required()
      return schema
    })
    .label('Pass Phrase'),
  omniSeed: yup
    .string()
    .when('exchange', (exchange, schema) => {
      if (exchange === CopyTradePlatformEnum.APEX) return schema.required()
      return schema
    })
    .label('Omni Key Seed'),
})

export interface ApiWalletFormValues {
  name?: string
  apiKey: string
  secretKey: string
  passPhrase: string
  exchange?: CopyTradePlatformEnum
  omniSeed?: string
}

export const defaultFormValues: ApiWalletFormValues = {
  name: undefined,
  apiKey: '',
  secretKey: '',
  passPhrase: '',
  exchange: undefined,
}
