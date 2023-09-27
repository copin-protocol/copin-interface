import css from '@styled-system/css'
import React, { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { compose, layout, space, variant as systemVariant } from 'styled-system'

import { Box, Type, sx } from 'theme/base'

import { styleVariants } from './theme'
import { AlertProps, Variant } from './types'

export const AlertStyled = styled.div<AlertProps>(
  css({
    appearance: 'none',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
    bg: 'transparent',
    border: 'small',
    borderRadius: 'sm',
    p: '2',
  }),

  ({ block }) => `
  display: ${block ? 'block' : 'inline-block'};
  width: ${block ? '100%' : 'auto'};
  `,
  systemVariant({
    scale: 'buttons',
    variants: styleVariants,
  }),
  compose(space, layout),
  sx
)

function Alert({
  message,
  description,
  block = true,
  variant = 'success',
  sx,
  ...props
}: {
  message?: ReactNode
  description?: ReactNode
  variant?: Variant
  block?: boolean
} & AlertProps) {
  return (
    <AlertStyled variant={variant} {...props} block={block} sx={{ ...sx }}>
      {message && (
        <Box mb={1}>
          <Type.CaptionBold>{message}</Type.CaptionBold>
        </Box>
      )}
      {description && <Type.Caption>{description}</Type.Caption>}
    </AlertStyled>
  )
}

export default Alert
