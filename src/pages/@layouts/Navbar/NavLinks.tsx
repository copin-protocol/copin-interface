import { Trans } from '@lingui/macro'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useProtocolStore } from 'hooks/store/useProtocols'
import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { generateExplorerRoute, generateLeaderboardRoute, generateOIRoute } from 'utils/helpers/generateRoute'

export function DesktopNavLinks() {
  return (
    <DesktopWrapper>
      <NavLinks />
    </DesktopWrapper>
  )
}
export function MobileNavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <MobileWrapper>
      <NavLinks onClose={onClose} />
    </MobileWrapper>
  )
}

function NavLinks({ onClose }: { onClose?: () => void }) {
  const { protocol } = useProtocolStore()

  return (
    <>
      {configs.map((config, index) => {
        return (
          <NavLink
            key={index}
            to={config.routeFactory ? config.routeFactory({ protocol }) : { pathname: config.route }}
            onClick={onClose}
            matchpath={config.matchpath}
          >
            {config.label}
          </NavLink>
        )
      })}
    </>
  )
}

const configs = [
  {
    route: ROUTES.HOME.path,
    label: <Trans>Home</Trans>,
  },
  {
    routeFactory: (configs: Record<string, any>) => {
      if (configs.protocol) return generateExplorerRoute({ protocol: configs.protocol })
      return ''
    },
    label: <Trans>Traders Explorer</Trans>,
    matchpath: ROUTES.TRADERS_EXPLORER.path_prefix,
  },
  {
    routeFactory: (configs: Record<string, any>) => {
      if (configs.protocol) return generateOIRoute({ protocol: configs.protocol })
      return ''
    },
    matchpath: ROUTES.OPEN_INTEREST.path_prefix,
    label: <Trans>Open Interest</Trans>,
  },
  {
    routeFactory: (configs: Record<string, any>) => {
      if (configs.protocol) return generateLeaderboardRoute({ protocol: configs.protocol })
      return ''
    },
    matchpath: ROUTES.LEADERBOARD.path_prefix,
    label: <Trans>Leaderboard</Trans>,
  },
]

function NavLink(props: NavLinkProps & { matchpath?: string }) {
  return (
    <Link
      className="navlink-default"
      activeClassName="navlink-active"
      isActive={(match, location) => {
        if (!match) {
          return false
        }

        if (
          (!!props.matchpath && !!location.pathname.match(props?.matchpath)) ||
          location.pathname === (props.to as Location).pathname
        )
          return true
        return false
      }}
      {...props}
    >
      <Box as="span">{props.children}</Box>
    </Link>
  )
}

const DesktopWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  height: 100%;
  .navlink-default {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 13px;
    padding: 0 8px;
    color: ${({ theme }) => theme.colors.neutral1};
    border-bottom: 1px solid transparent;
    background-position: bottom;
    transition: 0.3s;
  }
  .navlink-active {
    color: ${({ theme }) => theme.colors.primary1};
    background: linear-gradient(0deg, #303963 0.16%, rgba(11, 13, 23, 0) 102.34%);
    background-size: 100% 16px;
    background-position: bottom;
    background-repeat: no-repeat;
    background-position: bottom;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary1};
  }
  .navlink-default:hover {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const MobileWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  .navlink-default {
    display: block;
    font-weight: 600;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.neutral1};
  }
  .navlink-active {
    color: ${({ theme }) => theme.colors.primary1};
  }
`
