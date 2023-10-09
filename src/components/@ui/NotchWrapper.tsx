import { ComponentProps, ReactNode } from 'react'

import { Box, IconBox } from 'theme/base'
import { Colors } from 'theme/types'

export default function NotchIconWrapper({
  icon,
  iconColor,
  sx,
  ...props
}: {
  icon: ReactNode
  iconColor: keyof Omit<Colors, 'darkMode'>
} & ComponentProps<typeof Box>) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '-16px',
        left: '-8px',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, 32px 0, 0 32px)',
        ...(sx ?? {}),
      }}
      width={32}
      height={32}
      {...props}
    >
      <IconBox icon={icon} color={iconColor} sx={{ position: 'absolute', top: '2px', left: '2px', zIndex: 1 }} />
    </Box>
  )
}
