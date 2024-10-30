import * as yup from 'yup'

import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'

export const hyperliquidWalletFormSchema = yup.object({
  name: yup.string().nullable().max(WALLET_NAME_MAX_LENGTH).label('Name'),
  apiKey: yup.string().required().label('Hyperliquid Address'),
  secretKey: yup.string().required().label('API Wallet Private Key'),
  passPhrase: yup
    .string()
    .when('enableVault', {
      is: true,
      then: (schema) => schema.required(),
    })
    .label('Vault Address'),
  enableVault: yup.boolean().label('Enable Vault'),
})

export interface HyperliquidWalletFormValues {
  name?: string
  apiKey: string
  secretKey: string
  passPhrase?: string
  enableVault?: boolean
}

export const defaultFormValues: HyperliquidWalletFormValues = {
  name: undefined,
  apiKey: '',
  secretKey: '',
  passPhrase: undefined,
  enableVault: false,
}
