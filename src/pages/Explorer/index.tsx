import { Trans } from '@lingui/macro'
import { BookBookmark } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { lazy } from 'react'
import { useLocation } from 'react-router-dom'

import PageHeader from 'components/@widgets/PageHeader'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { TopWrapperMobile } from 'pages/@layouts/Components'
import PageTitle from 'theme/PageTitle'
import { Box, Flex } from 'theme/base'

import TradersAnalytics from './Layouts/TradersAnalytics'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import { FilterTradersProvider } from './useTradersContext'

const MultipleBackTestModal = lazy(() => import('components/@backtest/BacktestMultipleModal'))

export default function Explorer() {
  const { protocol } = useProtocolStore()
  const { sm, md } = useResponsive()
  const { pathname } = useLocation()

  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <TopWrapperMobile>
          <PageTitle title={<Trans>TRADER EXPLORER</Trans>} icon={BookBookmark} />
        </TopWrapperMobile>
        <FilterTradersProvider key={pathname} tab={TabKeyEnum.Explorer}>
          {md && (
            <PageHeader
              showOnMobile
              pageTitle={`Trader Explorer on ${protocol}`}
              headerText={<Trans>TRADER EXPLORER</Trans>}
              icon={BookBookmark}
              keepSearchOnSwitchProtocol={false}
              routeSwitchProtocol
              useNewCode={true}
            />
          )}
          <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
            <TradersAnalytics />
          </Box>
        </FilterTradersProvider>
      </Flex>
      {sm && <MultipleBackTestModal />}
    </>
  )
}
