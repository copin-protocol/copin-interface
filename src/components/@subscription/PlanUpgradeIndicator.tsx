import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'
import { ReactNode, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import useBenefitModalStore from 'hooks/features/subscription/useBenefitModalStore'
import useCheckFeature from 'hooks/features/subscription/useCheckFeature'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
// import Tooltip from 'theme/Tooltip'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'

import PlanUpgradePrompt from './PlanUpgradePrompt'
import SubscriptionIcon from './SubscriptionIcon'

export default function PlanUpgradeIndicator({
  requiredPlan,
  hoverToColor,
  useLockIcon = true,
  learnMoreSection,
  title,
  buttonSx = {},
}: {
  requiredPlan: SubscriptionPlanEnum
  hoverToColor?: boolean
  useLockIcon?: boolean
  learnMoreSection?: SubscriptionFeatureEnum
  title?: ReactNode
  buttonSx?: any
}) {
  const tooltipId = useRef(uuid()).current
  const { isAvailableFeature } = useCheckFeature({ requiredPlan })
  const { setConfig } = useBenefitModalStore()

  const handleClickLearnMore = () => setConfig(learnMoreSection, requiredPlan)
  if (isAvailableFeature) return null
  return (
    <>
      {useLockIcon ? (
        <ButtonWithIcon
          variant="ghost"
          className="child-click"
          sx={{
            p: 0,
            color: 'neutral3',
            '&:hover': {
              cursor: learnMoreSection && !!handleClickLearnMore ? 'pointer' : 'inherit',
              color: 'neutral1',
            },
            ...buttonSx,
          }}
          icon={<Lock size={12} weight={learnMoreSection && !!handleClickLearnMore ? 'fill' : 'regular'} />}
          data-tooltip-id={tooltipId}
          onClick={(e: any) => {
            e.stopPropagation()
            if (learnMoreSection && !!handleClickLearnMore) {
              handleClickLearnMore()
            }
          }}
        >
          {title}
        </ButtonWithIcon>
      ) : (
        <SubscriptionIcon
          plan={requiredPlan}
          data-tooltip-id={tooltipId}
          hoverToColor={hoverToColor}
          onClick={learnMoreSection ? handleClickLearnMore : undefined}
        />
      )}
      {/* <Tooltip id={tooltipId} clickable>
        <PlanUpgradeContent requiredPlan={requiredPlan} useLockIcon={useLockIcon} />
      </Tooltip> */}
    </>
  )
}

export function PlanUpgradeContent({
  requiredPlan,
  useLockIcon,
}: {
  requiredPlan: SubscriptionPlanEnum
  useLockIcon?: boolean
}) {
  const { isAvailableFeature } = useCheckFeature({ requiredPlan })
  if (isAvailableFeature) return null
  let title: ReactNode = ''
  switch (requiredPlan) {
    case SubscriptionPlanEnum.FREE:
      title = <Trans>Available from Free plans</Trans>
      break
    case SubscriptionPlanEnum.STARTER:
      title = <Trans>Available from Starter plans</Trans>
      break
    case SubscriptionPlanEnum.PRO:
      title = <Trans>Available from Pro plans</Trans>
      break
    case SubscriptionPlanEnum.ELITE:
      title = <Trans>Available only on Elite plans</Trans>
      break
  }
  return (
    <PlanUpgradePrompt
      requiredPlan={requiredPlan}
      title={title}
      confirmButtonVariant="textPrimary"
      titleSx={{ textTransform: 'none !important' }}
      useLockIcon={useLockIcon}
    />
  )
}
