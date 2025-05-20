import { ArrowLineUp, Keyhole } from '@phosphor-icons/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'

import { TraderCopyVolumeCheckingData } from '../types'
import { getCopyVolumeColor } from './helper'

export default function TraderCopyVolumeWarningIcon({
  account,
  protocol,
  size = 24,
  copyVolume,
}: {
  account: string
  protocol: ProtocolEnum | undefined
  size?: number
  copyVolume: number | undefined
}) {
  const id = useRef(uuid())

  return (
    <>
      <IconBox
        // {...{ [DATA_ATTRIBUTES.TRADER_COPY_VOLUME_WARNING]: account + '-' + (protocol ?? '') }}
        icon={<Keyhole size={size} />}
        sx={{ flexShrink: 0, display: (copyVolume ?? 0) > 200000 ? 'block' : 'none' }}
        color="orange1"
        data-tooltip-id={TOOLTIP_KEYS.TRADER_COPY_VOLUME_WARNING + id.current}
      />
      <Tooltip id={TOOLTIP_KEYS.TRADER_COPY_VOLUME_WARNING + id.current} clickable={true}>
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

// TODO: SUB 3
export function TraderTotalCopyVolumeIcon({
  account,
  protocol,
  copyVolume = 0,
  maxVolume = 0,
  isRef,
  plan,
  size = 18,
}: {
  account: string
  protocol: ProtocolEnum | undefined
  size?: number
} & TraderCopyVolumeCheckingData) {
  const id = useRef(uuid())
  const _copyVolume = formatNumber(copyVolume, 0, 0)
  const _maxVolume = formatNumber(maxVolume, 0, 0)
  // const _maxVolumeBoldComponent = (
  //   <Box as="span" color="neutral1" fontWeight={600}>
  //     ${_maxVolume}
  //   </Box>
  // )

  let color = 'neutral1'
  let label = 'Basic'
  let description = ''
  if (!isRef) {
    description = '(Non-referral Copin on CEX)'
  }
  if (plan === SubscriptionPlanEnum.STARTER) {
    color = 'green2'
    label = 'Starter'
  }
  if (plan === SubscriptionPlanEnum.PRO) {
    color = 'orange1'
    label = 'Pro'
  }
  if (plan === SubscriptionPlanEnum.ELITE) {
    color = 'violet'
    label = 'Elite'
  }
  const iconColor = getCopyVolumeColor({ copyVolume, maxVolume })

  return (
    <>
      <IconBox
        // {...{ [DATA_ATTRIBUTES.TRADER_TOTAL_COPY_VOLUME]: account + '-' + (protocol ?? '') }}
        icon={<ArrowLineUp size={size} />}
        sx={{ flexShrink: 0 }}
        color={iconColor}
        data-tooltip-id={TOOLTIP_KEYS.TRADER_TOTAL_COPY_VOLUME + id.current}
      />
      <Tooltip id={TOOLTIP_KEYS.TRADER_TOTAL_COPY_VOLUME + id.current} clickable={true}>
        <Box maxWidth={350}>
          {/* <Type.Caption color="neutral2">
            Your current plan is{' '}
            <Box as="span" fontWeight={600} color={color}>
              {label}
            </Box>
            {description && (
              <Box as="span" color={color}>
                {' '}
                {description}
              </Box>
            )}
            . The maximum size that you can set up for this trader is {_maxVolumeBoldComponent} (include leverage).
          </Type.Caption> */}
          <Type.Caption>
            Your copy trade size:{' '}
            <Box
              as="span"
              color={
                plan === SubscriptionPlanEnum.ELITE
                  ? 'green2'
                  : (copyVolume ?? 0) > (maxVolume ?? 0)
                  ? 'red1'
                  : (copyVolume ?? 0) === (maxVolume ?? 0)
                  ? 'orange1'
                  : 'green2'
              }
            >
              ${_copyVolume}
            </Box>{' '}
            / {plan === SubscriptionPlanEnum.ELITE ? 'Unlimited' : `$${_maxVolume}`}
            {plan !== SubscriptionPlanEnum.ELITE && (
              <Box as={Link} to={ROUTES.SUBSCRIPTION.path} target="_blank" onClick={(e) => e.stopPropagation()}>
                {' '}
                Upgrade
              </Box>
            )}
          </Type.Caption>
        </Box>
      </Tooltip>
    </>
  )
}
