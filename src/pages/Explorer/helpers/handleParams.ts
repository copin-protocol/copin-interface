import { ConditionFormValues, RowValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData, TraderDataKey } from 'entities/trader'
import { ConditionType } from 'utils/types'

export function parseParams(string: string | undefined) {
  const result: ConditionFormValues<TraderData> = []
  if (!string) return result
  const keys: TraderDataKey[] = []
  const rows = string.split('___')
  const fields = rows.map((row) => row.split('__'))
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const rowData = {} as RowValues<TraderData>
    rowData.key = field[0] as TraderDataKey
    if (keys.includes(rowData.key)) continue
    rowData.conditionType = field[1] as ConditionType
    if (field[1] === 'gte') rowData.gte = Number(field[2])
    if (field[1] === 'lte') rowData.lte = Number(field[2])
    if (field[1] === 'between') {
      rowData.gte = Number(field[2])
      rowData.lte = Number(field[3])
    }
    if (field[1] === 'in') rowData.in = field[2]?.split('_')
    keys.push(rowData.key)
    result.push(rowData)
  }
  return result
}

export function stringifyParams(option: ConditionFormValues<TraderData>) {
  let params = ''
  Object.values(option).forEach((values, index) => {
    if (!!values) {
      const gte = values.gte ?? 0
      const lte = values.lte ?? 0
      const inList = values.in ?? []
      if (index !== 0) {
        params += '___'
      }
      if (values.key) params += values.key
      if (values.conditionType) {
        params += '__'
        params += values.conditionType
      }
      if (values.conditionType === 'between') {
        params += '__'
        params += gte.toString()
        params += '__'
        params += lte.toString()
        return
      }
      if (values.conditionType === 'gte') {
        params += '__'
        params += gte.toString()
        return
      }
      if (values.conditionType === 'lte') {
        params += '__'
        params += lte.toString()
      }
      if (values.conditionType === 'in') {
        params += '__'
        params += inList.join('_')
      }
    }
  })
  return params
}
