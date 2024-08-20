import { tableSettings } from './configs'

export const getFreezeLeftPos = (index: number, visibleColumns: string[]) => {
  let left = [36, 48]
  if (index === 0) return left
  const freezeLefts = tableSettings
    .slice(0, index)
    .filter((col) => visibleColumns.includes(col.id))
    .filter((col) => col.freezeLeft != null)
    .map((col) => col.freezeLeft)
  if (!freezeLefts.length) return left
  left = left.map((value) => value + freezeLefts.reduce((prev: number, cur) => (prev += cur || 0), 0))
  return left
}
