import { SystemStyleObject } from '@styled-system/css'
import React, { ComponentProps, ReactNode } from 'react'
import { GridProps } from 'styled-system'

import { IconBox } from 'theme/base'

import { Button } from '.'

const ButtonWithIcon = ({
  icon,
  direction = 'left',
  type = 'button',
  centered = true,
  children,
  spacing = 2,
  sx,
  iconSx,
  ...props
}: {
  icon: ReactNode
  iconSx?: SystemStyleObject & GridProps
  spacing?: number
  centered?: boolean
  direction?: 'left' | 'right'
  disabled?: boolean
} & ComponentProps<typeof Button>) => (
  <Button
    type={type}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: centered ? 'center' : 'space-between',
      flexDirection: direction === 'right' ? 'row-reverse' : 'row',
      ...sx,
    }}
    {...props}
  >
    <IconBox mr={direction === 'left' ? spacing : 0} ml={direction === 'right' ? spacing : 0} icon={icon} sx={iconSx} />
    {children}
  </Button>
)

export default ButtonWithIcon
