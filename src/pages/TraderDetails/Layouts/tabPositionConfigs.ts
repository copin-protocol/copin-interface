export enum TabsKeyEnumPosition {
  OPENING = 'opening',
  CLOSED = 'closed',
  OPEN_ORDERS = 'open_orders',
  FILLS = 'fills',
  TWAP = 'twap',
  HISTORICAL = 'historical',
}

export const TABS = [
  { key: TabsKeyEnumPosition.OPENING, name: 'Opening Positions' },
  { key: TabsKeyEnumPosition.CLOSED, name: 'History' },
]

export const HYPERLIQUID_TABS = [
  { key: TabsKeyEnumPosition.OPENING, name: 'Opening Positions' },
  { key: TabsKeyEnumPosition.CLOSED, name: 'History' },
  { key: TabsKeyEnumPosition.OPEN_ORDERS, name: 'Orders' },
  { key: TabsKeyEnumPosition.FILLS, name: 'Fills' },
  { key: TabsKeyEnumPosition.HISTORICAL, name: 'History Orders' },
  { key: TabsKeyEnumPosition.TWAP, name: 'TWAP' },
]

export const LITE_TABS = [
  { key: TabsKeyEnumPosition.OPENING, name: 'Opening Positions' },
  { key: TabsKeyEnumPosition.OPEN_ORDERS, name: 'Orders' },
  { key: TabsKeyEnumPosition.FILLS, name: 'Fills' },
]
