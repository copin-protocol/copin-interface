import * as yup from 'yup'

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
