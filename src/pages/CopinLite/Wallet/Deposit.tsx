import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Image, Type } from 'theme/base'
import { ELEMENT_IDS, URL_PARAM_KEYS } from 'utils/config/keys'
import { parseChainImage, parseCollateralColorImage } from 'utils/helpers/transform'

import ContactLink from './ContactLink'

const LiteDeposit = ({ address }: { address: string }) => {
  const { lg } = useResponsive()
  const { searchParams, setSearchParams } = useSearchParams()
  useEffect(() => {
    if (!!searchParams[URL_PARAM_KEYS.LITE_FORCE_SHAKE_DEPOSIT]) {
      const element = document.getElementById(ELEMENT_IDS.LITE_DEPOSIT_QRCODE)
      if (!element) return
      element.removeAttribute('data-animation-shake')
      setTimeout(() => {
        element.setAttribute('data-animation-shake', '1')
      }, 100)
      setSearchParams({ [URL_PARAM_KEYS.LITE_FORCE_SHAKE_DEPOSIT]: undefined })
    }
  }, [searchParams, setSearchParams])
  return (
    <>
      <Flex mx="auto" justifyContent="center" py={[24, 24, 24, 12]} alignItems="center" sx={{ gap: 2 }}>
        <Image src={parseChainImage('ARB')} height={20} />
        <Type.CaptionBold>
          <Trans>Send USDC over Arbitrum</Trans>
        </Type.CaptionBold>
      </Flex>
      <Box
        id={ELEMENT_IDS.LITE_DEPOSIT_QRCODE}
        bg="neutral1"
        sx={{ borderRadius: 'sm', p: 2, pb: 1, width: 'fit-content' }}
        mx="auto"
      >
        <QRCodeSVG
          value={address}
          size={lg ? 90 : 200}
          imageSettings={{
            src: parseCollateralColorImage('USDC'),
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            opacity: 1,
            excavate: true,
          }}
        />
      </Box>
      <CopyButton value={address} variant="outline" mt={[24, 24, 24, 3]} mx="auto" sx={{ px: 10 }}>
        {address}
      </CopyButton>
      <Box
        my={2}
        width={342}
        mx="auto"
        textAlign="left"
        color="neutral1"
        sx={{
          background: 'rgba(255, 194, 75, 0.1)',
          border: 'small',
          borderColor: 'orange1',
          borderRadius: 'sm',
          p: 10,
          '& span': {
            color: 'orange1',
          },
        }}
      >
        <Type.Caption>
          <Trans>
            There is a <span>minimum</span> deposit of
            <span> 5 USDC</span>. This address can only receive
            <span> USDC on the Arbitrum </span>network.
            <span> Lower amounts or wrong networks will cause unrecoverable loss</span>
          </Trans>
        </Type.Caption>
      </Box>
      <ContactLink />
    </>
  )
}

export default LiteDeposit
