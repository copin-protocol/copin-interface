import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { QRCodeSVG } from 'qrcode.react'

import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Image, Type } from 'theme/base'
import { ELEMENT_IDS } from 'utils/config/keys'
import { parseCollateralColorImage } from 'utils/helpers/transform'

const LiteDeposit = ({ address }: { address: string }) => {
  const { lg } = useResponsive()
  return (
    <>
      <Flex mx="auto" justifyContent="center" py={[24, 24, 24, 12]} alignItems="center" sx={{ gap: 2 }}>
        <Image src="/images/chains/ARB.png" height={28} />
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
