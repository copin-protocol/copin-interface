import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

export type ExternalResource = Partial<PerpDEXSourceResponse> & { maxVolume1d: number; lastSnapshot: string }

export type NormalValueComponentType =
  | 'timeDuration'
  | 'number'
  | 'date'
  | 'string'
  | 'boolean'
  | 'percentage'
  | 'greaterThanZero'
