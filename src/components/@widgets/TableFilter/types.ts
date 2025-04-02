import { ReactNode } from 'react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

import { MultiSelectOption } from './TableMultiSelectFilter'
import { SelectOption } from './TableSelectFilter'

/**
 * Type number:
 *  Pass label, urlParamKey, unit if filter single field
 *  Pass listLabel, listParamKey, listUnit if filter multiple field
 *
 * Type select:
 *  Pass options, urlParamKey
 */
export type TableFilterConfig = {
  unit?: string
  listUnit?: string[]
  options?: SelectOption[]
  multiSelectOptions?: MultiSelectOption[]
  urlParamKey?: string
  listParamKey?: string[]
  label?: ReactNode
  listLabel?: ReactNode[]
  type: 'number' | 'duration' | 'select' | 'multiSelect' | 'pairs'
  isCompactNumber?: boolean
}

export type TableRangeFilterValues = Record<string, number | undefined>

export type FilterValues =
  | {
      type: 'number'
      fieldName: keyof PerpDEXSourceResponse
      label: ReactNode
      urlParamKey: string
      gte: number | undefined
      lte: number | undefined
      unit: string
    }
  | {
      type: 'duration'
      fieldName: keyof PerpDEXSourceResponse
      label: ReactNode
      urlParamKey: string
      gte: number | undefined
      lte: number | undefined
      unit: string
    }
  | {
      type: 'select'
      fieldName: keyof PerpDEXSourceResponse
      label: ReactNode
      urlParamKey: string
      selectedValue: string | undefined
    }
  | {
      type: 'multiSelect'
      fieldName: keyof PerpDEXSourceResponse
      label: ReactNode
      urlParamKey: string
      listSelectedValue: string[] | undefined
    }
  | {
      type: 'pairs'
      fieldName: keyof PerpDEXSourceResponse
      label: ReactNode
      pairs: string[] | undefined
      isExcluded: boolean
    }

export type RangeFilterValues = {
  field: string
  gte?: number | string
  lte?: number | string
}
