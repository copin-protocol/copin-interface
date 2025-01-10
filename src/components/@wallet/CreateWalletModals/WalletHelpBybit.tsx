import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React, { Fragment } from 'react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
// import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Li, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { LINKS } from 'utils/config/constants'

const WalletHelpBybit = ({
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
              <Trans>Don’t have a Bybit account?</Trans>
            </Type.Caption>
            <ButtonWithIcon
              type="button"
              variant="ghostPrimary"
              as="a"
              href={LINKS.registerBybit}
              target="_blank"
              direction="right"
              icon={<ArrowSquareOut size={16} />}
              sx={{ mx: 0, p: 0, fontSize: '12px', lineHeight: '18px' }}
            >
              <Trans>Register</Trans>
            </ButtonWithIcon>
          </Flex>
          {/*<Type.Caption color="neutral3">*/}
          {/*  <Trans>Get extra benefits with referral code:</Trans>{' '}*/}
          {/*  <CopyButton*/}
          {/*    value={'COPIN'}*/}
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
          {/*    COPIN*/}
          {/*  </CopyButton>*/}
          {/*</Type.Caption>*/}
          {/* <Type.CaptionBold>DY5QNN</Type.CaptionBold> */}
        </Box>
      </Wrapper>

      <Wrapper>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption>
            <Trans>How to connect your Bybit API to Copin?</Trans>
          </Type.Caption>
          <Type.Caption>-</Type.Caption>
          <ButtonWithIcon
            type="button"
            variant="ghostPrimary"
            as="a"
            href={LINKS.getBybitAPIKey}
            target="_blank"
            direction="right"
            icon={<ArrowSquareOut size={16} />}
            sx={{ mx: 0, p: 0, fontSize: '12px', lineHeight: '18px' }}
          >
            <Trans>Learn how?</Trans>
          </ButtonWithIcon>
        </Flex>
      </Wrapper>
    </Flex>
  )
}

export default WalletHelpBybit
