import css from '@styled-system/css'
import styled from 'styled-components/macro'

import { Button } from 'theme/Buttons'
import { SxProps } from 'theme/types'

export type TabItemProps = {
  active?: boolean
  hasLine?: boolean
  sx?: SxProps
  size?: 'lg' | 'md'
  as?: React.ElementType
  to?: string
}

const TabItem = styled(Button)(({ active, sx, hasLine, size = 'md' }: TabItemProps) =>
  css({
    border: 'none',
    px: '12px',
    py: '11px',
    fontWeight: 'normal',
    fontSize: size === 'md' ? '12px' : '14px',
    lineHeight: size === 'md' ? '18px' : '20px',
    width: 'fit-content',
    background: 'transparent',
    color: active ? 'neutral1' : 'neutral3',
    '&:hover': {
      color: 'neutral1',
    },
    borderRadius: 0,
    borderBottom: hasLine ? 'small' : 'none',
    borderColor: hasLine ? (active ? 'primary1' : 'neutral4') : 'transparent',
    ...sx,
  })
)

export default TabItem
