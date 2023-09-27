import { Trans } from '@lingui/macro'
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import React, { ReactElement, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// import Cart from 'components/Cart'
import Logo, { LogoText } from 'components/@ui/Logo'
import LoginAction from 'components/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, LinkUnderline } from 'theme/base'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import routes from 'utils/config/routes'
import ROUTES from 'utils/config/routes'

import JoinTelegram from './JoinTelegram'
import SearchBox from './SearchBox'
import { LogoWrapper, Main, Wrapper } from './styled'

const Navbar = ({ height }: { height: number }): ReactElement => {
  const { profile } = useAuthContext()
  const [isSearchOpening, setSearchOpening] = useState<boolean>(false)
  // const { md: isMobile } = useResponsive()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === routes.SEARCH.path) return
    setSearchOpening(false)
  }, [location.pathname])

  return (
    <Box as="header" sx={{ zIndex: [101, 101, 101, 4] }}>
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
            <JoinTelegram />
            <Box
              sx={{
                borderLeft: 'small',
                borderRight: 'small',
                borderColor: 'neutral4',
                height: '100%',
                width: 100,
                textAlign: 'center',
                lineHeight: `${NAVBAR_HEIGHT - 1}px`,
              }}
            >
              <LinkUnderline
                sx={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'neutral2',
                  },
                }}
                color="neutral1"
                hoverHasLine
                href={ROUTES.STATS.path}
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Stats</Trans>
              </LinkUnderline>
            </Box>
            <Box flex="0 0 fit-content" sx={{ alignItems: 'center' }}>
              {profile ? <NavbarUser /> : <LoginAction />}
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
