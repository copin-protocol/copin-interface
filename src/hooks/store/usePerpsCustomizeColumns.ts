import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'

import createCustomizeColumnsStore from './createCustomizeColumnsStore'

export const DEFAULT_COLUMN_KEYS: (keyof PerpDEXSourceResponse)[] = [
  'volume1d',
  'volume30d',
  'traders30d',
  'oi',
  'longRatio',
  'revenue30d',
  'hasFundingFee',
  'type',
  'feePerMillion30d',
  'averageFeeRate30d',
  'marginModes',
  'positionModes',
  'pairs',
  'tradeUrl',
]

export const DEFAULT_COLUMN_KEYS_MOBILE: (keyof PerpDEXSourceResponse)[] = [
  'volume1d',
  'volume30d',
  'traders30d',
  'oi',
  'longRatio',
  'revenue30d',
  'hasFundingFee',
  'type',
  'feePerMillion30d',
  'averageFeeRate30d',
  'marginModes',
  'positionModes',
  'pairs',
  'tradeUrl',
]

type ColumnState = {
  visibleColumns: string[]
}

type State = {
  desktop: ColumnState
  mobile: ColumnState
  toggleVisibleColumn: (key: string, isMobile?: boolean) => void
  setVisibleColumns: (keys: string[], isMobile?: boolean) => void
  resetDefault: (isMobile?: boolean) => void
}

export const usePerpsExplorerTableColumns = createCustomizeColumnsStore({
  name: 'perps-column-keys-table',
  version: 2,
  defaultColumns: DEFAULT_COLUMN_KEYS, // Import and set default columns from configs
})

export const usePerpsExplorerListColumns = createCustomizeColumnsStore({
  name: 'perps-column-keys-list',
  version: 2,
  defaultColumns: DEFAULT_COLUMN_KEYS_MOBILE, // Import and set default columns from configs
})
