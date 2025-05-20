export const generatePermissionStyle = ({ availableColumns }: { availableColumns: string[] }) => {
  return {
    '[data-value-key]': {
      filter: 'blur(6px)',
    },
    [`${availableColumns
      .map((value) => {
        return `[data-value-key='${value}']`
      })
      .join(', ')}`]: {
      filter: 'none',
    },
  }
}
