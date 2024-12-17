import { Warning } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import { useAuthContext } from 'hooks/web3/useAuth'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ELEMENT_IDS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export default function WarningBetaVersion() {
  // const { showBanner, handleCloseBanner } = useBingXBannerDisplay()
  const { isAuthenticated } = useAuthContext()
  return (
    <Flex
      id={ELEMENT_IDS.DCP_WARNING_BANNER}
      sx={{
        position: 'relative',
        width: '100%',
        height: 'max-content',
        overflow: 'hidden',
        bg: `${themeColors.orange1}15`,
        p: '8px 16px',
        alignItems: 'center',
        transition: '0.3s',
        color: 'orange1',
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
          <IconBox icon={<Warning size={16} />} /> HyperLiquid Exchange API Key update required. We kindly ask you to
          update your HyperLiquid wallet API Key before 00:00 UTC, 14 Dec 2024.{' '}
          {isAuthenticated && (
            <Box as={Link} color="neutral1" to={ROUTES.WALLET_MANAGEMENT.path}>
              Go to upgrade
            </Box>
          )}
        </Type.Caption>
      </Flex>
    </Flex>
  )
}
