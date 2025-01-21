import { Eye, EyeClosed } from '@phosphor-icons/react'
import { ComponentType, ReactNode, useState } from 'react'

import { Box, Flex } from 'theme/base'

export default function BalanceText({
  value,
  defaultShow,
  component: Component,
}: {
  value: ReactNode
  defaultShow?: boolean
  component: ComponentType<any>
}) {
  const [show, setShow] = useState(!!defaultShow)

  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {show ? (
        <Component color="neutral1">{value}</Component>
      ) : (
        <Component sx={{ lineHeight: '1em', transform: 'translateY(3px)' }}>******</Component>
      )}

      <Box
        role="button"
        onClick={() => setShow((prev) => !prev)}
        sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' }, lineHeight: 0 }}
      >
        {show ? <EyeClosed onClick={() => setShow(true)} /> : <Eye />}
      </Box>
    </Flex>
  )
}
