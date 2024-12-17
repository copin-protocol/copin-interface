import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

import { REFLECT_DATA_FIELDS } from '../constants/field'

export function formatPerpDexData(data: PerpDEXSourceResponse) {
  if (!data) return data
  const newPerpDexData = { ...data }
  if (newPerpDexData.protocolInfos) {
    //@ts-ignore
    newPerpDexData.protocolInfos = newPerpDexData.protocolInfos.map((protocolInfo) => {
      const newProtocolDataData = { ...protocolInfo }
      REFLECT_DATA_FIELDS.forEach((field) => {
        //@ts-ignore
        newProtocolDataData[field] = data[field]
      })
      return newProtocolDataData
    })
  }
  return newPerpDexData
}
