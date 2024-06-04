// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import dayjs from 'dayjs'
import * as yup from 'yup'

export const backTestFormSchema = yup.object({
  leverage: yup.number().min(2).label('Leverage'),
  balance: yup
    .number()
    .required()
    .min(10)
    .when('orderVolume', (orderVolume, schema) => {
      if (!orderVolume || orderVolume <= 0) return schema
      return schema.min(orderVolume, t`Balance must be greater than or equal to margin`)
    })
    .label('Balance'),
  orderVolume: yup.number().required().min(1).label('Order Volume'),
  tokenAddresses: yup.array(yup.string()).required().min(1).label('Pairs'),
  startTime: yup
    .date()
    .required()
    .max(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate(), `Maximum start time must be today.`)
    .when('endTime', (endTime, schema) => {
      return schema.max(endTime)
    })
    .label('Start Time'),
  endTime: yup
    .date()
    .required()
    .max(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate(), `Maximum end time must be today.`)
    .label('End Time'),
  lookBackOrders: yup.number().nullable().min(1).integer(),
  stopLossAmount: yup.number().when('enableStopLoss', {
    is: true,
    then: (schema) => schema.required().min(1).label('Stop Loss Amount'),
  }),
  maxVolMultiplier: yup.number().min(0.1).label('Max Volume Multiplier'),
})
