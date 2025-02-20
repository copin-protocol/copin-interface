// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Note, Notebook } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useLayoutEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useSearchParams from 'hooks/router/useSearchParams'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'

import FilterProtocols from './FilterProtocols'
import DailyOrdersPage from './Orders'
import DailyPositionsPage from './Positions'
import { ProtocolsProvider } from './useProtocolsProvider'

export default function DailyTradesPage() {
  const { pathname } = useLocation()
  const { setSearchParams } = useSearchParams()
  useLayoutEffect(() => {
    setSearchParams({ protocol: null })
  }, [pathname]) // TODO: temp fix
  const { md } = useResponsive()
  return (
    <SafeComponentWrapper>
      <ProtocolsProvider>
        <Flex
          sx={{
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {md && (
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                gap: 3,
                justifyContent: 'space-between',
                borderBottom: 'small',
                borderBottomColor: 'neutral4',
                height: PAGE_TITLE_HEIGHT,
              }}
            >
              <TabHeader
                configs={tabConfigs}
                isActiveFn={(config) => config.route === pathname}
                fullWidth={false}
                size="lg"
                // fullWidth
                // sx={{ justifyContent: 'center', width: '100%' }}
              />
              <Box flexShrink={0}>
                <FilterProtocols />
              </Box>
            </Flex>
          )}
          <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
            <Switch>
              <Route exact path={ROUTES.LIVE_TRADES_ORDERS.path}>
                <DailyOrdersPage />
              </Route>
              <Route exact path={ROUTES.LIVE_TRADES_POSITIONS.path}>
                <DailyPositionsPage />
              </Route>
              <Redirect to={ROUTES.LIVE_TRADES_ORDERS.path} />
            </Switch>
          </Box>
          {!md && (
            <BottomWrapperMobile>
              <TabHeader
                configs={tabConfigs}
                isActiveFn={(config) => config.route === pathname}
                fullWidth={false}
                // fullWidth
              />
            </BottomWrapperMobile>
          )}
        </Flex>
        <CustomPageTitle title={pageTitleMapping[pathname] ?? t`My Profile`} />
      </ProtocolsProvider>
    </SafeComponentWrapper>
  )
}

enum TabKeyEnum {
  ORDERS = 'orders',
  POSITIONS = 'positions',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>LIVE ORDERS</Trans>,
    activeIcon: <Note size={24} weight="fill" />,
    icon: <Note size={24} />,
    key: TabKeyEnum.ORDERS,
    route: ROUTES.LIVE_TRADES_ORDERS.path,
  },
  {
    name: <Trans>LIVE POSITIONS</Trans>,
    icon: <Notebook size={24} />,
    activeIcon: <Notebook size={24} weight="fill" />,
    key: TabKeyEnum.POSITIONS,
    route: ROUTES.LIVE_TRADES_POSITIONS.path,
  },
]

const pageTitleMapping = {
  [ROUTES.LIVE_TRADES_ORDERS.path]: t`Live orders`,
  [ROUTES.LIVE_TRADES_POSITIONS.path]: t`Live positions`,
}
