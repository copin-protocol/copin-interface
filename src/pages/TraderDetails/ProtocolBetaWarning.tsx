import { Trans } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React from 'react'

import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'

export default function ProtocolBetaWarning({ protocol }: { protocol: ProtocolEnum }) {
  const { lg } = useResponsive()
  if (!WARNING_PROTOCOL.includes(protocol)) return null
  const tooltipId = `tt-protocol-beta-warning-${protocol}`
  return (
    <>
      <IconBox
        icon={<Info size={16} color={themeColors.orange1} />}
        sx={{ display: 'inline-block' }}
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={360}
      />
      <Tooltip id={tooltipId} place={lg ? 'top' : 'bottom'}>
        <ProtocolBetaWarningContent protocol={protocol} />
      </Tooltip>
    </>
  )
}

export function ProtocolBetaWarningContent({ protocol }: { protocol: ProtocolEnum }) {
  if (!WARNING_PROTOCOL.includes(protocol)) return null
  return (
    <Flex maxWidth={400} sx={{ gap: 1 }}>
      <IconBox icon={<Info size={16} color={themeColors.neutral2} />} sx={{ display: 'inline-block' }} />
      <Type.Small color="neutral2" display="block">
        <Trans>Data maybe delayed by up to 2 hours</Trans>
      </Type.Small>
    </Flex>
  )
}

const WARNING_PROTOCOL: ProtocolEnum[] = []
