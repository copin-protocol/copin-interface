import * as yup from 'yup'

export const apiWalletFormSchema = yup.object({
  name: yup.string().nullable().label('Name'),
  apiKey: yup.string().required().label('Api Key'),
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
