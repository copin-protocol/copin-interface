import { PositionData } from 'entities/trader'

export function getTablePositionPermissionStyle({
  availableColumns,
  keysToCheck,
}: {
  availableColumns: (keyof PositionData)[]
  keysToCheck: (keyof PositionData)[]
}) {
  const invalidColumns = keysToCheck.filter((_key) => !availableColumns.includes(_key))
  if (!invalidColumns?.length) return {}
  const key = invalidColumns.map((_key) => `[data-key="${_key}"]`).join(', ')
  return {
    [key]: {
      filter: 'blur(6px)',
    },
  }
}
