import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, TOOLTIP_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export default function TraderDisabledWarningIcon({
  account,
  protocol,
  size = 16,
  hasTooltip = true,
  label = 'trader',
}: {
  account: string
  protocol: ProtocolEnum | undefined
  size?: number
  hasTooltip?: boolean
  label?: string
}) {
  const id = useRef(uuid())

  return (
    <>
      <IconBox
        {...{ [DATA_ATTRIBUTES.TRADER_PROTOCOL_WARNING]: account + '-' + (protocol ?? '') }}
        icon={<Lock size={size} />}
        sx={{ flexShrink: 0, cursor: hasTooltip ? 'pointer' : 'default' }}
        color={hasTooltip ? 'neutral2' : 'neutral3'}
        data-tooltip-id={TOOLTIP_KEYS.TRADER_PROTOCOL_WARNING + id.current}
      />
      {hasTooltip && (
        <Tooltip id={TOOLTIP_KEYS.TRADER_PROTOCOL_WARNING + id.current} clickable={true}>
          <Flex
            justifyContent="center"
            alignItems="end"
            flexDirection="column"
            sx={{ gap: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Type.Caption sx={{ maxWidth: 280, textAlign: 'left', width: '100%' }}>
              <Trans>Your plan doesn&apos;t support this {label}. Upgrade to follow this trader.</Trans>
            </Type.Caption>
            <Link to={ROUTES.SUBSCRIPTION.path} target="_blank">
              <Type.CaptionBold sx={{ textTransform: 'uppercase', p: 1 }}>
                <Trans>Upgrade</Trans>
              </Type.CaptionBold>
            </Link>
          </Flex>
        </Tooltip>
      )}
    </>
  )
}
