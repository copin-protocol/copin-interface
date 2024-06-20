import * as yup from 'yup'

import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'

export const okxWalletFormSchema = yup.object({
  name: yup.string().nullable().max(WALLET_NAME_MAX_LENGTH).label('Name'),
  apiKey: yup.string().required().label('API Key'),
  secretKey: yup.string().required().label('Secret Key'),
  passPhrase: yup.string().required().label('Pass Phrase'),
})

export interface OKXWalletFormValues {
  name?: string
  apiKey: string
  secretKey: string
  passPhrase: string
}

export const defaultFormValues: OKXWalletFormValues = {
  name: undefined,
  apiKey: '',
  secretKey: '',
  passPhrase: '',
}
