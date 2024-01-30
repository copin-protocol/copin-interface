import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React, { Fragment } from 'react'

import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Li, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { LINKS } from 'utils/config/constants'

const BingXHelp = ({
  hasBorder = false,
  isList = false,
  ...props
}: BoxProps & { hasBorder?: boolean; isList?: boolean }) => {
  const handleOpenUrl = (url: string) => {
    return window.open(url, '_blank')
  }
  const Wrapper = isList ? Li : Fragment

  return (
    <Flex flexDirection="column" sx={{ gap: 20 }} {...props}>
      <Wrapper>
        <Box
          sx={{
            ...(hasBorder
              ? { p: 2, border: 'small', bg: 'neutral6', borderColor: 'neutral4', borderRadius: 'sm' }
              : {}),
          }}
        >
          <Flex mb={2} sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <Type.Caption>
              <Trans>Don’t have a BingX account?</Trans>
            </Type.Caption>
            <Button
              type="button"
              variant="ghostPrimary"
              onClick={() => handleOpenUrl(LINKS.registerBingX)}
              sx={{ mx: 0, p: 0 }}
            >
              <Trans>Register</Trans>
            </Button>
          </Flex>
          <Type.Caption color="neutral3">
            <Trans>Get 10% transaction fee rebate with code:</Trans>{' '}
            <CopyButton
              value={'DY5QNN'}
              sx={{
                display: 'inline-block',
                color: 'neutral1',
                '&:hover': {
                  color: 'neutral2',
                  '.icon_wrapper': { color: 'primary2' },
                },
                p: 0,
                '& *': { fontWeight: 700 },
                '& .icon_wrapper': { color: 'primary1' },
              }}
            >
              DY5QNN
            </CopyButton>
          </Type.Caption>
          {/* <Type.CaptionBold>DY5QNN</Type.CaptionBold> */}
        </Box>
      </Wrapper>

      <Wrapper>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption>
            <Trans>How to get BingX API Key?</Trans>
          </Type.Caption>
          <ButtonWithIcon
            type="button"
            variant="ghostPrimary"
            icon={<ArrowSquareOut size={20} />}
            size={20}
            onClick={() => handleOpenUrl(LINKS.getBingXAPIKey)}
            sx={{ mx: 0, p: 0 }}
          />
        </Flex>
      </Wrapper>

      <Wrapper>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption>
            <Trans>How to get BingX Secret Key?</Trans>
          </Type.Caption>
          <ButtonWithIcon
            type="button"
            variant="ghostPrimary"
            icon={<ArrowSquareOut size={20} />}
            size={20}
            onClick={() => handleOpenUrl(LINKS.getBingXAPIKey)}
            sx={{ mx: 0, p: 0 }}
          />
        </Flex>
      </Wrapper>
    </Flex>
  )
}

export default BingXHelp
