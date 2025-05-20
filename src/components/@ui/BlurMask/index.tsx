import { ReactNode } from 'react'

import { Flex } from 'theme/base'

interface BlurMaskProps {
  children: ReactNode
  isBlur?: boolean
  zIndex?: number
}

export default function BlurMask({ children, isBlur, zIndex }: BlurMaskProps) {
  return isBlur ? (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backdropFilter: 'blur(12px)',
        zIndex: zIndex ?? 9,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Flex>
  ) : null
}
