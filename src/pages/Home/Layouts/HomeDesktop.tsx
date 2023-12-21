import { Trans } from '@lingui/macro'
import { Bookmarks, Pulse, Trophy } from '@phosphor-icons/react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { LeaderboardProvider } from 'hooks/features/useLeaderboardProvider'
import useMyProfile from 'hooks/store/useMyProfile'
import Leaderboard from 'pages/Leaderboard'
import TopOpenings from 'pages/TopOpenings'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { HomeSwitchProtocols } from '../SwitchProtocols'
import { FilterTradersProvider } from '../useTradersContext'
import TradersAnalytics from './TradersAnalytics'
import { TabKeyEnum } from './layoutConfigs'

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>TRADER EXPLORER</Trans>,
    inactiveIcon: <Bookmarks size={24} />,
    activeIcon: <Bookmarks size={24} weight="fill" />,
    key: TabKeyEnum.Explorer,
    route: ROUTES.HOME_EXPLORER.path,
  },
  {
    name: <Trans>LEADERBOARD</Trans>,
    inactiveIcon: <Trophy size={24} />,
    activeIcon: <Trophy size={24} weight="fill" />,
    key: TabKeyEnum.Leaderboard,
    route: ROUTES.HOME_LEADERBOARD.path,
  },
  {
    name: <Trans>TOP OPENING</Trans>,
    inactiveIcon: <Pulse size={24} />,
    activeIcon: <Pulse size={24} weight="fill" />,
    key: TabKeyEnum.TopOpenings,
    route: ROUTES.TOP_OPENINGS.path,
  },
]

export default function HomeDesktop() {
  const { myProfile } = useMyProfile()
  const { pathname } = useLocation()
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex justifyContent="space-between">
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
        <HomeSwitchProtocols buttonSx={{ height: '100%' }} />
      </Flex>
      <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
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
          <Route exact path={ROUTES.TOP_OPENINGS.path}>
            <TopOpenings />
          </Route>
        </Switch>
      </Box>
    </Flex>
  )
}
