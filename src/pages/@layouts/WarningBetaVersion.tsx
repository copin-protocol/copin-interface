import { Warning } from '@phosphor-icons/react'

import { Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

export default function WarningBetaVersion() {
  // const { showBanner, handleCloseBanner } = useBingXBannerDisplay()
  return (
    <Flex
      id={ELEMENT_IDS.DCP_WARNING_BANNER}
      sx={{
        position: 'relative',
        width: '100%',
        height: 'max-content',
        overflow: 'hidden',
        bg: 'orange1',
        p: '8px 16px',
        alignItems: 'center',
        transition: '0.3s',
        color: 'neutral8',
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
      >
        <Type.Caption>
          <IconBox icon={<Warning size={16} />} /> Smart Wallet is currently in alpha version and experiment phase.
          Please use caution and test with limited capital. If you encounter any issues, please contact direct support
          at:{' '}
          <a
            href={LINKS.support}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            https://t.me/leecopin
          </a>
        </Type.Caption>
      </Flex>
    </Flex>
  )
}
