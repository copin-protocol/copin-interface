import { Trans } from '@lingui/macro'
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// import Cart from 'components/Cart'
import Logo, { LogoText } from 'components/@ui/Logo'
import LoginAction from 'components/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import NavbarUser from 'pages/@layouts/Navbar/NavUser'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, LinkUnderline } from 'theme/base'
import { LINKS, NAVBAR_HEIGHT } from 'utils/config/constants'
import routes from 'utils/config/routes'
import ROUTES from 'utils/config/routes'

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
            <Flex
              alignItems="center"
              px={[2, 2, 3, 4]}
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
              <LinkItem text={<Trans>Stats</Trans>} url={ROUTES.STATS.path} />
            </Flex>
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

function LinkItem({ url, text }: { url: string; text: ReactNode }) {
  return (
    <LinkUnderline
      sx={{
        fontSize: 13,
        fontWeight: 'bold',
        '&:hover': {
          color: 'neutral2',
        },
        display: ['none', 'flex', 'flex', 'flex'],
        alignItems: 'center',
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
