import dayjs from 'dayjs'

import { getFiltersFromFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { ConditionFormValues, FilterValues, RowValues } from 'components/@widgets/ConditionFilterForm/types'
import { BotAlertData, CustomAlertConfigData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import { AlertCustomType, TimeFilterByEnum } from 'utils/config/enums'
import { getPairFromSymbol, getSymbolFromPair } from 'utils/helpers/transform'

import { CustomAlertFormValues } from './types'

export function getDefaultValues(botAlert?: BotAlertData) {
  const isNew = botAlert?.id === 'new'
  const defaultValues = {
    name: botAlert?.name,
    description: botAlert?.description,
  } as CustomAlertFormValues
  switch (botAlert?.type) {
    case AlertCustomType.TRADER_FILTER:
      defaultValues.customType = AlertCustomType.TRADER_FILTER
      defaultValues.type = botAlert?.config?.type ?? TimeFilterByEnum.S30_DAY
      defaultValues.protocols = botAlert?.config?.['protocol']?.in
      defaultValues.pairs = botAlert?.config?.['pairs']?.in?.map((pair) => getSymbolFromPair(pair))
      defaultValues.condition = convertConfigToConditionValues(botAlert?.config)
      break
    case AlertCustomType.TRADER_GROUP:
      defaultValues.customType = AlertCustomType.TRADER_GROUP
      break
  }

  return defaultValues
}

export function convertConfigToConditionValues(config?: CustomAlertConfigData): ConditionFormValues<TraderData> {
  if (!config) return []

  const result: ConditionFormValues<TraderData> = []

  // Filter out type, protocol, pairs
  const filteredConfig = Object.entries(config).filter(([key]) => !['type', 'protocol', 'pairs'].includes(key))

  for (const [key, value] of filteredConfig) {
    if (!value) continue

    const rowValue: RowValues<TraderData> = {
      key: key as keyof TraderData,
      conditionType: 'between' as const,
    }

    if (value.gte !== undefined) {
      rowValue.gte = value.gte
      rowValue.conditionType = value.lte !== undefined ? 'between' : 'gte'
    }

    if (value.lte !== undefined) {
      rowValue.lte = value.lte
      rowValue.conditionType = value.gte !== undefined ? 'between' : 'lte'
    }

    if (value.in) {
      rowValue.in = value.in
      rowValue.conditionType = 'in'
    }

    // Convert specific fields
    switch (key) {
      case 'avgDuration':
      case 'maxDuration':
      case 'minDuration':
        if (rowValue.gte) {
          rowValue.gte = rowValue.gte / 3600
        }
        if (rowValue.lte) {
          rowValue.lte = rowValue.lte / 3600
        }
        break
      case 'lastTradeAtTs':
        let lte, gte
        if (rowValue.gte) {
          lte = dayjs().utc().diff(dayjs(rowValue.gte).utc(), 'day')
          rowValue.conditionType = rowValue.lte !== undefined ? 'between' : 'lte'
        }
        if (rowValue.lte) {
          gte = dayjs().utc().diff(dayjs(rowValue.lte).utc(), 'day')
          rowValue.conditionType = rowValue.gte !== undefined ? 'between' : 'gte'
        }
        rowValue.lte = lte
        rowValue.gte = gte
        break
      case 'longRate':
        if (rowValue.gte && rowValue.gte > 100) {
          rowValue.gte = 100
        }
        break
    }

    result.push(rowValue)
  }

  return result
}

export function convertRangesFromFormValues({
  condition,
  pairs,
}: {
  condition?: ConditionFormValues<TraderData>
  pairs?: string[] | 'all'
}) {
  if (!condition) return []
  return [
    ...getFiltersFromFormValues({ ...condition }),
    ...(pairs && pairs.length > 0 && pairs !== 'all'
      ? [{ fieldName: 'pairs', in: pairs.map((e) => getPairFromSymbol(e)) }]
      : []),
  ]
}

export function convertRangesFromConfigs(config?: CustomAlertConfigData) {
  if (!config) return []

  const result: FilterValues[] = []

  const filteredConfig = Object.entries(config).filter(([key]) => !['type', 'protocol'].includes(key))

  for (const [key, value] of filteredConfig) {
    if (!value) continue

    const rowValue: FilterValues = {
      fieldName: key as keyof TraderData,
    }

    if (value.gte !== undefined) {
      rowValue.gte = value.gte
    }

    if (value.lte !== undefined) {
      rowValue.lte = value.lte
    }

    if (value.in) {
      rowValue.in = value.in
    }

    // Convert specific fields
    switch (rowValue.fieldName) {
      case 'avgDuration':
      case 'maxDuration':
      case 'minDuration':
        if (rowValue.gte) {
          rowValue.gte = rowValue.gte / 3600
        }
        if (rowValue.lte) {
          rowValue.lte = rowValue.lte / 3600
        }
        break
      case 'lastTradeAtTs':
        let lte, gte
        if (rowValue.gte) {
          lte = dayjs().utc().diff(dayjs(rowValue.gte).utc(), 'day')
        }
        if (rowValue.lte) {
          gte = dayjs().utc().diff(dayjs(rowValue.lte).utc(), 'day')
        }
        rowValue.lte = lte
        rowValue.gte = gte
        break
      case 'longRate':
        if (rowValue.gte && rowValue.gte > 100) {
          rowValue.gte = 100
        }
        break
    }

    result.push(rowValue)
  }

  return result
}

export function transformFormValues({
  name,
  description,
  type,
  protocols,
  pairs,
  condition,
}: {
  name?: string
  description?: string
  type?: TimeFilterByEnum
  protocols?: string[] | 'all'
  pairs?: string[] | 'all'
  condition?: ConditionFormValues<TraderData>
}) {
  return {
    name,
    description,
    type,
    condition: normalizeCondition(condition),
    protocols: protocols !== 'all' ? protocols : undefined,
    pairs: pairs !== 'all' ? pairs : undefined,
  } as CustomAlertFormValues
}

export const normalizeCondition = (condition?: ConditionFormValues<TraderData>) => {
  if (!condition) return []
  return condition
    .filter((item) => {
      // Keep item only if at least one of gte or lte has a valid value (not 0 or undefined)
      return !((item.gte === 0 || item.gte === undefined) && (item.lte === 0 || item.lte === undefined))
    })
    .map((item) => {
      const normalized = { ...item }

      // Remove unnecessary fields based on conditionType
      if (normalized.conditionType === 'gte') {
        delete normalized.lte
      } else if (normalized.conditionType === 'lte') {
        delete normalized.gte
      }

      // Remove fields with value 0 as they are default values
      if (normalized.gte === 0 || normalized.gte === undefined) delete normalized.gte
      if (normalized.lte === 0 || normalized.lte === undefined) delete normalized.lte

      return normalized
    })
}
