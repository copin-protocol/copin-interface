import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

export type ExternalResource = {
  // maxVolume1d: number
  lastSnapshot: string
  maxValueField: { [key in keyof PerpDEXSourceResponse]?: { perpdex: string; value: number } } // perpdex
}

export type NormalValueComponentType =
  | 'timeDuration'
  | 'number'
  | 'date'
  | 'string'
  | 'boolean'
  | 'percentage'
  | 'greaterThanZero'
