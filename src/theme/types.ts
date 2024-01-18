import { SystemStyleObject } from '@styled-system/css'
import { HTMLAttributes, ReactNode, SVGAttributes } from 'react'
import { DefaultTheme } from 'styled-components/macro'
import { ColorProps, FlexboxProps, GridProps, LayoutProps, SpaceProps, TypographyProps } from 'styled-system'

export type Color = string
export type Colors = {
  darkMode: boolean

  // base
  white: Color
  black: Color

  // backgrounds / greys
  neutral8: Color
  neutral7: Color
  neutral6: Color
  neutral5: Color
  neutral4: Color
  neutral3: Color
  neutral2: Color
  neutral1: Color

  //primary colors
  primary1: Color
  primary2: Color
  primary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green2: Color
  green1: Color
  green3: Color
  orange1: Color
  orange2: Color
  orange3: Color

  modalBG: Color
  modalBG1: Color
}

export type VariantProps = {
  theme?: DefaultTheme
  variant?: string
  tx?: string
}

export type SxProps = {
  theme?: DefaultTheme
  sx?: SystemStyleObject & GridProps
}
export type CssProps = { theme?: DefaultTheme; __css?: SystemStyleObject }

export type BoxProps = SpaceProps &
  LayoutProps &
  TypographyProps &
  ColorProps &
  FlexboxProps &
  VariantProps &
  SxProps & { itemId?: number | string } & { color?: string }

export type DivProps = BoxProps & HTMLAttributes<HTMLDivElement>
export type SvgProps = SpaceProps & LayoutProps & ColorProps & SxProps & SVGAttributes<SVGElement>
export type IconProps = BoxProps & { icon: ReactNode } & HTMLAttributes<HTMLDivElement>

export interface FileProps {
  preview: string
  file: File
}
