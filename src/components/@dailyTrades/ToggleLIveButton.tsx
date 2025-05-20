import { Trans } from '@lingui/macro'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import LiveDataIcon from 'components/@ui/LiveDataIcon'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { formatDuration } from 'utils/helpers/format'

export default function ToggleLiveButton({
  onClick,
  enabledLiveData,
  requiredPlan,
  delay,
}: {
  onClick?: () => void
  enabledLiveData: boolean
  requiredPlan?: SubscriptionPlanEnum
  delay?: number
}) {
  if (requiredPlan) {
    return (
      <Flex sx={{ alignItems: 'center' }}>
        {!!delay && (
          <>
            <Type.Caption mr={18}>{formatDuration(delay, false, true)} delay</Type.Caption>
            <Box mr={18} sx={{ height: '16px', width: '1px', bg: 'neutral4' }} />
          </>
        )}
        <UpgradeButton requiredPlan={requiredPlan} />
        <Type.CaptionBold>
          <Trans>To Unlock Live Data</Trans>
        </Type.CaptionBold>
      </Flex>
    )
  }
  return (
    <Flex sx={{ alignItems: 'center' }} role="button" onClick={onClick}>
      {/* <TimeCountdown /> */}
      <LiveDataIcon disabled={!enabledLiveData} />
      <Type.Caption ml={1} mr={2} color={enabledLiveData ? 'neutral1' : 'neutral3'} sx={{ color: 'red' }}>
        LIVE DATA
      </Type.Caption>
      {!!onClick && <SwitchInput checked={enabledLiveData} onClick={onClick} />}
    </Flex>
  )
}
