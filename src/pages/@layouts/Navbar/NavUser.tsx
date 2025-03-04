import { Trans } from '@lingui/macro'
import { Clock, Crown, Notebook, SignOut, SquareHalf, Star, SubtractSquare, Wallet } from '@phosphor-icons/react'
import { ReactNode, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Divider from 'components/@ui/Divider'
import useCopyTradePermission from 'hooks/features/copyTrade/useCopyTradePermission'
import useInternalRole from 'hooks/features/useInternalRole'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import AlertIcon from 'theme/Icons/AlertIcon'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { generateFavoriteTradersRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams } from 'utils/helpers/protocol'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { isAddress } from 'utils/web3/contracts'

// import ChangePasswordModal from './ChangePasswordModal'
import PremiumTag from './PremiumTag'
import WarningExpiredSubscriptionIcon from './WarningExpiredSubscriptionIcon'
import WarningSwitchAccountIcon from './WarningSwithcAccountIcon'

const NavUser = () => {
  const { selectedProtocols } = useGlobalProtocolFilterStore()
  const protocolParams = convertProtocolToParams(selectedProtocols ?? [])

  const [isShowModalLogout, setIsShowModalLogout] = useState(false)
  // const [isShowModalChangePassword, setIsShowModalChangePassword] = useState(false)
  const { logout, profile, isAuthenticated } = useAuthContext()
  const _address = useMemo(() => isAddress(profile?.username), [profile?.username])
  const hasCopyPermission = useCopyTradePermission()
  const isInternal = useInternalRole()

  const [showMenu, setShowMenu] = useState(false)
  const onClickNavItem = (action?: string) => {
    setShowMenu(false)
    action &&
      logEvent({
        label: getUserForTracking(profile?.username),
        category: EventCategory.ROUTES,
        action,
      })
  }

  const otherRoutes = [
    // {
    //   link: ROUTES.SUBSCRIPTION.path,
    //   event: EVENT_ACTIONS[EventCategory.ROUTES].SUBSCRIPTION,
    //   icon: <CrownSimple size={20} />,
    //   label: <Trans>Subscription Plans</Trans>,
    //   isWeb3Required: true,
    // },
    {
      link: generateFavoriteTradersRoute({ params: { protocol: protocolParams } }),
      event: EVENT_ACTIONS[EventCategory.ROUTES].FAVORITES,
      icon: <Star size={20} />,
      label: <Trans>Trader Favorites</Trans>,
      isWeb3Required: false,
    },
  ]

  return (
    <Flex alignItems="center" sx={{ height: NAVBAR_HEIGHT - 1 }}>
      <Flex flexDirection="column" alignItems="flex-start">
        <Flex alignItems="center" sx={{ gap: 1, px: 2 }}>
          <Dropdown
            menuSx={{
              width: 200,
            }}
            inline
            buttonVariant="ghost"
            dismissible={false}
            menuDismissible
            visible={showMenu}
            setVisible={setShowMenu}
            menu={
              <>
                <Box mt={2} />
                <DropdownItem>
                  <Flex alignItems="center" sx={{ gap: 2 }}>
                    <CopyButton
                      type="button"
                      variant="ghost"
                      iconDirection="left"
                      value={_address}
                      size="sm"
                      iconSize={20}
                      sx={{ p: 0, width: '100%', justifyContent: 'flex-start' }}
                      iconSx={{ color: 'neutral1' }}
                    >
                      <Box>
                        <Trans>COPY YOUR ADDRESS</Trans>
                      </Box>
                    </CopyButton>
                  </Flex>
                </DropdownItem>
                {otherRoutes.map((configs, index) =>
                  configs.isWeb3Required && !isAuthenticated ? null : (
                    <NavItem
                      key={index}
                      link={configs.link}
                      onClick={() => onClickNavItem(configs.event)}
                      icon={configs.icon}
                      label={configs.label}
                    />
                  )
                )}
                <Box mt={2} />
                {hasCopyPermission && (
                  <>
                    <SectionDivider label={<Trans>Copy Management</Trans>} />
                    {(isInternal ? internalUserCopy : userCopy).map((configs, index) => (
                      <NavItem
                        key={index}
                        link={configs.link}
                        onClick={() => onClickNavItem(configs.event)}
                        icon={configs.icon}
                        label={configs.label}
                      />
                    ))}
                  </>
                )}
                <Box mb={3} />
                <SectionDivider label={<Trans>Wallet</Trans>} />
                <NavItem
                  link={ROUTES.WALLET_MANAGEMENT.path}
                  onClick={() => onClickNavItem(EVENT_ACTIONS[EventCategory.ROUTES].WALLET_MANAGEMENT)}
                  icon={<Wallet size={20} />}
                  label={<Trans>Wallet Management</Trans>}
                />
                <Box mb={3} />
                <SectionDivider label={<Trans>Settings</Trans>} />
                {userSettings.map((configs, index) =>
                  configs.isWeb3Required && !isAuthenticated ? null : (
                    <NavItem
                      key={index}
                      link={configs.link}
                      onClick={() => onClickNavItem(configs.event)}
                      icon={configs.icon}
                      label={configs.label}
                    />
                  )
                )}
                <Divider my={2} />
                {/* {!isAuthenticated && (
                  <DropdownItem
                    onClick={() => {
                      onClickNavItem()
                      setIsShowModalChangePassword(true)
                    }}
                  >
                    <Flex alignItems="center" sx={{ gap: 2 }}>
                      <Key size={20} />
                      <Box>
                        <Trans>Change Password</Trans>
                      </Box>
                    </Flex>
                  </DropdownItem>
                )} */}
                <div>
                  <DropdownItem
                    onClick={() => {
                      sessionStorage.clear()
                      onClickNavItem()
                      setIsShowModalLogout(true)
                    }}
                  >
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
            }}
            placement="bottomRight"
          >
            <Type.CaptionBold maxWidth={['120px', 'max-content']} sx={{ ...overflowEllipsis(), display: 'flex' }}>
              {_address ? addressShorten(_address) : profile?.username}
            </Type.CaptionBold>
          </Dropdown>
          <WarningSwitchAccountIcon />
        </Flex>
        <Flex sx={{ alignItems: 'center', gap: 1, px: 3 }}>
          <PremiumTag />
          <WarningExpiredSubscriptionIcon />
        </Flex>
      </Flex>
      {/* {isShowModalChangePassword && <ChangePasswordModal onDismiss={() => setIsShowModalChangePassword(false)} />} */}
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

type NavItemConfigs = {
  link: string
  onClick: () => void
  icon: JSX.Element
  label: JSX.Element
}

function NavItem(configs: NavItemConfigs) {
  return (
    <Link to={configs.link} style={{ display: 'block' }}>
      <DropdownItem onClick={configs.onClick}>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          {configs.icon}
          <Box color="neutral1">{configs.label}</Box>
        </Flex>
      </DropdownItem>
    </Link>
  )
}

function SectionDivider({ label }: { label: ReactNode }) {
  return (
    <Flex sx={{ px: 2, mb: 2, width: '100%', alignItems: 'center', gap: 2 }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
        {label}
      </Type.Caption>
      <Box sx={{ flex: 1 }}>
        <Divider />
      </Box>
    </Flex>
  )
}

const internalUserCopy = [
  {
    link: ROUTES.MY_MANAGEMENT.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE,
    icon: <SquareHalf size={20} />,
    label: <Trans>API Wallet</Trans>,
  },
  {
    link: ROUTES.USER_DCP_MANAGEMENT.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE,
    icon: <SubtractSquare size={20} />,
    label: <Trans>Smart Wallet</Trans>,
  },
  {
    link: ROUTES.USER_VAULT_MANAGEMENT.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE,
    icon: <SubtractSquare size={20} />,
    label: <Trans>Vault Wallet</Trans>,
  },
  {
    link: ROUTES.MY_HISTORY.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].HISTORY,
    icon: <Clock size={20} />,
    label: <Trans>History</Trans>,
  },
  {
    link: ROUTES.USER_ACTIVITY.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].USER_ACTIVITY,
    icon: <Notebook size={20} />,
    label: <Trans>Activities</Trans>,
  },
]
const userCopy = [
  {
    link: ROUTES.MY_MANAGEMENT.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE,
    icon: <SquareHalf size={20} />,
    label: <Trans>API Wallet</Trans>,
  },
  {
    link: ROUTES.USER_DCP_MANAGEMENT.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].MY_PROFILE,
    icon: <SubtractSquare size={20} />,
    label: <Trans>Smart Wallet</Trans>,
  },
  {
    link: ROUTES.MY_HISTORY.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].HISTORY,
    icon: <Clock size={20} />,
    label: <Trans>History</Trans>,
  },
  {
    link: ROUTES.USER_ACTIVITY.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].USER_ACTIVITY,
    icon: <Notebook size={20} />,
    label: <Trans>Activities</Trans>,
  },
]
const userSettings = [
  {
    link: ROUTES.USER_SUBSCRIPTION.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].USER_SUBSCRIPTION,
    icon: <Crown size={20} />,
    label: <Trans>My Subscription</Trans>,
    isWeb3Required: true,
  },
  {
    link: ROUTES.ALERT_LIST.path,
    event: EVENT_ACTIONS[EventCategory.ROUTES].ALERT_LIST,
    icon: <AlertIcon size={20} />,
    label: <Trans>Alert</Trans>,
  },
  // {
  //   link: ROUTES.REFERRAL_MANAGEMENT.path,
  //   event: EVENT_ACTIONS[EventCategory.ROUTES].MY_REFERRAL,
  //   icon: <Users size={20} />,
  //   label: <Trans>Referral</Trans>,
  // },
]
