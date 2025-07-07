import React from 'react'

import { Flex } from 'theme/base'
import { SxProps } from 'theme/types'

const Tag = ({
  bg = 'rgba(255, 255, 255, 0.1)',
  sx,
  children,
  ...props
}: { bg?: string; children: React.ReactNode } & SxProps) => {
  return (
    <Flex
      variant="card"
      justifyContent="center"
      alignItems="center"
      bg={bg}
      sx={{
        borderRadius: '16px',
        gap: 1,
        px: '6px',
        py: '2px',
        ...(sx ?? {}),
      }}
      {...props}
    >
      {children}
    </Flex>
  )
}

export default Tag
