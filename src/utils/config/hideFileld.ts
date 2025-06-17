import { DISABLED_FIELDS } from './constants'
import { ProtocolEnum } from './enums'

export const hideField = <T extends { protocol: ProtocolEnum }>(t: T) => {
  const fieldsDisabled = DISABLED_FIELDS[t.protocol]
  if (!fieldsDisabled?.length) return t
  const newData: T = { ...t }
  fieldsDisabled.forEach((field) => {
    // @ts-ignore
    newData[field] = undefined
  })
  return newData
}
