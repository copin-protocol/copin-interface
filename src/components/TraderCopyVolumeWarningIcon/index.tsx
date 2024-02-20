import { Keyhole } from '@phosphor-icons/react'
import { useRef } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
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
          Trader has the total copy volume over{' '}
          <Box as="span" fontWeight={600}>
            $200,000
          </Box>
          . You can&apos;t copy more than{' '}
          <Box as="span" fontWeight={600}>
            $20,000
          </Box>{' '}
          (include leverage). Contact support{' '}
          <Box as="a" href={LINKS.support} target="_blank" fontWeight={600}>
            here
          </Box>{' '}
          to increase your copy volume.
        </Type.Caption>
      </Tooltip>
    </>
  )
}
