import { mobileTableSettings, tableSettings } from 'components/@trader/TraderExplorerTableView/configs'

import createCustomizeColumnsStore from './createCustomizeColumnsStore'

const DEFAULT_LIST = tableSettings.filter((e) => e.visible).map((e) => e.id)

const MOBILE_DEFAULT_LIST = mobileTableSettings.filter((e) => e.visible).map((e) => e.id)

// Create specific instances
export const useTraderExplorerTableColumns = createCustomizeColumnsStore({
  name: 'home-customize',
  version: 8,
  defaultColumns: DEFAULT_LIST, // Import and set default columns from configs
})

export const useTraderExplorerListColumns = createCustomizeColumnsStore({
  name: 'explorer-column-keys',
  version: 2,
  defaultColumns: MOBILE_DEFAULT_LIST, // Import and set default columns from configs
})
