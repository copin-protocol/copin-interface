import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import { Flex, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function PositionUpgradePlanIndicator({
  maxAllowedRecords,
  totalRecords,
  nextPlan,
  title = <Trans>Upgrade to keep exploring all positions</Trans>,
}: {
  maxAllowedRecords: number
  totalRecords: number
  nextPlan?: SubscriptionPlanEnum
  title?: ReactNode
}) {
  return (
    <Flex alignItems="center" sx={{ height: 24, gap: 2 }}>
      <IconBox icon={<Lock size={16} weight="fill" />} color="neutral3" />
      <Type.Caption>
        {title} ({maxAllowedRecords} / {totalRecords})
      </Type.Caption>
      <UpgradeButton requiredPlan={nextPlan} target="_blank" />
    </Flex>
  )
}
