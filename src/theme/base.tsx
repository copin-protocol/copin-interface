/* eslint-disable react/display-name */
import css, { get } from '@styled-system/css'
import React, { ComponentProps, ForwardedRef, HTMLAttributes, ImgHTMLAttributes, ReactNode, forwardRef } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'
import { SpaceProps, color, compose, flexbox, grid, layout, space, typography } from 'styled-system'

import { BoxProps, CssProps, SvgProps, SxProps, VariantProps } from './types'

export const sx = ({ sx, theme }: SxProps) => css(sx)(theme)
const base = ({ __css, theme }: CssProps) => css(__css)(theme)
const variant = ({ theme, variant, tx = 'variants' }: VariantProps) =>
  variant && theme ? css(get(theme, tx + '.' + variant, get(theme, variant)))(theme) : {}

const classnames = (...args: any[]) => args.join(' ')
const getClassName = (el: any) => (el.props && el.props.className) || ''

const StyledChildren = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const styledChildren = React.Children.toArray(children).map((child: any) =>
    React.cloneElement(child, {
      ...props,
      className: classnames(getClassName(child), className),
    })
  )
  return <>{styledChildren}</>
}
type SpacingProps = SpaceProps & HTMLAttributes<HTMLDivElement>

export const Space: React.FC<SpacingProps> = styled(StyledChildren)(space)

export const Box = styled.div<BoxProps>(
  {
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0,
  },
  base,
  variant,
  (props: any) => props.css,
  compose(space, layout, typography, color, flexbox),
  sx
)

export const Flex = styled(Box)<BoxProps>({
  display: 'flex',
})

export const Grid = styled(Box)<BoxProps>(
  {
    display: 'grid',
  },
  grid
)

export const Text = forwardRef((props: HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => (
  <Box ref={ref} tx="text" {...props} />
))

export const EllipsisText = styled.div<any>`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${({ lines }) => lines};
  -webkit-box-orient: vertical;
`

export const IconBox = ({ sx, icon, ...props }: ComponentProps<typeof Box> & { icon: ReactNode }) => (
  <Box
    sx={{
      lineHeight: 0,
      verticalAlign: 'middle',
      display: 'inline-block',
      ...sx,
    }}
    {...props}
  >
    {icon}
  </Box>
)

export const Svg = styled.svg<SvgProps>(compose(space, layout, color), sx)

export const Link = forwardRef((props, ref: ForwardedRef<HTMLAnchorElement>) => (
  <Box ref={ref} as="a" variant="link" {...props} />
))

export const LinkUnderline = forwardRef((props: any, ref: ForwardedRef<HTMLAnchorElement>) => (
  <Box
    ref={ref}
    as="a"
    sx={{
      textDecoration: props.hasLine ? 'underline' : 'none',
      '&:hover': {
        textDecoration: props.hoverHasLine ? 'underline' : 'none',
      },
      ...(props.sx ?? {}),
    }}
    {...props}
  />
))

export const Image = forwardRef(
  ({ sx, ...props }: BoxProps & ImgHTMLAttributes<HTMLImageElement>, ref: ForwardedRef<HTMLImageElement>) => (
    <Box ref={ref} as="img" draggable="false" maxWidth="100%" height="auto" verticalAlign="middle" sx={sx} {...props} />
  )
)

export const Card = forwardRef(
  (props: BoxProps & HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => (
    <Box ref={ref} variant="card" {...props} />
  )
)

export type TextProps = HTMLAttributes<HTMLDivElement> & BoxProps

const TextWrapper: React.FC<TextProps & { as?: string }> = styled(Text)`
  color: ${({ theme, color }: { theme: any; color?: string }) => (color ? theme.colors[color] : 'inherit')};
  overflow-wrap: break-word;
  word-break: break-word;
`

export const StyledLinkText = styled(Box)`
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`
export const LinkText = (props: TextProps & NavLinkProps & { children: ReactNode }) => (
  <StyledLinkText as={NavLink} {...props} />
)

export const Type = {
  H1({ children, ...props }: TextProps) {
    return (
      <Box as="h1" fontSize="48px" lineHeight="52px" letterSpacing="-2%" {...props}>
        {children}
      </Box>
    )
  },
  H2({ children, ...props }: TextProps) {
    return (
      <Box as="h2" fontSize="40px" lineHeight="48px" letterSpacing="-2%" {...props}>
        {children}
      </Box>
    )
  },
  H3({ children, ...props }: TextProps) {
    return (
      <Box as="h3" fontSize="32px" lineHeight="40px" letterSpacing="-2%" {...props}>
        {children}
      </Box>
    )
  },
  H4({ children, ...props }: TextProps) {
    return (
      <Box as="h4" fontSize="28px" lineHeight="36px" letterSpacing="-1%" {...props}>
        {children}
      </Box>
    )
  },
  H5({ children, ...props }: TextProps) {
    return (
      <Box as="h5" fontSize="24px" lineHeight="32px" fontWeight="bold" letterSpacing="-1%" {...props}>
        {children}
      </Box>
    )
  },
  Caption(props: TextProps) {
    return <TextWrapper fontSize="13px" lineHeight="22px" fontWeight="normal" display="inline-block" {...props} />
  },
  CaptionBold(props: TextProps) {
    return <TextWrapper fontSize="13px" lineHeight="22px" fontWeight="bold" display="inline-block" {...props} />
  },
  Small(props: TextProps) {
    return <TextWrapper fontSize="12px" lineHeight="16px" fontWeight="normal" display="inline-block" {...props} />
  },
  SmallBold(props: TextProps) {
    return <TextWrapper fontSize="12px" lineHeight="20px" display="inline-block" fontWeight="bold" {...props} />
  },
  Large(props: TextProps) {
    return <TextWrapper fontSize="18px" lineHeight="26px" fontWeight="normal" display="inline-block" {...props} />
  },
  LargeBold(props: TextProps) {
    return <TextWrapper fontSize="18px" lineHeight="26px" display="inline-block" fontWeight="bold" {...props} />
  },
  Body(props: TextProps) {
    return <TextWrapper fontSize="16px" lineHeight="24px" fontWeight="normal" display="inline-block" {...props} />
  },
  BodyBold(props: TextProps) {
    return <TextWrapper fontSize="16px" lineHeight="24px" display="inline-block" fontWeight="bold" {...props} />
  },
  Headline5(props: TextProps) {
    return <TextWrapper fontSize="20px" lineHeight="28px" display="inline-block" fontWeight="bold" {...props} />
  },
}

export const Li = styled(Box)`
  padding-left: 0.875em;
  position: relative;
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 0.375em;
    height: 0.375em;
    border-radius: 50%;
    background-color: currentcolor;
    left: 0;
    top: 0.6em;
  }
`
