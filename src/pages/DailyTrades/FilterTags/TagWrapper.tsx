import { XCircle } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { Flex, IconBox } from 'theme/base'

export default function TagWrapper({
  children,
  onClear,
  sx = {},
}: {
  children: ReactNode
  onClear?: () => void
  sx?: any
}) {
  return (
    <Flex
      sx={{
        height: '28px',
        px: '6px',
        borderRadius: '4px',
        gap: 2,
        bg: 'neutral5',
        alignItems: 'center',
        color: 'neutral2',
        '& > *:first-child': { color: 'neutral3' },
        ...sx,
      }}
    >
      {children}
      {onClear && (
        <IconBox
          role="button"
          icon={<XCircle size={16} />}
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
          onClick={onClear}
        />
      )}
    </Flex>
  )
}
