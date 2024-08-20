import { TOOLTIP_CONTENT } from 'utils/config/options'

import LabelWithTooltip from './LabelWithTooltip'

export default function LabelEPnL() {
  return (
    <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
      ePnL
    </LabelWithTooltip>
  )
}
