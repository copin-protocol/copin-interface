import React from 'react'

import { Type } from 'theme/base'

const Status = ({ status, getColorFn }: { status: string; getColorFn: (status: string) => string }) => {
  return (
    <Type.Caption
      color={getColorFn(status)}
      sx={{
        mr: -2,
        borderRadius: '16px',
        width: 'fit-content',
        textAlign: 'right',
        lineHeight: '24px',
        px: 2,
        bg: 'neutral7',
        textTransform: 'capitalize',
      }}
    >
      {status.split('_').join(' ').toLowerCase()}
    </Type.Caption>
  )
}

export default Status
