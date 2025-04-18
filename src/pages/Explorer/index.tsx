import { Trans } from '@lingui/macro'
import { BookBookmark } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useLocation } from 'react-router-dom'

import { TraderExplorerAlertBanner } from 'components/@systemConfig/SystemAlertBanner'
import PageHeader from 'components/@widgets/PageHeader'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { TopWrapperMobile } from 'pages/@layouts/Components'
import PageTitle from 'theme/PageTitle'
import { Box, Flex } from 'theme/base'

import TradersAnalytics from './Layouts/TradersAnalytics'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import { FilterTradersProvider } from './useTradersContext'

export default function ExplorerPage() {
  const { md } = useResponsive()
  const { pathname } = useLocation()
  return (
    <SafeComponentWrapper>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <TopWrapperMobile>
          <PageTitle title={<Trans>TRADER EXPLORER</Trans>} icon={BookBookmark} />
        </TopWrapperMobile>
        {md && (
          <PageHeader
            showOnMobile
            pageTitle={`Trader Explorer`}
            headerText={<Trans>TRADER EXPLORER</Trans>}
            icon={BookBookmark}
            keepSearchOnSwitchProtocol={false}
            routeSwitchProtocol
            useNewCode={true}
          />
        )}
        {/* <TraderExplorerAlertBanner /> */}
        <FilterTradersProvider key={pathname} tab={TabKeyEnum.Explorer}>
          <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
            <TradersAnalytics />
          </Box>
        </FilterTradersProvider>
      </Flex>
    </SafeComponentWrapper>
  )
}
