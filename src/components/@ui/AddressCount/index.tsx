import { User } from '@phosphor-icons/react'

import { Flex, IconBox, Type } from 'theme/base'

export default function AddressCount({ count, color, bg }: { count: number; color: string; bg: string }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 1, px: '6px', py: '2px', borderRadius: 'sm', bg }}>
      <IconBox color={color} icon={<User size={14} weight="bold" />} />
      <Type.Caption color={color}>{count}</Type.Caption>
    </Flex>
  )
}
