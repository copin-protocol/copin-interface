import { ComponentProps } from 'react'

import { IconBox } from 'theme/base'

export default function SquareIconButton({ sx, ...rest }: ComponentProps<typeof IconBox>) {
  return (
    <IconBox
      role="button"
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 'sm',
        border: 'small',
        borderColor: 'neutral4',
        color: 'neutral2',
        '&:hover': { color: 'neutral1', borderColor: 'neutral3' },
        ...(sx || {}),
      }}
      {...rest}
    />
  )
}
