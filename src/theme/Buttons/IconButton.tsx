import { ReactNode } from 'react'

import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'

import { Button } from '.'
import { ButtonProps } from './types'

const IconButton = ({
  icon,
  variant = 'outlineGhost',
  type = 'button',
  borderRadius = '40px',
  size = '40px',
  sx,
  ...props
}: {
  icon: ReactNode
  iconColor?: string
  variant?: string
  borderRadius?: number | string
  size?: number | string
  as?: any
  htmlFor?: string
} & ButtonProps) => (
  <Button
    width={size}
    height={size}
    type={type}
    variant={variant}
    {...props}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius,
      p: 0,
      'svg, span': {
        verticalAlign: 'middle',
      },
      ...sx,
    }}
  >
    {icon}
  </Button>
)

export default IconButton

export const DumbIconButton = ({
  icon,
  disabled = false,
  width = '40px',
  height = '40px',
  sx,
  ...props
}: BoxProps & { icon: ReactNode; disabled?: boolean } & any) => (
  <Box
    width={width}
    height={height}
    {...props}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: 'normal',
      borderColor: 'neutral6',
      bg: disabled ? 'neutral7' : 'transparent',
      opacity: disabled ? 0.5 : 1,
      color: 'neutral3',
      p: 0,
      '&:hover, &:focus': {
        cursor: disabled ? 'not-allowed' : 'pointer',
        bg: disabled ? 'neutral7' : 'neutral6',
      },
      'svg, span': {
        verticalAlign: 'middle',
      },
      ...sx,
    }}
  >
    {icon}
  </Box>
)
