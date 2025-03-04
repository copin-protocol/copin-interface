import * as yup from 'yup'

export const customSchema = yup.object({
  name: yup.string().required().label('Alert Name'),
  description: yup.string().label('Alert Description'),
  type: yup.string().required().label('Time Frame'),
})
