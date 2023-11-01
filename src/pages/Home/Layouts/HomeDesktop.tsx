import { Trans } from '@lingui/macro'
import { Bookmarks, Star, Trophy } from '@phosphor-icons/react'
import { Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { LeaderboardProvider } from 'hooks/features/useLeaderboardProvider'
import useMyProfile from 'hooks/store/useMyProfile'
import Leaderboard from 'pages/Leaderboard'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import Favorites from '../Favorites'
import SwitchProtocols from '../SwitchProtocols'
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
    name: <Trans>FAVORITES</Trans>,
    inactiveIcon: <Star size={24} />,
    activeIcon: <Star size={24} weight="fill" />,
    key: TabKeyEnum.Favorite,
    route: ROUTES.HOME_FAVORITE.path,
  },
]

export default function HomeDesktop() {
  const { myProfile } = useMyProfile()
  const { pathname } = useLocation()
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex alignItems="center" justifyContent="space-between">
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.route === pathname}
          fullWidth
          sx={{ borderBottom: 'small', borderColor: 'neutral4', px: 16, width: '100%', mb: 0 }}
          itemSx={{ flex: '0 0 auto', pb: 10, fontSize: 16 }}
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
        <SwitchProtocols />
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
          <Route exact path={ROUTES.HOME_FAVORITE.path}>
            <CustomPageTitle />
            <Favorites tab={TabKeyEnum.Favorite} />
          </Route>
        </Switch>
      </Box>
    </Flex>
  )
}
