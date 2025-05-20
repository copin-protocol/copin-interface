import { Trans } from '@lingui/macro'
import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'

import LoginAction from 'components/@auth/LoginAction'
import Logo, { LogoText } from 'components/@ui/Logo'
import { TradingEventStatusEnum } from 'entities/event'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { generateHomeRoute } from 'utils/helpers/generateRoute'

import { ProtocolsStatisticProvider } from '../ProtocolsStatisticContext'
import HamburgerMenu from './HamburgetMenu'
import Menu from './Menu'
import MoreDropdown from './MoreDropdown'
import { DesktopEventNavLinks, DesktopNavLinks, DesktopWrapper, LiteText, NavLink } from './NavLinks'
import QuickSearchBox from './QuickSearchBox'
import { LogoWrapper, Main, displayMobileStyles, hiddenMobileStyles } from './styled'

export default function Navbar({ height }: { height: number }): ReactElement {
  const { isAuthenticated, disconnect, loading } = useAuthContext()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { convertProtocolToParams } = useProtocolPermission()
  const protocolParams = convertProtocolToParams({ protocols: selectedProtocols ?? [] })

  const [activeMobileMenu, setActiveMobileMenu] = useState(false)

  const { events } = useSystemConfigStore()
  const hasEvents = !!events?.filter((event) => event.status !== TradingEventStatusEnum.ENDED)?.length

  return (
    <ProtocolsStatisticProvider>
      <Box
        as="header"
        sx={{
          zIndex: [101, 101, 101, 11],
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          pl: 3,
          bg: 'neutral7',
        }}
      >
        <Box height={height} sx={{ position: 'relative' }}>
          <Menu visible={activeMobileMenu} onClose={() => setActiveMobileMenu(false)} hasEvents={hasEvents} />
          <Main>
            <Flex height="100%" alignItems="center" sx={{ gap: 2 }}>
              <Link to={generateHomeRoute({ params: { protocol: protocolParams } })}>
                <LogoWrapper>
                  <Logo />
                  <LogoText size={16} />
                </LogoWrapper>
              </Link>
              <Box
                alignItems="center"
                px={3}
                sx={{
                  display: 'flex',
                  textAlign: 'center',
                  gap: 24,
                  height: '100%',
                  '& > *': { flexShrink: 0 },
                  [`@media all and (max-width: 1400px)`]: { display: 'none' },
                }}
              >
                <DesktopNavLinks />
                <MoreDropdown />
              </Box>
            </Flex>

            <Flex alignItems="center" height="100%">
              <QuickSearchBox />
              {hasEvents && (
                <Box
                  alignItems="center"
                  px={2}
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    borderRight: 'small',
                    borderColor: 'neutral4',
                    gap: 24,
                    height: '100%',
                    '& > *': { flexShrink: 0 },
                    ...hiddenMobileStyles,
                  }}
                >
                  <DesktopEventNavLinks hasEvents={hasEvents} />
                </Box>
              )}

              <Flex
                flex="0 0 fit-content"
                sx={{
                  alignItems: 'center',
                  borderLeft: 'small',
                  height: '100%',
                  borderLeftColor: 'neutral4',
                  ml: [2, 0],
                }}
              >
                <DesktopWrapper sx={{ borderRight: 'small', borderRightColor: 'neutral4' }}>
                  <NavLink to={ROUTES.LITE.path} matchpath={ROUTES.LITE.path} className="lite">
                    <LiteText>Copin Lite</LiteText>
                  </NavLink>
                </DesktopWrapper>
                {isAuthenticated === true && <NavbarUser />}
                {isAuthenticated === false && <LoginAction />}
                {loading && isAuthenticated === undefined && (
                  <Flex py={12} px={2} alignItems="center" sx={{ gap: 3 }}>
                    <Loading size={16} />
                    <Box>
                      <Type.CaptionBold display="block" lineHeight="13px">
                        <Trans>Logging in...</Trans>
                      </Type.CaptionBold>
                      <Button variant="ghostPrimary" px={0} py={0} my={0}>
                        <Type.Small lineHeight="13px" onClick={() => disconnect()}>
                          <Trans>Cancel</Trans>
                        </Type.Small>
                      </Button>
                    </Box>
                  </Flex>
                )}
              </Flex>
              <Box
                p={3}
                height="100%"
                sx={{
                  display: 'none',
                  borderLeft: 'small',
                  borderLeftColor: 'neutral4',
                  ...displayMobileStyles,
                }}
              >
                <HamburgerMenu active={activeMobileMenu} onClick={() => setActiveMobileMenu((prev) => !prev)} />
              </Box>
            </Flex>
          </Main>
        </Box>
      </Box>
    </ProtocolsStatisticProvider>
  )
}
