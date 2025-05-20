import { CrownSimple } from '@phosphor-icons/react'
import { ComponentProps } from 'react'

import { IconBox } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function SubscriptionIcon({
  plan,
  weight = 'fill',
  size = 16,
  sx = {},
  hoverToColor,
  ...props
}: {
  plan: SubscriptionPlanEnum
  weight?: string
  size?: number
  sx?: any
  hoverToColor?: boolean
} & Omit<ComponentProps<typeof IconBox>, 'size' | 'weight' | 'sx'>) {
  const Icon: any = CrownSimple
  let color = 'neutral2'
  switch (plan) {
    case SubscriptionPlanEnum.STARTER:
      color = 'green2'
      break
    case SubscriptionPlanEnum.PRO:
      color = 'orange1'
      break
    case SubscriptionPlanEnum.ELITE:
      color = 'violet'
      break
  }

  return (
    <IconBox
      icon={<Icon weight={weight} size={size} />}
      color={color}
      sx={{ color: hoverToColor ? 'neutral2' : color, '&:hover': { color }, ...sx }}
      {...props}
    />
  )
}
