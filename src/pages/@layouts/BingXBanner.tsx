import { Trans } from '@lingui/macro'
import { ArrowRight, XCircle } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { getStoredWallet } from 'apis/helpers'
import bingXText from 'assets/images/bingx-text.png'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ELEMENT_IDS, STORAGE_KEYS } from 'utils/config/keys'

export default function BingXBanner() {
  const { showBanner, handleCloseBanner } = useBingXBannerDisplay()
  return (
    <Flex
      id={ELEMENT_IDS.BINGX_INFO_WRAPPER}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: showBanner ? 56 : 0,
        height: 'max-content',
        maxHeight: showBanner ? 100 : 0,
        overflow: 'hidden',
        bg: '#2B5EF6',
        p: showBanner ? '4px 16px' : 0,
        alignItems: 'center',
        transition: '0.3s',
      }}
    >
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'column', 'row'],
          alignItems: ['start', 'start', 'start', 'center'],
          justifyContent: 'center',
          columnGap: 2,
          mx: ['unset', 'unset', 'unset', 'auto'],
          color: 'inherit',
        }}
        as="a"
        href={LINKS.registerBingX}
        target="_blank"
      >
        <Image display={{ _: 'none', lg: 'block' }} height="24" src={bingXText} mr="2px" />
        <Type.CaptionBold sx={{ maxWidth: [330, 'max-content'] }}>
          <Trans>To support Copin, please register a BingX account using the referral link: DY5QNN</Trans>
        </Type.CaptionBold>
        <Box
          display={{ _: 'none', lg: 'block' }}
          sx={{ width: '4px', height: '4px', borderRadius: '50%', bg: 'neutral1', flexShrink: 0 }}
        />
        <Type.Caption sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <Trans>Enjoy a 10% transaction fee rebate</Trans>
          <ArrowRight size={16} />
        </Type.Caption>
      </Flex>
      <IconBox
        role="button"
        icon={<XCircle size={16} />}
        color="neutral2"
        sx={{ '&:hover': { color: 'neutral1' }, position: 'absolute', top: 10, right: 10 }}
        onClick={handleCloseBanner}
      />
    </Flex>
  )
}

function useBingXBannerDisplay() {
  const [showBanner, setShowBanner] = useState(false)
  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const _showBanner = localStorage.getItem(STORAGE_KEYS.BINGX_NOTE)
    if (_showBanner == null || _showBanner === '1') {
      setShowBanner(true)
      localStorage.setItem(STORAGE_KEYS.BINGX_NOTE, '1')
      return
    }
    if (_showBanner === '0') setShowBanner(false)
  }, [])
  const handleCloseBanner = () => {
    setShowBanner(false)
    const { account } = getStoredWallet()
    if (!account) {
      localStorage.removeItem(STORAGE_KEYS.BINGX_NOTE)
      return
    }
    localStorage.setItem(STORAGE_KEYS.BINGX_NOTE, '0')
  }

  return { showBanner, handleCloseBanner }
}
