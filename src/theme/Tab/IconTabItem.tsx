import { Trans } from '@lingui/macro'
import css from '@styled-system/css'
import React from 'react'
import styled from 'styled-components/macro'

import { Flex, Type } from 'theme/base'

const IconWrapper = styled(Flex)<{ active: boolean }>(({ active }) =>
  css({
    justifyContent: 'center',
    alignItems: 'center',
    color: active ? 'primary1' : 'neutral4',
  })
)

function IconTabItem({ icon, text, active }: { icon: React.ReactElement; text?: React.ReactNode; active: boolean }) {
  return (
    <Flex alignItems="center" justifyContent="center">
      <IconWrapper active={active}>{icon}</IconWrapper>
      <Type.Body ml={2}>
        <Trans>{text}</Trans>
      </Type.Body>
    </Flex>
  )
}

export default IconTabItem
