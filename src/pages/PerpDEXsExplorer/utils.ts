import { getRangeFilterValues } from 'components/@widgets/TableFilter/helpers'
import { FilterValues } from 'components/@widgets/TableFilter/types'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import {
  CHANGE_COLOR_FIELDS,
  FIELDS_WITH_IDEAL_VALUE,
  NOT_CHANGE_COLOR_FIELDS,
} from 'pages/PerpDEXsExplorer/constants/field'
import { FULL_TITLE_MAPPING, TITLE_MAPPING } from 'pages/PerpDEXsExplorer/constants/title'

import { TABLE_RANGE_FILTER_CONFIGS } from './configs'
import { ExternalResource } from './types'

export function getChangeValueConfig({
  data,
  valueKey,
  value,
  externalResource,
}: {
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
  value: number
  externalResource: ExternalResource | undefined
}) {
  let fontWeight = 'normal'
  let isInteger = true
  let isCompactNumber = false
  let color = 'neutral3'

  if (CHANGE_COLOR_FIELDS.includes(valueKey)) {
    if (Math.abs(value) >= 1_000) {
      color = 'neutral1'
      isInteger = false
      isCompactNumber = true
    }
  }

  if (NOT_CHANGE_COLOR_FIELDS.includes(valueKey)) {
    color = 'neutral1'
    if (value === 0) {
      color = 'neutral3'
    }
  }

  if (FIELDS_WITH_IDEAL_VALUE.includes(valueKey)) {
    if (data?.perpdex && externalResource?.maxValueField?.[valueKey]?.perpdex === data.perpdex) {
      color = 'orange1'
      fontWeight = '700'
    }
  }

  return {
    color,
    fontWeight,
    isInteger,
    isCompactNumber,
  }
}

export function getPercentValueConfig({
  data,
  valueKey,
  value,
  externalResource,
}: {
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
  value: number
  externalResource: ExternalResource | undefined
}) {
  let fontWeight = 'normal'

  let color = value > 0 ? 'neutral1' : 'neutral3'

  if (FIELDS_WITH_IDEAL_VALUE.includes(valueKey)) {
    if (data?.perpdex && externalResource?.maxValueField?.[valueKey]?.perpdex === data.perpdex) {
      color = 'orange1'
      fontWeight = '700'
    }
  }

  return {
    color,
    fontWeight,
  }
}

export function getColumnSearchText(valueKey: keyof PerpDEXSourceResponse) {
  const text = FULL_TITLE_MAPPING[valueKey] ?? TITLE_MAPPING[valueKey]
  const acronym = text
    ?.split(' ')
    .map((v) => v[0])
    .join('')
  const result: string[] = []
  if (text) result.push(text)
  if (acronym) result.push(acronym)
  return result
}

export function getFilters({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const filters: FilterValues[] = []
  Object.entries(TABLE_RANGE_FILTER_CONFIGS).forEach(([fieldName, filterConfigs]) => {
    if (filterConfigs.type === 'number') {
      const listUrlParamKey = filterConfigs.listParamKey
        ? filterConfigs.listParamKey
        : [filterConfigs.urlParamKey ?? '']
      const listUnit = filterConfigs.listUnit ? filterConfigs.listUnit ?? [] : [filterConfigs.unit ?? '']
      const listLabel = filterConfigs.listLabel ? filterConfigs.listLabel ?? [] : [filterConfigs.label ?? '']
      listUrlParamKey.forEach((urlParamKey, index) => {
        const { gte, lte } = getRangeFilterValues({ searchParams, urlParamKey })
        if (gte == null && lte == null) return
        const filter: FilterValues = {
          urlParamKey,
          type: 'number',
          gte,
          lte,
          fieldName: fieldName as keyof PerpDEXSourceResponse,
          unit: listUnit[index],
          label: listLabel[index],
        }
        filters.push(filter)
      })
      return
    }
    // TODO: change dynamic unit for duration
    if (filterConfigs.type === 'duration') {
      const listUrlParamKey = filterConfigs.listParamKey
        ? filterConfigs.listParamKey
        : [filterConfigs.urlParamKey ?? '']
      const listUnit = filterConfigs.listUnit ? filterConfigs.listUnit ?? [] : [filterConfigs.unit ?? '']
      const listLabel = filterConfigs.listLabel ? filterConfigs.listLabel ?? [] : [filterConfigs.label ?? '']
      listUrlParamKey.forEach((urlParamKey, index) => {
        const { gte, lte } = getRangeFilterValues({ searchParams, urlParamKey })
        if (gte == null && lte == null) return
        const filter: FilterValues = {
          urlParamKey,
          type: 'duration',
          gte,
          lte: gte != null && lte != null && gte > lte ? undefined : lte,
          fieldName: fieldName as keyof PerpDEXSourceResponse,
          unit: listUnit[index],
          label: listLabel[index],
        }
        filters.push(filter)
      })
      return
    }
    if (filterConfigs.type === 'select' && filterConfigs.urlParamKey) {
      const value = searchParams[filterConfigs.urlParamKey]
      if (!value) return
      const filter: FilterValues = {
        type: 'select',
        urlParamKey: filterConfigs.urlParamKey,
        fieldName: fieldName as keyof PerpDEXSourceResponse,
        label: filterConfigs.label,
        selectedValue: value,
      }
      filters.push(filter)
      return
    }
    if (filterConfigs.type === 'multiSelect' && filterConfigs.urlParamKey) {
      if (fieldName === 'collateralAssets') {
        const values = searchParams[filterConfigs.urlParamKey]?.split('_')
        if (!values?.length) {
          const filter: FilterValues = {
            type: 'multiSelect',
            fieldName,
            label: filterConfigs.label,
            urlParamKey: filterConfigs.urlParamKey,
            listSelectedValue: undefined,
          }
          filters.push(filter)
          return
        }
        const filter: FilterValues = {
          type: 'multiSelect',
          fieldName,
          label: filterConfigs.label,
          urlParamKey: filterConfigs.urlParamKey,
          listSelectedValue: values,
        }
        filters.push(filter)
        return
      }
    }
    if (filterConfigs.type === 'pairs') {
      const pairs = searchParams['pairs']?.split('_')
      if (!pairs?.length) {
        const filter: FilterValues = {
          type: 'pairs',
          fieldName: fieldName as keyof PerpDEXSourceResponse,
          label: filterConfigs.label,
          pairs: undefined,
          isExcluded: false,
        }
        filters.push(filter)
        return
      }
      const isExcluded = searchParams['isExcludedPairs'] === '1'
      const filter: FilterValues = {
        type: 'pairs',
        fieldName: fieldName as keyof PerpDEXSourceResponse,
        label: filterConfigs.label,
        pairs,
        isExcluded,
      }
      filters.push(filter)
      return
    }
  })
  return filters
}
