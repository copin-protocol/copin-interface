import { Trans } from '@lingui/macro'
import { CaretDown } from '@phosphor-icons/react'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import useMyProfile from 'hooks/store/useMyProfile'
import { parseNavProtocol, useProtocolStore } from 'hooks/store/useProtocols'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { generateExplorerRoute, generateLeaderboardRoute, generateOIPositionsRoute } from 'utils/helpers/generateRoute'
import { logEventCompetition } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import EventButton from './EventButton'
import SelectProtocolDropdown from './SelectProtocolDropdown'

export function DesktopNavLinks() {
  return (
    <DesktopWrapper>
      <BaseNavLinks isMobile={false} />
    </DesktopWrapper>
  )
}
export function MobileNavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <MobileWrapper>
      <BaseNavLinks isMobile onClose={onClose} />
    </MobileWrapper>
  )
}

export function DesktopEventNavLinks() {
  return (
    <DesktopWrapper>
      <EventNavLinks />
    </DesktopWrapper>
  )
}
export function MobileEventNavLinks({ onClose }: { onClose?: () => void }) {
  return (
    <MobileWrapper>
      <EventNavLinks onClose={onClose} />
    </MobileWrapper>
  )
}

function BaseNavLinks({ isMobile, onClose }: { isMobile: boolean; onClose?: () => void }) {
  const { protocol, navProtocol, setNavProtocol } = useProtocolStore()
  const _navProtocol = parseNavProtocol(navProtocol)?.protocol
  const onClickNavItem = () => {
    setNavProtocol(undefined)
    onClose?.()
  }

  return (
    <>
      {baseNavConfigs.map((config, index) => {
        return isMobile ? (
          <NavLink
            to={config.routeFactory({ protocol: _navProtocol ?? protocol })}
            onClick={onClickNavItem}
            matchpath={config.matchpath}
          >
            {config.label}
          </NavLink>
        ) : (
          <SelectProtocolDropdown
            key={index}
            routeFactory={(protocol) => config.routeFactory({ protocol: _navProtocol ?? protocol })}
          >
            <NavLink
              to={config.routeFactory({ protocol: _navProtocol ?? protocol })}
              onClick={onClickNavItem}
              matchpath={config.matchpath}
              style={{ display: 'block', height: '100%' }}
            >
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Box>{config.label}</Box>
                <CaretDown size={16} />
              </Flex>
            </NavLink>
          </SelectProtocolDropdown>
        )
      })}
    </>
  )
}

function EventNavLinks({ onClose }: { onClose?: () => void }) {
  const { myProfile } = useMyProfile()
  const onClickNavItem = () => {
    onClose?.()
  }

  return (
    <>
      <NavLink
        onClick={() => {
          onClickNavItem()

          logEventCompetition({
            event: EVENT_ACTIONS[EventCategory.COMPETITION].HOME_CLICK_NAV,
            username: myProfile?.username,
          })
        }}
        to={ROUTES.EVENTS.path}
        matchpath={ROUTES.EVENTS.path}
      >
        <EventButton />
      </NavLink>
      <NavLink to={ROUTES.FEE_REBATE.path} matchpath={ROUTES.FEE_REBATE.path} onClick={onClickNavItem}>
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <ArbitrumLogo size={16} />
          <Type.Caption>
            <Trans>Fee Rebate</Trans>
          </Type.Caption>
        </Flex>
      </NavLink>
    </>
  )
}

const baseNavConfigs = [
  {
    routeFactory: (configs: { protocol: ProtocolEnum }) => generateExplorerRoute({ protocol: configs.protocol }),
    label: <Trans>Traders Explorer</Trans>,
    matchpath: ROUTES.TRADERS_EXPLORER.path_prefix,
  },
  {
    routeFactory: (configs: { protocol: ProtocolEnum }) => generateOIPositionsRoute({ protocol: configs.protocol }),

    matchpath: ROUTES.OPEN_INTEREST.path_prefix,
    label: <Trans>Open Interest</Trans>,
  },
  {
    routeFactory: (configs: { protocol: ProtocolEnum }) => generateLeaderboardRoute({ protocol: configs.protocol }),
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
      <Box as="span" sx={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>
        {props.children}
      </Box>
    </Link>
  )
}

const DesktopWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
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
