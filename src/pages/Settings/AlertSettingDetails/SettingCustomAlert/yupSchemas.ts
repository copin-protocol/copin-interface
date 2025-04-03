import * as yup from 'yup'

import { AlertCustomType } from 'utils/config/enums'

export const customSchema = yup.object({
  name: yup.string().required().label('Alert Name'),
  description: yup.string().label('Alert Description'),
  type: yup
    .string()
    .label('Time Frame')
    .when('customType', (customType, schema) => {
      if (customType === AlertCustomType.TRADER_FILTER) return schema.required()
      return schema
    }),
  // customType: yup.string().required().label('Object'),
})
