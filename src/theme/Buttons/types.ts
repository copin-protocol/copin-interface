import { ButtonHTMLAttributes } from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { SxProps, VariantProps } from 'theme/types'

export const sizes = {
  LG: 'lg',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
  ICON: 'icon',
} as const

export const variants = {
  PRIMARY: 'primary',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  OUTLINE: 'outline',
  OUTLINE_DANGER: 'outlineDanger',
  OUTLINE_PRIMARY: 'outlinePrimary',
  OUTLINE_ACTIVE: 'outlineActive',
  OUTLINE_INACTIVE: 'outlineInactive',
  GHOST: 'ghost',
  GHOST_PRIMARY: 'ghostPrimary',
  GHOST_SUCCESS: 'ghostSuccess',
  GHOST_DANGER: 'ghostDanger',
  GHOST_ACTIVE: 'ghostActive',
  GHOST_INACTIVE: 'ghostInactive',
  GHOST_WARNING: 'ghostWarning',
  WHITE: 'white',
} as const

export type ButtonProps = {
  block?: boolean
  isLoading?: boolean
  itemId?: number | string
} & SxProps &
  LayoutProps &
  SpaceProps &
  VariantProps &
  ButtonHTMLAttributes<HTMLButtonElement>

export type Size = (typeof sizes)[keyof typeof sizes]
export type Variant = (typeof variants)[keyof typeof variants]
