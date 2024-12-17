import { Trans } from '@lingui/macro'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { parseNavProtocol, useProtocolStore } from 'hooks/store/useProtocols'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { generateExplorerRoute, generateLeaderboardRoute, generateOIPositionsRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams } from 'utils/helpers/graphql'
import { logEventCompetition } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import EventButton from './EventButton'

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

export function DesktopEventNavLinks({ hasEvents }: { hasEvents?: boolean }) {
  return (
    <DesktopWrapper>
      <EventNavLinks hasEvents={hasEvents} />
    </DesktopWrapper>
  )
}
export function MobileEventNavLinks({ onClose, hasEvents }: { onClose?: () => void; hasEvents?: boolean }) {
  if (!hasEvents) return null
  return (
    <MobileWrapper>
      <EventNavLinks onClose={onClose} hasEvents={hasEvents} />
    </MobileWrapper>
  )
}

function BaseNavLinks({ isMobile, onClose }: { isMobile: boolean; onClose?: () => void }) {
  const { selectedProtocols } = useProtocolFilter()
  const protocolParams = convertProtocolToParams(selectedProtocols)

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
            key={index}
            to={config.routeFactory({ protocol: _navProtocol ?? protocol, params: { protocol: protocolParams } })}
            onClick={onClickNavItem}
            matchpath={config.matchpath}
          >
            {config.label}
          </NavLink>
        ) : (
          <NavLink
            key={index}
            to={config.routeFactory({ protocol: _navProtocol ?? protocol, params: { protocol: protocolParams } })}
            onClick={onClickNavItem}
            matchpath={config.matchpath}
            style={{ display: 'block', height: '100%' }}
          >
            <Flex sx={{ alignItems: 'center', gap: 1 }}>
              <Box>{config.label}</Box>
            </Flex>
          </NavLink>
        )
      })}
    </>
  )
}

function EventNavLinks({ onClose, hasEvents }: { onClose?: () => void; hasEvents?: boolean }) {
  const { myProfile } = useMyProfile()
  const onClickNavItem = () => {
    onClose?.()
  }

  return (
    <>
      {hasEvents && (
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
      )}
    </>
  )
}

const baseNavConfigs = [
  {
    routeFactory: (configs: { protocol: ProtocolEnum; params?: any }) =>
      generateExplorerRoute({ params: configs.params }),
    label: <Trans>Traders Explorer</Trans>,
    matchpath: ROUTES.ALL_TRADERS_EXPLORER.path,
  },
  {
    routeFactory: (configs: { params?: any }) => generateOIPositionsRoute({ params: configs.params }),
    label: <Trans>Open Interest</Trans>,
    matchpath: ROUTES.OPEN_INTEREST_POSITIONS.path,
  },
  {
    routeFactory: (configs: { protocol: ProtocolEnum }) => generateLeaderboardRoute({ protocol: configs.protocol }),
    matchpath: ROUTES.LEADERBOARD.path_prefix,
    label: <Trans>Trader Board</Trans>,
  },
  {
    routeFactory: () => ROUTES.COPIER_RANKING.path,
    matchpath: ROUTES.COPIER_RANKING.path,
    label: <Trans>Copier Ranking</Trans>,
  },
  {
    routeFactory: () => ROUTES.REFERRAL_MANAGEMENT.path,
    matchpath: ROUTES.REFERRAL_MANAGEMENT.path,
    label: <Trans>Referral</Trans>,
  },
  {
    routeFactory: () => ROUTES.LIVE_TRADES.path,
    matchpath: ROUTES.LIVE_TRADES.path,
    label: <Trans>Live Trades</Trans>,
  },
  {
    routeFactory: () => ROUTES.PERP_DEXS_EXPLORER.path,
    matchpath: ROUTES.PERP_DEXS_EXPLORER.path,
    label: <Trans>Perp Explorer (Beta)</Trans>,
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
