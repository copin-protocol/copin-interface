import { XCircle } from '@phosphor-icons/react'

import { Box, Flex, Type } from 'theme/base'

export default function SelectedTag({ title, handleDelete }: { title: string; handleDelete: () => void }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2, px: 2, py: 1, bg: 'neutral5', flexShrink: 0, borderRadius: 'sm' }}>
      <Type.Caption>{title}</Type.Caption>
      <Box
        role="button"
        onClick={handleDelete}
        lineHeight={0}
        sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' } }}
      >
        <XCircle size={20} />
      </Box>
    </Flex>
  )
}
