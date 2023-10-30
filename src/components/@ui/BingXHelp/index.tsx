import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React from 'react'

import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { LINKS } from 'utils/config/constants'

const BingXHelp = ({ ...props }: BoxProps) => {
  const handleOpenUrl = (url: string) => {
    return window.open(url, '_blank')
  }

  return (
    <Flex flexDirection="column" sx={{ gap: 20 }} {...props}>
      <Flex alignItems="center" sx={{ gap: 2 }}>
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
    </Flex>
  )
}

export default BingXHelp
