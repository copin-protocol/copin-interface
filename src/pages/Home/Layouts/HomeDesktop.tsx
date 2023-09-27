import { Bookmarks, Star } from '@phosphor-icons/react'

import useTabHandler from 'hooks/router/useTabHandler'
import useMyProfile from 'hooks/store/useMyProfile'
import Tabs, { TabPane } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import Favorites from '../Favorites'
import SwitchProtocols from '../SwitchProtocols'
import { FilterTradersProvider } from '../useTradersContext'
import TradersAnalytics from './TradersAnalytics'

export enum TabKeyEnum {
  Explorer = 'explorer',
  Favorite = 'favorite',
}

export default function HomeDesktop() {
  const { myProfile } = useMyProfile()
  const { tab, handleTab } = useTabHandler(TabKeyEnum.Explorer)
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex alignItems="center" justifyContent="space-between">
        <Tabs
          defaultActiveKey={tab}
          onChange={(tab) => {
            handleTab(tab)
            if (tab === TabKeyEnum.Favorite) {
              logEvent({
                category: EventCategory.FAVORITES,
                action: EVENT_ACTIONS[EventCategory.FAVORITES].OPEN_FAVORITES,
                label: getUserForTracking(myProfile?.username),
              })
            }
          }}
          fullWidth
          headerSx={{ borderBottom: 'small', borderColor: 'neutral4', px: 16, width: '100%', mb: 0 }}
          tabItemSx={{ flex: '0 0 auto', pb: 10, fontSize: 16 }}
        >
          <TabPane
            tab={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Bookmarks weight={tab === TabKeyEnum.Explorer ? 'fill' : 'regular'} />
                <Box as="span">TRADER EXPLORER</Box>
              </Flex>
            }
            key={TabKeyEnum.Explorer}
          >
            <div></div>
          </TabPane>
          <TabPane
            tab={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Star weight={tab === TabKeyEnum.Favorite ? 'fill' : 'regular'} />
                <Box as="span">FAVORITES</Box>
              </Flex>
            }
            key={TabKeyEnum.Favorite}
          >
            <div></div>
          </TabPane>
        </Tabs>
        <SwitchProtocols />
      </Flex>
      <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
        {tab === TabKeyEnum.Explorer && (
          <FilterTradersProvider tab={tab}>
            <TradersAnalytics />
          </FilterTradersProvider>
        )}
        {tab === TabKeyEnum.Favorite && <Favorites tab={tab} />}
      </Box>
    </Flex>
  )
}
