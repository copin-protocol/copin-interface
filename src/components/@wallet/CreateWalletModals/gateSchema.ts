import * as yup from 'yup'

import { WALLET_NAME_MAX_LENGTH } from 'utils/config/constants'

export const gateWalletFormSchema = yup.object({
  name: yup.string().nullable().max(WALLET_NAME_MAX_LENGTH).label('Name'),
  apiKey: yup.string().required().label('API Key'),
  secretKey: yup.string().required().label('Secret Key'),
})

export interface GateWalletFormValues {
  name?: string
  apiKey: string
  secretKey: string
}

export const defaultFormValues: GateWalletFormValues = {
  name: undefined,
  apiKey: '',
  secretKey: '',
}
