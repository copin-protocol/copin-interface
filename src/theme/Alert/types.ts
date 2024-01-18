import { HTMLAttributes } from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { SxProps, VariantProps } from 'theme/types'

export const variants = {
  PRIMARY: 'primary',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  OUTLINE: 'outline',
  CARD: 'card',
  CARD_WARNING: 'cardWarning',
  WARNING_PRIMARY: 'warningPrimary',
} as const

export type AlertProps = { block?: boolean } & SxProps &
  LayoutProps &
  SpaceProps &
  VariantProps &
  HTMLAttributes<HTMLDivElement>

export type Variant = typeof variants[keyof typeof variants]
