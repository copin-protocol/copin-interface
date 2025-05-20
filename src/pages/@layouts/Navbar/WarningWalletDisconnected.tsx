import { Trans } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'

import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

export default function WarningWalletDisconnected() {
  const { account, profile, isAuthenticated, reconnectWallet } = useAuthContext()

  if (!isAuthenticated || !profile) return null

  if (profile.username.includes('@') || account?.toLowerCase() === profile.username.toLowerCase()) return null

  return (
    <>
      <IconBox
        color="orange1"
        icon={<Info size={16} />}
        data-tooltip-id="tt_switch_account"
        data-tooltip-delay-show={360}
      />
      <Tooltip id="tt_switch_account" place="bottom" clickable>
        <Box sx={{ maxWidth: 350 }}>
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption>
              <IconBox
                icon={<Info size={12} color={themeColors.orange1} />}
                mr={1}
                sx={{ position: 'relative', top: '-1px' }}
              />
              {/* <Box display="inline-block" pr="2px">
                <Info size={12} color={themeColors.orange1} />
              </Box> */}
              <Trans>Notice: Your wallet has been disconnected from Copin</Trans>
            </Type.Caption>
          </Flex>

          <Button variant="ghostPrimary" type="button" p={0} onClick={reconnectWallet} sx={{ mt: 1 }}>
            <Trans>Connect Wallet</Trans>
          </Button>
        </Box>
      </Tooltip>
    </>
  )
}
