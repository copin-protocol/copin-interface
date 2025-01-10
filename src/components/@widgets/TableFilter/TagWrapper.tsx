import { XCircle } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'

export default function TagWrapper({
  label,
  value,
  onClear,
  sx = {},
}: {
  label: ReactNode
  value: ReactNode
  onClear?: () => void
  sx?: any
}) {
  return (
    <Flex
      sx={{
        height: '24px',
        px: '6px',
        borderRadius: '4px',
        gap: 2,
        bg: 'neutral5',
        alignItems: 'center',
        color: 'neutral2',
        flexShrink: 0,
        textTransform: 'uppercase',
        ...sx,
      }}
    >
      <Type.Caption color="neutral3">{label}:</Type.Caption>
      <Type.Caption color="primary1">{value}</Type.Caption>
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
