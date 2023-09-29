import { Trans } from '@lingui/macro'
import { Clock, Key, SignOut, UserCircle, UserCircleMinus, Users } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { isAddress } from 'utils/web3/contracts'

import ChangePasswordModal from './ChangePasswordModal'
import PremiumTag from './PremiumTag'

const NavUser = () => {
  const [isShowModalLogout, setIsShowModalLogout] = useState(false)
  const [isShowModalChangePassword, setIsShowModalChangePassword] = useState(false)
  const { logout, profile } = useAuthContext()
  const _address = useMemo(() => isAddress(profile?.username), [profile?.username])
  const hasCopyPermission = useCopyTradePermission()

  const logEventRoutes = (action: string) => {
    logEvent({
      label: getUserForTracking(profile?.username),
      category: EventCategory.ROUTES,
      action,
    })
  }

  return (
    <Flex alignItems="center" sx={{ height: NAVBAR_HEIGHT - 1 }}>
      <Flex flexDirection="column" alignItems="flex-start">
        <Dropdown
          menuSx={{
            width: 200,
          }}
          menu={
            <>
              {hasCopyPermission && (
                <div>
                  <Link to={ROUTES.MY_MANAGEMENT.path}>
                    <DropdownItem onClick={() => logEventRoutes(EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE)}>
                      <Flex alignItems="center" sx={{ gap: 2 }}>
                        <UserCircle size={20} />
                        <Box color="neutral1">
                          <Trans>Profile</Trans>
                        </Box>
                      </Flex>
                    </DropdownItem>
                  </Link>
                  <Link to={ROUTES.MY_PROFILE_OLD.path}>
                    <DropdownItem onClick={() => logEventRoutes(EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE_OLD)}>
                      <Flex alignItems="center" sx={{ gap: 2 }}>
                        <UserCircleMinus size={20} />
                        <Box color="neutral1">
                          <Trans>Profile (Old)</Trans>
                        </Box>
                      </Flex>
                    </DropdownItem>
                  </Link>
                  <Link to={ROUTES.MY_HISTORY.path}>
                    <DropdownItem onClick={() => logEventRoutes(EVENT_ACTIONS[EventCategory.ROUTES].HISTORY)}>
                      <Flex alignItems="center" sx={{ gap: 2 }}>
                        <Clock size={20} />
                        <Box color="neutral1">
                          <Trans>History</Trans>
                        </Box>
                      </Flex>
                    </DropdownItem>
                  </Link>
                  <Link to={ROUTES.MY_REFERRAL.path}>
                    <DropdownItem onClick={() => logEventRoutes(EVENT_ACTIONS[EventCategory.ROUTES].MY_REFERRAL)}>
                      <Flex alignItems="center" sx={{ gap: 2 }}>
                        <Users size={20} />
                        <Box color="neutral1">
                          <Trans>Referral</Trans>
                        </Box>
                      </Flex>
                    </DropdownItem>
                  </Link>
                </div>
              )}
              <DropdownItem onClick={() => setIsShowModalChangePassword(true)}>
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <Key size={20} />
                  <Box>
                    <Trans>Change Password</Trans>
                  </Box>
                </Flex>
              </DropdownItem>
              <div>
                <DropdownItem onClick={() => setIsShowModalLogout(true)}>
                  <Flex alignItems="center" color="red2" sx={{ gap: 2 }}>
                    <SignOut size={20} />
                    <Box>
                      <Trans>Logout</Trans>
                    </Box>
                  </Flex>
                </DropdownItem>
              </div>
            </>
          }
          sx={{
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'neutral7',
            px: 3,
          }}
          buttonSx={{
            border: 'none',
            p: 0,
          }}
          placement="bottomRight"
        >
          <Type.CaptionBold maxWidth={['120px', 'max-content']} sx={{ ...overflowEllipsis(), display: 'flex' }}>
            {_address ? addressShorten(_address) : profile?.username}
          </Type.CaptionBold>
        </Dropdown>
        <PremiumTag />
      </Flex>
      {isShowModalChangePassword && <ChangePasswordModal onDismiss={() => setIsShowModalChangePassword(false)} />}
      {isShowModalLogout && (
        <Modal isOpen={isShowModalLogout} onDismiss={() => setIsShowModalLogout(false)}>
          <Box p={4}>
            <Flex justifyContent="center" flexDirection="column">
              <Box textAlign="center">
                <Type.BodyBold>
                  <Trans>Are you sure to logout?</Trans>
                </Type.BodyBold>
              </Box>
            </Flex>

            <Flex mt={4} justifyContent="space-between">
              <Button variant="outline" px={4} width="49%" type="button" onClick={() => setIsShowModalLogout(false)}>
                <Trans>Back</Trans>
              </Button>
              <Button type="button" variant="primary" px={4} width="49%" onClick={logout}>
                <Trans>Confirm</Trans>
              </Button>
            </Flex>
          </Box>
        </Modal>
      )}
    </Flex>
  )
}

export default NavUser
