import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'

import { IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function ProtocolBetaWarning({ protocol }: { protocol: ProtocolEnum }) {
  if (!WARNING_PROTOCOL.includes(protocol)) return null
  return (
    <Type.Small color="orange1" sx={{ display: 'block', px: 2, py: 1, bg: '#FCC55133' }}>
      <IconBox icon={<Warning size={16} />} sx={{ display: 'inline-block', mr: 1 }} />
      <Trans>
        Trader data from Hyperliquid has been extracted from 2024/8/27. It is currently in testing and may be unstable.
        Please use it for reference purposes only!
      </Trans>
    </Type.Small>
  )
}

const WARNING_PROTOCOL = [ProtocolEnum.HYPERLIQUID]
