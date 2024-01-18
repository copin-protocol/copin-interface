import css from '@styled-system/css'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { sx } from 'theme/base'

export const BottomTabWrapperMobile = styled(Box)(
  css({
    display: ['flex', 'flex', 'none'],
    height: 40,
    bg: 'neutral8',
    width: '100%',
    alignItems: 'center',
    borderTop: 'small',
    borderTopColor: 'neutral4',
  }),
  sx
)

export const BodyWrapperMobile = styled(Box)(
  css({
    pb: 40,
    width: '100%',
    height: '100%',
  }),
  sx
)

export function BottomTabItemMobile({
  onClick,
  color = 'primary1',
  icon,
  text,
  fontWeight = 500,
}: {
  icon: ReactNode
  text: ReactNode
  color?: string
  onClick?: () => void
  fontWeight?: number
}) {
  return (
    <Flex
      role="button"
      width="100%"
      color={color}
      sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}
      onClick={onClick}
    >
      <IconBox icon={icon} color="inherit" />
      <Type.Body sx={{ fontWeight }}>{text}</Type.Body>
    </Flex>
  )
}
