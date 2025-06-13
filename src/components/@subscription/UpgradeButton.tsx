import { Trans } from '@lingui/macro'
import { CrownSimple } from '@phosphor-icons/react'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Variant } from 'theme/Buttons/types'
import { Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps } from 'theme/types'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { PLANS } from 'utils/config/subscription'
import { checkHighestPlan } from 'utils/helpers/permissionHelper'

export default function UpgradeButton({
  icon = <CrownSimple size={16} style={{ color: themeColors.primary1 }} weight="fill" />,
  requiredPlan,
  variant = 'textPrimary',
  showIcon = true,
  showCurrentPlan = false,
  sx,
  text = <Trans>UPGRADE</Trans>,
  onClick,
  block,
  buttonSx,
  target,
}: {
  icon?: ReactNode
  requiredPlan?: SubscriptionPlanEnum
  variant?: Variant
  showIcon?: boolean
  showCurrentPlan?: boolean
  text?: ReactNode
  onClick?: () => void
  block?: boolean
  buttonSx?: any
  target?: string
} & SxProps) {
  const { myProfile } = useMyProfile()
  const { userNextPlan } = useUserNextPlan()
  const currentPlan = PLANS.find((plan) => plan.title === myProfile?.subscription?.plan)
  const requiredPlanId = PLANS.find((plan) => plan.title === requiredPlan)?.id
  const isHighestPlan = checkHighestPlan(currentPlan?.title as SubscriptionPlanEnum)
  const linkToSubscription = `${ROUTES.SUBSCRIPTION.path}?plan=${requiredPlan ?? userNextPlan}`

  if (isHighestPlan || (requiredPlanId && currentPlan && currentPlan.id >= requiredPlanId)) return null

  return (
    <Flex alignItems="center" sx={{ gap: '12px', flexShrink: 0, width: block ? '100%' : 'auto', ...(sx || {}) }}>
      {showCurrentPlan && (
        <Flex alignItems="center" sx={{ gap: '6px' }}>
          <Type.Caption>Current plan</Type.Caption>
          <IconBox icon={<CrownSimple weight="fill" size={16} />} color={currentPlan?.color} />
          <Type.Caption lineHeight="13px" color="neutral1" sx={{ textTransform: 'capitalize' }}>
            {currentPlan?.title?.toLowerCase() ?? 'Free'}
          </Type.Caption>
        </Flex>
      )}
      <Link
        to={linkToSubscription}
        target={target}
        onClick={onClick}
        style={{ width: block ? '100%' : 'auto', display: block ? 'inline-block' : 'inline' }}
      >
        {showIcon ? (
          <ButtonWithIcon icon={icon} variant={variant} sx={{ mr: '6px', ...buttonSx }} block={block}>
            <Type.CaptionBold>{text}</Type.CaptionBold>
          </ButtonWithIcon>
        ) : (
          <Button variant={variant} block={block} sx={{ ...buttonSx }}>
            <Type.CaptionBold>{text}</Type.CaptionBold>
          </Button>
        )}
      </Link>
    </Flex>
  )
}
