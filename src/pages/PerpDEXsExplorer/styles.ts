export const tableStyles = {
  th: { py: 3 },
  'thead th:first-child': { pl: 3, pr: 12, position: 'sticky', left: 0, bg: 'neutral7', zIndex: 1 },
  'thead th:last-child': { pr: 3, position: 'sticky', right: 0, bg: 'neutral7' },
  'tbody td': { height: 48, py: '0 !important', pr: 1 },
  'tbody td:first-child': {
    position: 'sticky',
    left: 0,
    pl: 3,
    pr: 12,
    borderRight: 'small',
    borderRightColor: 'neutral4',
    transition: 'none',
    zIndex: 11,
  },
  'tbody td:last-child': { pr: 3, position: 'sticky', right: 0 },
  'thead th': { py: '6px !important', alignItems: 'center', pr: 1 },
  'thead th:nth-child(2)': { pl: 12 },
}

export const tableBodyStyles = {
  '&': { borderBottom: 'small', borderBottomColor: 'neutral4' },
}
