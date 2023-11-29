import css from '@styled-system/css'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { Button } from 'theme/Buttons'
import { Box, Flex, IconBox } from 'theme/base'
import { SxProps } from 'theme/types'

type TabItemProps = {
  active?: boolean
  inactiveHasLine?: boolean
  sx?: SxProps
}

const TabItem = styled(Button)(({ active, sx, inactiveHasLine }: TabItemProps) =>
  css({
    border: 'none',
    px: '0',
    py: '12px',
    fontSize: ['16px', '18px'],
    fontWeight: ['bold', 'bold', 'normal'],
    lineHeight: '24px',
    width: 'fit-content',
    background: 'transparent',
    color: active ? 'primary1' : 'neutral3',
    '&:hover,&:focus,&:active': {
      color: active ? 'primary1' : 'neutral1',
    },
    borderRadius: 0,
    borderBottom: ['none', 'normal'],
    borderColor: active
      ? ['none', 'primary1']
      : inactiveHasLine
      ? ['none', 'neutral6']
      : ['transparent', 'transparent'],
    ...sx,
  })
)

export default TabItem

export const TabTitle = ({ icon, children, active }: { icon: ReactNode; children?: ReactNode; active: boolean }) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <IconBox color={active ? 'neutral1' : 'neutral5'} icon={icon} />
      <Box
        display="inline-block"
        ml={8}
        sx={{
          fontSize: ['16px', '24px'],
          lineHeight: '24px',
        }}
      >
        {children}
      </Box>
    </Flex>
  )
}
