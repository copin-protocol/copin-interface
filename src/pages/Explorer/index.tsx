import { Trans } from '@lingui/macro'
import { BookBookmark, Bookmarks } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { lazy } from 'react'
import { useLocation } from 'react-router-dom'

import PageHeader from 'components/@widgets/PageHeader'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import { Box, Flex } from 'theme/base'

import TradersAnalytics from './Layouts/TradersAnalytics'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import { FilterTradersProvider } from './useTradersContext'

const MultipleBackTestModal = lazy(() => import('components/@backtest/BacktestMultipleModal'))

export default function Explorer() {
  const { protocol } = useProtocolStore()
  const { sm } = useResponsive()
  const { pathname } = useLocation()
  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <FilterTradersProvider key={pathname} tab={TabKeyEnum.Explorer}>
          <PageHeader
            pageTitle={`Traders Explorer on ${protocol}`}
            headerText={<Trans>TRADER EXPLORER</Trans>}
            icon={BookBookmark}
            keepSearchOnSwitchProtocol={false}
            routeSwitchProtocol
            useNewCode={true}
          />
          <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
            <TradersAnalytics />
          </Box>
          <BottomTabWrapperMobile>
            <BottomTabItemMobile icon={<Bookmarks size={24} weight="fill" />} text={<Trans>Traders explorer</Trans>} />
          </BottomTabWrapperMobile>
        </FilterTradersProvider>
      </Flex>
      {sm && <MultipleBackTestModal />}
    </>
  )
}
