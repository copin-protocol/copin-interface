import { Trans } from '@lingui/macro'
import { Bookmarks, Pulse, Star, Trophy } from '@phosphor-icons/react'
import { Route, Switch, useLocation } from 'react-router-dom'

import TopOpenPositions from 'components/TopOpeningPositions'
import { LeaderboardProvider } from 'hooks/features/useLeaderboardProvider'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Leaderboard from 'pages/Leaderboard'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS } from 'utils/config/protocols'
import ROUTES from 'utils/config/routes'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import Favorites from '../Favorites'
import { FilterTradersProvider } from '../useTradersContext'
import TradersAnalytics from './TradersAnalytics'
import { TabKeyEnum } from './layoutConfigs'

function getTabConfigs(protocol: ProtocolEnum): TabConfig[] {
  return [
    {
      name: <Trans>Trader Explorer</Trans>,
      inactiveIcon: <Bookmarks size={24} />,
      activeIcon: <Bookmarks size={24} weight="fill" />,
      key: TabKeyEnum.Explorer,
      route: ROUTES.HOME_EXPLORER.path,
    },
    {
      name: <Trans>Leaderboard</Trans>,
      inactiveIcon: <Trophy size={24} />,
      activeIcon: <Trophy size={24} weight="fill" />,
      key: TabKeyEnum.Leaderboard,
      route: ROUTES.HOME_LEADERBOARD.path,
    },
    {
      name: <Trans>Favorites</Trans>,
      inactiveIcon: <Star size={24} />,
      activeIcon: <Star size={24} weight="fill" />,
      key: TabKeyEnum.Favorite,
      route: ROUTES.HOME_FAVORITE.path,
    },
    {
      name: <Trans>Positions</Trans>,
      inactiveIcon: <Pulse size={24} />,
      activeIcon: <Pulse size={24} weight="fill" />,
      key: TabKeyEnum.TopOpenings,
      route: `/${protocol}/${ROUTES.HOME_TOP_OPENINGS.path_suffix}`,
    },
  ]
}

export default function HomeMobile() {
  const { myProfile } = useMyProfile()
  const { pathname } = useLocation()
  const { protocol } = useProtocolStore()
  const tabConfigs = getTabConfigs(protocol)
  const protocolOption = PROTOCOL_OPTIONS.find((option) => option.id === protocol)
  return (
    <>
      <Flex sx={{ width: '100%', height: `100%`, flexDirection: 'column' }}>
        <Box flex="1" sx={{ overflow: 'hidden', borderBottom: 'small', borderBottomColor: 'neutral4' }}>
          <Switch>
            <Route exact path={ROUTES.HOME_EXPLORER.path}>
              <FilterTradersProvider tab={TabKeyEnum.Explorer}>
                <TradersAnalytics />
              </FilterTradersProvider>
            </Route>
            <Route exact path={ROUTES.HOME_LEADERBOARD.path}>
              <LeaderboardProvider>
                <Leaderboard />
              </LeaderboardProvider>
            </Route>
            <Route exact path={ROUTES.HOME_FAVORITE.path}>
              <Favorites tab={TabKeyEnum.Favorite} />
            </Route>
            <Route exact path={ROUTES.HOME_TOP_OPENINGS.path}>
              <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
                <Flex p={2} sx={{ alignItems: 'center', gap: 2 }}>
                  <IconBox color="primary1" icon={<Pulse size={16} />} />
                  <Type.Body>
                    {protocolOption ? (
                      <Trans>Top Opening Positions on {protocolOption.text}</Trans>
                    ) : (
                      <Trans>Top Opening Positions</Trans>
                    )}
                  </Type.Body>
                </Flex>
                <Box sx={{ flex: '1 1 0' }}>
                  <TopOpenPositions />
                </Box>
              </Flex>
            </Route>
          </Switch>
        </Box>

        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.route === pathname}
          fullWidth
          onClickItem={(key) => {
            if (key === TabKeyEnum.Favorite) {
              logEvent({
                category: EventCategory.FAVORITES,
                action: EVENT_ACTIONS[EventCategory.FAVORITES].OPEN_FAVORITES,
                label: getUserForTracking(myProfile?.username),
              })
            }
          }}
        />
      </Flex>
    </>
  )
}
