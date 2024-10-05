import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React, { Fragment } from 'react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
// import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Li, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { LINKS } from 'utils/config/constants'

const WalletHelpGate = ({
  hasBorder = false,
  isList = false,
  ...props
}: BoxProps & { hasBorder?: boolean; isList?: boolean }) => {
  const Wrapper = isList ? Li : Fragment

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
              <Trans>Don’t have a Gate account?</Trans>
            </Type.Caption>
            <Type.Caption>-</Type.Caption>
            <ButtonWithIcon
              type="button"
              variant="ghostPrimary"
              as="a"
              href={LINKS.registerGate}
              target="_blank"
              direction="right"
              icon={<ArrowSquareOut size={16} />}
              sx={{ mx: 0, p: 0, fontSize: '14px' }}
            >
              <Trans>Register</Trans>
            </ButtonWithIcon>
          </Flex>
          {/*<Type.Caption color="neutral3">*/}
          {/*  <Trans>Get extra benefits with referral code:</Trans>{' '}*/}
          {/*  <CopyButton*/}
          {/*    value={'AgBFAApb'}*/}
          {/*    sx={{*/}
          {/*      backgroundColor: 'transparent',*/}
          {/*      display: 'inline-block',*/}
          {/*      color: 'neutral1',*/}
          {/*      '&:hover': {*/}
          {/*        color: 'neutral2',*/}
          {/*        '.icon_wrapper': { color: 'primary2' },*/}
          {/*      },*/}
          {/*      p: 0,*/}
          {/*      '& *': { fontWeight: 700 },*/}
          {/*      '& .icon_wrapper': { color: 'primary1' },*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    AgBFAApb*/}
          {/*  </CopyButton>*/}
          {/*</Type.Caption>*/}
        </Box>
      </Wrapper>

      <Wrapper>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption>
            <Trans>How to connect your Gate API to Copin?</Trans>
          </Type.Caption>
          <Type.Caption>-</Type.Caption>
          <ButtonWithIcon
            type="button"
            variant="ghostPrimary"
            as="a"
            href={LINKS.getGateAPIKey}
            target="_blank"
            direction="right"
            icon={<ArrowSquareOut size={16} />}
            sx={{ mx: 0, p: 0, fontSize: '14px' }}
          >
            <Trans>Learn how?</Trans>
          </ButtonWithIcon>
        </Flex>
      </Wrapper>
    </Flex>
  )
}

export default WalletHelpGate
