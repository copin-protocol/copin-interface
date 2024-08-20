import { Trans } from '@lingui/macro'
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import { ReactElement, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import LoginAction from 'components/@auth/LoginAction'
import Logo, { LogoText } from 'components/@ui/Logo'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import routes from 'utils/config/routes'
import { generateHomeRoute } from 'utils/helpers/generateRoute'

import { ProtocolsStatisticProvider } from '../ProtocolsStatisticContext'
import HamburgerMenu from './HamburgetMenu'
import Menu from './Menu'
import MoreDropdown from './MoreDropdown'
import { DesktopEventNavLinks, DesktopNavLinks } from './NavLinks'
import SearchBox from './SearchBox'
import { LARGE_BREAK_POINT } from './configs'
import { LogoWrapper, Main, Wrapper } from './styled'

export default function Navbar({ height }: { height: number }): ReactElement {
  const { isAuthenticated, disconnect } = useAuthContext()
  const [isSearchOpening, setSearchOpening] = useState<boolean>(false)

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === routes.SEARCH.path) return
    setSearchOpening(false)
  }, [location.pathname])

  const [activeMobileMenu, setActiveMobileMenu] = useState(false)
  const protocol = useProtocolStore((state) => state.protocol)

  return (
    <ProtocolsStatisticProvider>
      <Box as="header" sx={{ zIndex: [101, 101, 101, 11] }}>
        <Wrapper height={height}>
          <Menu visible={activeMobileMenu} onClose={() => setActiveMobileMenu(false)} />
          <Main>
            {!isSearchOpening ? (
              <Flex height="100%" alignItems="center" sx={{ gap: 2 }}>
                <Link to={generateHomeRoute({ params: { protocol } })}>
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
                  <MoreDropdown />
                </Box>
                <IconButton
                  variant="ghost"
                  icon={<MagnifyingGlass size={24} />}
                  display={{ _: 'block', md: 'none' }}
                  onClick={() => setSearchOpening(true)}
                />
              </Flex>
            ) : (
              <IconButton
                mr={3}
                variant="ghost"
                icon={<XCircle size={24} />}
                display={{ _: 'block', md: 'none' }}
                onClick={() => setSearchOpening(false)}
              />
            )}
            <Box
              display={{ _: isSearchOpening ? 'block' : 'none', md: 'block' }}
              flex={'1 1 auto'}
              pr={isSearchOpening ? 3 : undefined}
              maxWidth={600}
            >
              <SearchBox width="100%" />
            </Box>

            <Box alignItems="center" display={{ _: isSearchOpening ? 'none' : 'flex', md: 'flex' }} height="100%">
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
                <DesktopEventNavLinks />
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
            </Box>
          </Main>
        </Wrapper>
      </Box>
    </ProtocolsStatisticProvider>
  )
}
