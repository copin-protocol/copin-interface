import { Trans } from '@lingui/macro'
import { Bookmarks, Pulse, Star } from '@phosphor-icons/react'
import { Route, Switch, useLocation } from 'react-router-dom'

import TopOpenPositions from 'components/TopOpeningPositions'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
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
      name: (
        <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
          <Bookmarks />
          <Box as="span">
            <Trans>Traders</Trans>
          </Box>
        </Flex>
      ),
      key: TabKeyEnum.Explorer,
      route: ROUTES.HOME_EXPLORER.path,
    },
    {
      name: (
        <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
          <Star />
          <Box as="span">
            <Trans>Favorites</Trans>
          </Box>
        </Flex>
      ),
      key: TabKeyEnum.Favorite,
      route: ROUTES.HOME_FAVORITE.path,
    },
    {
      name: (
        <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
          <Pulse />
          <Box as="span">
            <Trans>Positions</Trans>
          </Box>
        </Flex>
      ),
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
          sx={{ borderBottom: 'small', borderColor: 'neutral4', px: 16, width: '100%', mb: 0 }}
          itemSx={{ flex: '1 0 auto', borderBottom: 'none', fontSize: 16, fontWeight: 500 }}
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
