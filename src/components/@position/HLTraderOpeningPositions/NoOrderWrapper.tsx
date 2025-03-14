import { ReactNode } from 'react'

import { Flex } from 'theme/base'

export default function NoOrderWrapper({ isDrawer, children }: { isDrawer: boolean; children: ReactNode }) {
  return (
    <Flex
      p={3}
      flexDirection="column"
      width="100%"
      height={isDrawer ? 60 : 180}
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Flex>
  )
}
