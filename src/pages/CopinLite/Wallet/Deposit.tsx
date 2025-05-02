import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Image, Type } from 'theme/base'
import { ELEMENT_IDS, URL_PARAM_KEYS } from 'utils/config/keys'
import { parseChainImage, parseCollateralColorImage } from 'utils/helpers/transform'

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
        <Image src={parseChainImage('ARB')} height={28} />
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
          size={lg ? 120 : 200}
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
      <CopyButton value={address} variant="outline" mt={[24, 24, 24, 3]} mx="auto">
        {address}
      </CopyButton>
      <Box my={2} width={372} mx="auto" textAlign="center" color="neutral2">
        <Type.Caption>
          <Trans>This address can only receive native USDC from the Arbitrum network. Minimum deposit is 5 USDC.</Trans>
        </Type.Caption>
      </Box>
    </>
  )
}

export default LiteDeposit
