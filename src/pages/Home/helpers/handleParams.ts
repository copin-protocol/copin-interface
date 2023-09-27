import { TraderDataKey } from 'entities/trader'
import { ConditionType } from 'utils/types'

import { ConditionFormValues, RowValues } from '../ConditionFilter/types'

export function parseParams(string: string | undefined) {
  const result: ConditionFormValues = []
  if (!string) return result
  const keys: TraderDataKey[] = []
  const rows = string.split('__')
  const fields = rows.map((row) => row.split('_'))
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const rowData = {} as RowValues
    rowData.key = field[0] as TraderDataKey
    if (keys.includes(rowData.key)) continue
    rowData.conditionType = field[1] as ConditionType
    if (field[1] === 'gte') rowData.gte = Number(field[2])
    if (field[1] === 'lte') rowData.lte = Number(field[2])
    if (field[1] === 'between') {
      rowData.gte = Number(field[2])
      rowData.lte = Number(field[3])
    }
    keys.push(rowData.key)
    result.push(rowData)
  }
  return result
}

export function stringifyParams(option: ConditionFormValues) {
  let params = ''
  Object.values(option).forEach((values, index) => {
    if (!!values) {
      if (index !== 0) {
        params += '__'
      }
      if (values.key) params += values.key
      if (values.conditionType) {
        params += '_'
        params += values.conditionType
      }
      if (typeof values.gte === 'number') {
        params += '_'
        params += values.gte.toString()
      }
      if (typeof values.lte === 'number') {
        params += '_'
        params += values.lte.toString()
      }
    }
  })
  return params
}
