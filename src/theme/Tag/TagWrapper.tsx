import { XCircle } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { Flex, IconBox } from 'theme/base'
import { themeColors } from 'theme/colors'

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
        height: '20px',
        px: '8px',
        borderRadius: '24px',
        gap: 1,
        bg: 'neutral5',
        alignItems: 'center',
        color: 'neutral2',
        flexShrink: 0,
        textTransform: 'uppercase',
        '& > *:nth-child(1)': { color: `${themeColors.neutral3} !important` },
        '& > *:nth-child(2)': { color: `${themeColors.neutral2} !important` },
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
