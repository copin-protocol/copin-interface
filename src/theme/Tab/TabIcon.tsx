import { Trans } from '@lingui/macro'
import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'

import { Box, Flex } from 'theme/base'

const IconWrapper = styled(Flex)<{ active: boolean }>(({ active }) =>
  css({
    justifyContent: 'center',
    alignItems: 'center',
    bg: 'neutral7',
    color: active ? 'primary1' : 'neutral4',
    borderRadius: 48,
    width: 48,
    height: 48,
  })
)

function TabIcon({ icon, text, active }: { icon: React.ReactElement; text?: React.ReactNode; active: boolean }) {
  return (
    <Flex alignItems="center" justifyContent="center">
      <IconWrapper active={active}>{icon}</IconWrapper>
      <Box display="inline-block" ml={12}>
        <Trans>{text}</Trans>
      </Box>
    </Flex>
  )
}

export default TabIcon
