import React, { ReactNode } from 'react'

import { Box } from 'theme/base'

const Container = ({ children, sx, ...props }: { children: ReactNode } & any) => {
  return (
    <Box
      // maxWidth={{ lg: 1560 }}
      // px={3}
      {...props}
      sx={{
        width: '100%',
        mx: 'auto',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Container
