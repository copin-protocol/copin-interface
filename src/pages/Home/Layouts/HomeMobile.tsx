import { Bookmarks, Pulse, Star } from '@phosphor-icons/react'

import TopOpenPositions from 'components/TopOpeningPositions'
import useTabHandler from 'hooks/router/useTabHandler'
import useMyProfile from 'hooks/store/useMyProfile'
import Tabs from 'theme/Tab'
import { TabPane } from 'theme/Tab'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import Favorites from '../Favorites'
import { FilterTradersProvider } from '../useTradersContext'
import TradersAnalytics from './TradersAnalytics'

enum TabKeyEnum {
  Explorer = 'explorer',
  Favorite = 'favorite',
  TopOpenings = 'top_openings',
}

export default function HomeMobile() {
  const { myProfile } = useMyProfile()
  const { tab, handleTab } = useTabHandler(TabKeyEnum.Explorer)
  return (
    <>
      {/* <GlobalStyle /> */}
      <Flex sx={{ width: '100%', height: `100%`, flexDirection: 'column' }}>
        <Box flex="1" sx={{ overflow: 'hidden', borderBottom: 'small', borderBottomColor: 'neutral4' }}>
          {tab === TabKeyEnum.Explorer && (
            <FilterTradersProvider tab={tab}>
              <TradersAnalytics />
            </FilterTradersProvider>
          )}
          {tab === TabKeyEnum.Favorite && <Favorites tab={tab} />}
          {tab === TabKeyEnum.TopOpenings && (
            <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
              <Flex p={2} sx={{ alignItems: 'center', gap: 2 }}>
                <IconBox color="primary1" icon={<Pulse size={16} />} />
                <Type.Body>Top Opening Positions</Type.Body>
              </Flex>
              <Box sx={{ flex: '1 1 0' }}>
                <TopOpenPositions />
              </Box>
            </Flex>
          )}
        </Box>
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
          tabItemSx={{ flex: '1 0 auto', borderBottom: 'none', fontSize: 16, fontWeight: 500 }}
        >
          <TabPane
            tab={
              <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
                <Bookmarks weight={tab === TabKeyEnum.Explorer ? 'fill' : 'regular'} />
                <Box as="span">Traders</Box>
              </Flex>
            }
            key={TabKeyEnum.Explorer}
          >
            <div></div>
          </TabPane>
          <TabPane
            tab={
              <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
                <Star weight={tab === TabKeyEnum.Favorite ? 'fill' : 'regular'} />
                <Box as="span">Favorites</Box>
              </Flex>
            }
            key={TabKeyEnum.Favorite}
          >
            <div></div>
          </TabPane>
          <TabPane
            tab={
              <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
                <Pulse weight={tab === TabKeyEnum.TopOpenings ? 'fill' : 'regular'} />
                <Box as="span">Positions</Box>
              </Flex>
            }
            key={TabKeyEnum.TopOpenings}
          >
            <div></div>
          </TabPane>
        </Tabs>
      </Flex>
    </>
  )
}
