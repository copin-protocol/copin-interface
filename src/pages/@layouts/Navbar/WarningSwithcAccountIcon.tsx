import { Info } from '@phosphor-icons/react'

import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { addressShorten } from 'utils/helpers/format'

export default function WarningSwitchAccountIcon() {
  const { account, profile, isAuthenticated, handleSwitchAccount } = useAuthContext()

  if (!isAuthenticated || !profile) return null

  if (account?.address?.toLowerCase() === profile.username.toLowerCase()) return null

  return (
    <>
      <IconBox
        color="orange1"
        icon={<Info size={16} />}
        data-tooltip-id="tt_switch_account"
        data-tooltip-delay-show={360}
      />
      <Tooltip id="tt_switch_account" place="bottom" type="dark" effect="solid" clickable>
        <Box sx={{ maxWidth: 350 }}>
          <Flex alignItems="flex-start" sx={{ gap: 2 }}>
            <Type.Caption>
              <Box display="inline-block" pr="2px">
                <Info size={12} color={themeColors.orange1} />
              </Box>
              Notice: The account in your web3 wallet does not match the account currently in use in the app
            </Type.Caption>
          </Flex>

          <Button variant="ghostPrimary" type="button" p={0} onClick={handleSwitchAccount}>
            {!account ? 'Connect Wallet' : `Switch account to ${addressShorten(account?.address)}`}
          </Button>
        </Box>
      </Tooltip>
    </>
  )
}
