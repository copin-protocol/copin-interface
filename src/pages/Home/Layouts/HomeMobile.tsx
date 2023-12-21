import { Trans } from '@lingui/macro'
import { Bookmarks, Pulse, Trophy } from '@phosphor-icons/react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { LeaderboardProvider } from 'hooks/features/useLeaderboardProvider'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Leaderboard from 'pages/Leaderboard'
import TopOpenings from 'pages/TopOpenings'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

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
      name: <Trans>Top Opening</Trans>,
      inactiveIcon: <Pulse size={24} />,
      activeIcon: <Pulse size={24} weight="fill" />,
      key: TabKeyEnum.TopOpenings,
      route: ROUTES.TOP_OPENINGS.path,
    },
  ]
}

export default function HomeMobile() {
  const { pathname } = useLocation()
  const { protocol } = useProtocolStore()
  const tabConfigs = getTabConfigs(protocol)
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
            <Route exact path={ROUTES.TOP_OPENINGS.path}>
              <TopOpenings />
            </Route>
          </Switch>
        </Box>

        <TabHeader configs={tabConfigs} isActiveFn={(config) => config.route === pathname} fullWidth />
      </Flex>
    </>
  )
}
