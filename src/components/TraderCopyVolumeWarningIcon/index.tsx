import { Keyhole } from '@phosphor-icons/react'
import { useRef } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, TOOLTIP_KEYS } from 'utils/config/keys'

export default function TraderCopyVolumeWarningIcon({
  account,
  protocol,
  size = 24,
}: {
  account: string
  protocol: ProtocolEnum | undefined
  size?: number
}) {
  const id = useRef(uuid())

  return (
    <>
      <IconBox
        {...{ [DATA_ATTRIBUTES.TRADER_COPY_VOLUME_WARNING]: account + '-' + (protocol ?? '') }}
        icon={<Keyhole size={size} />}
        sx={{ flexShrink: 0, display: 'none' }}
        color="orange1"
        data-tooltip-id={TOOLTIP_KEYS.TRADER_COPY_VOLUME_WARNING + id.current}
      />
      <Tooltip
        id={TOOLTIP_KEYS.TRADER_COPY_VOLUME_WARNING + id.current}
        place="top"
        type="dark"
        effect="solid"
        clickable={true}
      >
        <Type.Caption sx={{ maxWidth: 300 }}>
          Trader has a total copy volume of over{' '}
          <Box as="span" fontWeight={600}>
            $200,000
          </Box>
          .
          <br />A{' '}
          <Box as="span" fontWeight={600}>
            large price slippage
          </Box>{' '}
          may occur when opening or closing orders. Be cautious with your copy volume.
        </Type.Caption>
      </Tooltip>
    </>
  )
}
