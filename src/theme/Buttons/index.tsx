import css from '@styled-system/css'
import styled from 'styled-components/macro'
import { compose, layout, space, variant as systemVariant } from 'styled-system'

import { sx } from 'theme/base'

import { sizeVariants, styleVariants } from './theme'
import { ButtonProps } from './types'

export const Button = styled.button<ButtonProps>(
  css({
    appearance: 'none',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
    px: '12px',
    py: '10px',
    color: 'neutral7',
    bg: 'neutral6',
    borderRadius: 'button',
  }),

  ({ theme, block, isLoading, size }) => `&:before {
    position: relative;
    top: 3px;
    content: '';
    border: ${size === 'xs' ? 1 : 2}px solid ${theme.colors.neutral1}16;
    border-top: ${size === 'xs' ? 1 : 2}px solid ${theme.colors.neutral2};
    border-radius: 50%;
    width: ${size === 'xs' ? 12 : 16}px;
    height: ${size === 'xs' ? 12 : 16}px;
    margin-right: ${size === 'xs' ? 4 : 8}px;
    animation: spin 1s linear infinite;
    display: ${isLoading ? 'inline-block' : 'none'};
  }
  display: ${block ? 'block' : 'inline-block'};
  width: ${block ? '100%' : 'auto'};
  `,
  systemVariant({
    scale: 'buttons',
    variants: styleVariants,
  }),
  systemVariant({
    prop: 'size',
    variants: sizeVariants,
  }),
  compose(space, layout),
  sx
)

export type { ButtonProps, Size as ButtonSize, Variant as ButtonVariant } from './types'
