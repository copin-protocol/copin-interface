import { Trans } from '@lingui/macro'
import { WarningDiamond } from '@phosphor-icons/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, TOOLTIP_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export default function TraderCopyCountWarningIcon({
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
        {...{ [DATA_ATTRIBUTES.TRADER_COPY_COUNT_WARNING]: account + '-' + (protocol ?? '') }}
        icon={<WarningDiamond size={size} />}
        sx={{ flexShrink: 0, display: 'none' }}
        color="primary1"
        data-tooltip-id={TOOLTIP_KEYS.TRADER_COPY_COUNT_WARNING + id.current}
      />
      <IconBox
        {...{ [DATA_ATTRIBUTES.TRADER_COPY_COUNT_WARNING_BASIC]: account + '-' + (protocol ?? '') }}
        icon={<WarningDiamond size={size} />}
        sx={{ flexShrink: 0, display: 'none' }}
        color="red2"
        data-tooltip-id={TOOLTIP_KEYS.TRADER_COPY_COUNT_WARNING_BASIC + id.current}
      />
      <Tooltip id={TOOLTIP_KEYS.TRADER_COPY_COUNT_WARNING + id.current}>
        <Type.Caption sx={{ maxWidth: 300 }}>
          <Trans>This trader is being copied by 10 or more copiers.</Trans>
        </Type.Caption>
      </Tooltip>
      <Tooltip id={TOOLTIP_KEYS.TRADER_COPY_COUNT_WARNING_BASIC + id.current} clickable={true}>
        <Type.Caption sx={{ maxWidth: 300 }}>
          <Trans>
            Starting from{' '}
            <Box as="span" fontWeight="bold">
              5/2/2024
            </Box>
            , your order will not be executed because this trader is being copied by 10 or more copiers. Upgrade to
            Premium to be able to follow this trader.{' '}
            <Box as={Link} to={ROUTES.SUBSCRIPTION.path} target="_blank">
              Upgrade
            </Box>
          </Trans>
        </Type.Caption>
      </Tooltip>
    </>
  )
}
export function generateTraderCountWarningStyle(addresses: string[], protocol: ProtocolEnum, isPremium: boolean) {
  const key = addresses
    .map((address) => {
      return `[${
        isPremium ? DATA_ATTRIBUTES.TRADER_COPY_COUNT_WARNING : DATA_ATTRIBUTES.TRADER_COPY_COUNT_WARNING_BASIC
      }="${address}-${protocol}"]`
    })
    .join(',')
  return {
    [key]: { display: 'block' },
  }
}
