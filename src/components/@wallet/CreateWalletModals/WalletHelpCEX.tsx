import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React, { Fragment } from 'react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
// import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Li, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { EXCHANGES_INFO } from 'utils/config/platforms'

const WalletHelpCEX = ({
  exchange,
  hasBorder = false,
  isList = false,
  ...props
}: BoxProps & { exchange: CopyTradePlatformEnum; hasBorder?: boolean; isList?: boolean }) => {
  const Wrapper = isList ? Li : Fragment
  const exchangeInfo = EXCHANGES_INFO[exchange]

  return (
    <Flex flexDirection="column" sx={{ gap: 2 }} {...props}>
      <Wrapper>
        <Box
          sx={{
            ...(hasBorder
              ? { p: 2, border: 'small', bg: 'neutral4', borderColor: 'neutral4', borderRadius: 'sm' }
              : {}),
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption>
              <Trans>Don’t have a {exchangeInfo.name} account?</Trans>
            </Type.Caption>
            <Type.Caption>-</Type.Caption>
            <ButtonWithIcon
              type="button"
              variant="ghostPrimary"
              as="a"
              href={exchangeInfo.linkRegister}
              target="_blank"
              direction="right"
              icon={<ArrowSquareOut size={16} />}
              sx={{ mx: 0, p: 0, fontSize: '12px', lineHeight: '18px' }}
            >
              <Trans>Register</Trans>
            </ButtonWithIcon>
          </Flex>
        </Box>
      </Wrapper>

      <Wrapper>
        <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Type.Caption>
            <Trans>How to connect your {exchangeInfo.name} API to Copin?</Trans>
          </Type.Caption>
          <Type.Caption>-</Type.Caption>
          <ButtonWithIcon
            type="button"
            variant="ghostPrimary"
            as="a"
            href={exchangeInfo.linkTutorial}
            target="_blank"
            direction="right"
            icon={<ArrowSquareOut size={16} />}
            sx={{ mx: 0, p: 0, fontSize: '12px', lineHeight: '18px' }}
          >
            <Trans> Learn how?</Trans>
          </ButtonWithIcon>
        </Flex>
      </Wrapper>
    </Flex>
  )
}

export default WalletHelpCEX
