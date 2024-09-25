import { Trans } from '@lingui/macro'
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import { ReactElement, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import LoginAction from 'components/@auth/LoginAction'
import Logo, { LogoText } from 'components/@ui/Logo'
import { TradingEventStatusEnum } from 'entities/event'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import routes from 'utils/config/routes'
import { generateHomeRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams } from 'utils/helpers/graphql'

import { ProtocolsStatisticProvider } from '../ProtocolsStatisticContext'
import HamburgerMenu from './HamburgetMenu'
import Menu from './Menu'
import MoreDropdown from './MoreDropdown'
import { DesktopCopierLeaderboardLink, DesktopEventNavLinks, DesktopNavLinks } from './NavLinks'
import QuickSearchBox from './QuickSearchBox'
import { LARGE_BREAK_POINT } from './configs'
import { LogoWrapper, Main, Wrapper } from './styled'

export default function Navbar({ height }: { height: number }): ReactElement {
  const { isAuthenticated, disconnect } = useAuthContext()
  const { selectedProtocols } = useProtocolFilter()
  const protocolParams = convertProtocolToParams(selectedProtocols)

  const [activeMobileMenu, setActiveMobileMenu] = useState(false)

  const { events } = useSystemConfigContext()
  const hasEvents = !!events?.filter((event) => event.status !== TradingEventStatusEnum.ENDED)?.length

  return (
    <ProtocolsStatisticProvider>
      <Box as="header" sx={{ zIndex: [101, 101, 101, 11] }}>
        <Wrapper height={height}>
          <Menu visible={activeMobileMenu} onClose={() => setActiveMobileMenu(false)} hasEvents={hasEvents} />
          <Main>
            <Flex height="100%" alignItems="center" sx={{ gap: 2 }}>
              <Link to={generateHomeRoute({ params: { protocol: protocolParams } })}>
                <LogoWrapper>
                  <Logo />
                  <LogoText size={20} />
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
                  [`@media all and (max-width: ${LARGE_BREAK_POINT}px)`]: { display: 'none' },
                }}
              >
                <DesktopNavLinks />
                <DesktopCopierLeaderboardLink />
                <MoreDropdown />
              </Box>
            </Flex>

            <Flex alignItems="center" height="100%">
              <QuickSearchBox />

              <Box
                alignItems="center"
                px={3}
                sx={{
                  display: 'flex',
                  textAlign: 'center',
                  borderRight: 'small',
                  borderColor: 'neutral4',
                  gap: 24,
                  height: '100%',
                  '& > *': { flexShrink: 0 },
                  [`@media all and (max-width: ${LARGE_BREAK_POINT}px)`]: { display: 'none' },
                }}
              >
                <DesktopEventNavLinks hasEvents={hasEvents} />
              </Box>

              <Box flex="0 0 fit-content" sx={{ alignItems: 'center' }}>
                {isAuthenticated === true && <NavbarUser />}
                {isAuthenticated === false && <LoginAction />}
                {isAuthenticated == null && (
                  <Flex py={12} px={16} alignItems="center" sx={{ gap: 3 }}>
                    <Loading size={16} />
                    <Box>
                      <Type.CaptionBold display="block" lineHeight="13px">
                        <Trans>Connecting Wallet...</Trans>
                      </Type.CaptionBold>
                      <Button variant="ghost" px={0} py={0} my={0}>
                        <Type.Caption lineHeight="13px" onClick={() => disconnect()}>
                          <Trans>Cancel</Trans>
                        </Type.Caption>
                      </Button>
                    </Box>
                  </Flex>
                )}
              </Box>
              <Box
                p={3}
                height="100%"
                sx={{
                  display: 'none',
                  borderLeft: 'small',
                  borderLeftColor: 'neutral4',
                  [`@media all and (max-width: ${LARGE_BREAK_POINT}px)`]: { display: 'block' },
                }}
              >
                <HamburgerMenu active={activeMobileMenu} onClick={() => setActiveMobileMenu((prev) => !prev)} />
              </Box>
            </Flex>
          </Main>
        </Wrapper>
      </Box>
    </ProtocolsStatisticProvider>
  )
}
