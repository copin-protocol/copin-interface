import { CrownSimple } from '@phosphor-icons/react'

import { VipPlanIcon2 } from 'theme/Icons/VipPlanIcon'
import { IconBox } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function SubscriptionIcon({
  plan,
  weight = 'fill',
  size = 16,
}: {
  plan: SubscriptionPlanEnum
  weight?: string
  size?: number
}) {
  let Icon: any = CrownSimple
  let color = 'neutral2'
  switch (plan) {
    case SubscriptionPlanEnum.PREMIUM:
      color = 'orange1'
      break
    case SubscriptionPlanEnum.VIP:
      color = 'violet'
      Icon = VipPlanIcon2
      break
  }

  return <IconBox icon={<Icon weight={weight} size={size} />} color={color} />
}
