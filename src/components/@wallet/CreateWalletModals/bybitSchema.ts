import * as yup from 'yup'

import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'

export const apiWalletFormSchema = yup.object({
  name: yup.string().nullable().max(WALLET_NAME_MAX_LENGTH).label('Name'),
  apiKey: yup.string().required().label('API Key'),
  secretKey: yup.string().required().label('Secret Key'),
})

export interface ApiWalletFormValues {
  name?: string
  apiKey: string
  secretKey: string
}

export const defaultFormValues: ApiWalletFormValues = {
  name: undefined,
  apiKey: '',
  secretKey: '',
}
