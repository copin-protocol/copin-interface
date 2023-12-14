import { Trans } from '@lingui/macro'
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// import Cart from 'components/Cart'
import Logo, { LogoText } from 'components/@ui/Logo'
import LoginAction from 'components/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { Box, Flex, LinkUnderline, Type } from 'theme/base'
import { LINKS, NAVBAR_HEIGHT } from 'utils/config/constants'
import routes from 'utils/config/routes'
import ROUTES from 'utils/config/routes'

import SearchBox from './SearchBox'
import { LogoWrapper, Main, Wrapper } from './styled'

const Navbar = ({ height }: { height: number }): ReactElement => {
  const { isAuthenticated, disconnect } = useAuthContext()
  const [isSearchOpening, setSearchOpening] = useState<boolean>(false)
  // const { md: isMobile } = useResponsive()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === routes.SEARCH.path) return
    setSearchOpening(false)
  }, [location.pathname])

  return (
    <Box as="header" sx={{ zIndex: [101, 101, 101, 11] }}>
      <Wrapper height={height}>
        {/* <Container> */}
        <Main>
          {!isSearchOpening ? (
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Link to={routes.HOME.path}>
                <LogoWrapper>
                  <Logo />
                  <LogoText size={20} />
                </LogoWrapper>
              </Link>
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
            flex={isSearchOpening ? '1 1 auto' : undefined}
            pr={isSearchOpening ? 3 : undefined}
          >
            <SearchBox />
          </Box>

          <Box alignItems="center" display={{ _: isSearchOpening ? 'none' : 'flex', md: 'flex' }}>
            <Flex
              alignItems="center"
              px={[3, 3, 3, 4]}
              sx={{
                textAlign: 'center',
                borderRight: 'small',
                borderColor: 'neutral4',
                gap: [4, 4, 4, 40],
                height: '100%',
                lineHeight: `${NAVBAR_HEIGHT - 1}px`,
              }}
            >
              <LinkItem text={<Trans>Twitter (X)</Trans>} url={LINKS.twitter} />
              <LinkItem text={<Trans>Telegram</Trans>} url={LINKS.telegram} />
              <LinkItem text={<Trans>Stats</Trans>} url={ROUTES.STATS.path} sx={{ display: 'flex' }} />
            </Flex>
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
          </Box>
        </Main>
        {/* </Container> */}
      </Wrapper>
    </Box>
  )
}

Navbar.displayName = 'Header'
export default Navbar

function LinkItem({ url, text, sx }: { url: string; text: ReactNode; sx?: any }) {
  return (
    <LinkUnderline
      sx={{
        fontSize: 13,
        fontWeight: 'bold',
        '&:hover': {
          color: 'neutral2',
        },
        display: ['none', 'none', 'flex', 'flex'],
        alignItems: 'center',
        ...(sx ?? {}),
      }}
      color="neutral1"
      hoverHasLine
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {text}
    </LinkUnderline>
  )
}
