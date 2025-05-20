import { Trans } from '@lingui/macro'
import { NavLink as Link, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components/macro'

import BetaTag from 'components/@ui/BetaTag'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useGlobalStore from 'hooks/store/useGlobalStore'
import useMyProfile from 'hooks/store/useMyProfile'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { generateExplorerRoute, generateLeaderboardRoute, generateOIPositionsRoute } from 'utils/helpers/generateRoute'
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
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { convertProtocolToParams, allowedSelectProtocols } = useProtocolPermission()
  const protocolParams = convertProtocolToParams({ protocols: selectedProtocols ?? [] })

  const storedProtocol = useGlobalStore((s) => s.protocol)
  const protocol = allowedSelectProtocols.find((p) => p === storedProtocol) ?? allowedSelectProtocols[0]
  const onClickNavItem = () => {
    onClose?.()
  }

  return (
    <>
      {baseNavConfigs.map((config, index) => {
        return isMobile ? (
          <NavLink
            key={index}
            to={config.routeFactory({ protocol, params: { protocol: protocolParams } })}
            onClick={onClickNavItem}
            matchpath={config.matchpath}
          >
            {config.label}
          </NavLink>
        ) : (
          <NavLink
            key={index}
            to={config.routeFactory({ protocol, params: { protocol: protocolParams } })}
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
    routeFactory: (configs: { params?: any }) => generateExplorerRoute({ params: configs.params }),
    label: <Trans>TRADER EXPLORER</Trans>,
    matchpath: ROUTES.ALL_TRADERS_EXPLORER.path,
  },
  {
    routeFactory: (configs: { params?: any }) => generateOIPositionsRoute({ params: configs.params }),
    label: <Trans>OPEN INTEREST</Trans>,
    matchpath: ROUTES.OPEN_INTEREST_POSITIONS.path,
  },
  {
    routeFactory: (configs: { protocol?: ProtocolEnum }) =>
      generateLeaderboardRoute({ protocol: configs.protocol ?? DEFAULT_PROTOCOL }),
    matchpath: ROUTES.LEADERBOARD.path_prefix,
    label: <Trans>TRADER BOARD</Trans>,
  },
  {
    routeFactory: () => ROUTES.LIVE_TRADES.path,
    matchpath: ROUTES.LIVE_TRADES.path,
    label: <Trans>LIVE TRADES</Trans>,
  },
  {
    routeFactory: () => ROUTES.PERP_DEXS_EXPLORER.path,
    matchpath: ROUTES.PERP_DEXS_EXPLORER.path,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Box as="span">
          <Trans>PERP EXPLORER</Trans>
        </Box>
        <BetaTag />
      </Flex>
    ),
  },
]

export function NavLink(props: NavLinkProps & { matchpath?: string }) {
  return (
    <Link
      {...props}
      className={props.className ? `navlink-default ${props.className}` : 'navlink-default'}
      activeClassName={props.className ? `navlink-active ${props.className}` : 'navlink-active'}
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
    >
      <Box as="span" sx={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>
        {props.children}
      </Box>
    </Link>
  )
}

export const DesktopWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  height: 100%;
  .navlink-default {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    padding: 0 8px;
    color: ${({ theme }) => theme.colors.neutral1};
    border-bottom: 1px solid transparent;
    background-position: bottom;
    transition: 0.3s;
    text-transform: uppercase;
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
  .navlink-active.lite {
    background: linear-gradient(0deg, rgba(2, 255, 232, 0.2) 0.16%, rgba(239, 198, 86, 0) 102.34%);
  }
  .navlink-default:hover {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

export const LiteText = styled(Type.CaptionBold)`
  background: linear-gradient(93.49deg, #ffc24b 22.88%, #02ffe8 73.32%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  transition: 0.3s;
  &:hover {
    filter: brightness(150%);
  }
`

const MobileWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  .navlink-default {
    display: block;
    font-weight: 600;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.neutral1};
  }
  .navlink-active {
    color: ${({ theme }) => theme.colors.primary1};
  }
`
