export const tableStyles = {
  th: { py: 3 },
  'thead th:first-child': { pl: 3, pr: 12, position: 'sticky', left: 0, bg: 'neutral7' },
  'thead th:last-child': { pr: 3, position: 'sticky', right: 0, bg: 'neutral7' },
  'tbody td': { height: 48, py: '0 !important' },
  'tbody td:first-child': {
    position: 'sticky',
    left: 0,
    pl: 3,
    pr: 12,
    // bg: 'neutral6',
    borderRight: 'small',
    borderRightColor: 'neutral4',
    transition: 'none',
    zIndex: 11,
  },
  'tbody td:last-child': { pr: 3, position: 'sticky', right: 0 },
  // 'tbody tr:hover': {
  //   td: { bg: 'neutral5' },
  // },
  'thead th': { py: '8px !important', alignItems: 'center' },
  'thead th:nth-child(2)': { pl: 12 },
  'tbody td:nth-child(2)': { borderRight: 'small', borderRightColor: 'neutral4' },
}

export const tableBodyStyles = {
  '&': { borderBottom: 'small', borderBottomColor: 'neutral4' },
}
