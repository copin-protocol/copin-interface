import React from 'react'

import { Box } from 'theme/base'

const Divider = ({ color = 'neutral4', isDashed = false, ...props }: { color?: string; isDashed?: boolean } & any) => {
  return (
    <Box
      {...props}
      sx={{
        flexShrink: 0,
        height: '1px',
        bg: isDashed ? 'transparent' : color,
        borderTop: isDashed ? '1px dashed' : undefined,
        borderColor: isDashed ? color : undefined,
        ...(props?.sx || {}),
      }}
    />
  )
}

export default Divider
