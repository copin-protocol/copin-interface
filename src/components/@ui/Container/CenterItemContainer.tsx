import { ReactNode } from 'react'

import { Flex } from 'theme/base'

export default function CenterItemContainer({ children, sx }: { children: ReactNode; sx?: any }) {
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...(sx ?? {}),
      }}
    >
      {children}
    </Flex>
  )
}
