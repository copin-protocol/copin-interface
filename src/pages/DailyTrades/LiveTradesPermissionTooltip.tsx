import TableCellPermissionTooltip from 'components/@subscription/TableCellPermissionTooltip'

import { PERMISSION_TOOLTIP_ID_PREFIX } from './helpers'

export default function LiveTradesPermissionTooltip() {
  return <TableCellPermissionTooltip anchorSelect={PERMISSION_TOOLTIP_ID_PREFIX} />
}
