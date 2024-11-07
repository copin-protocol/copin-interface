// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Note, Notebook } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useLayoutEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useInternalRole from 'hooks/features/useInternalRole'
import useSearchParams from 'hooks/router/useSearchParams'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import FilterProtocols from './FilterProtocols'
import DailyOrders from './Orders'
import DailyPositions from './Positions'
import { ProtocolsProvider } from './useProtocolsProvider'

export default function DailyTrades() {
  const isInternal = useInternalRole()
  const { pathname } = useLocation()
  const { setSearchParams } = useSearchParams()
  useLayoutEffect(() => {
    setSearchParams({ protocol: null })
  }, [pathname]) // TODO: temp fix
  const { md } = useResponsive()
  if (!isInternal) return null
  return (
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
            }}
          >
            <MainTab pathname={pathname} />
            <Box flexShrink={0}>
              <FilterProtocols />
            </Box>
          </Flex>
        )}
        <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
          <Switch>
            <Route exact path={ROUTES.DAILY_TRADES_ORDERS.path}>
              <DailyOrders />
            </Route>
            <Route exact path={ROUTES.DAILY_TRADES_POSITIONS.path}>
              <DailyPositions />
            </Route>
            <Redirect to={ROUTES.DAILY_TRADES_ORDERS.path} />
          </Switch>
        </Box>
        {!md && (
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              gap: 3,
              justifyContent: 'space-between',
              borderTop: 'small',
              borderTopColor: 'neutral4',
            }}
          >
            <MainTab pathname={pathname} />
          </Flex>
        )}
      </Flex>
      <CustomPageTitle title={pageTitleMapping[pathname] ?? t`My Profile`} />
    </ProtocolsProvider>
  )
}

enum TabKeyEnum {
  ORDERS = 'orders',
  POSITIONS = 'positions',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>DAILY ORDERS</Trans>,
    activeIcon: <Note size={24} weight="fill" />,
    inactiveIcon: <Note size={24} />,
    key: TabKeyEnum.ORDERS,
    route: ROUTES.DAILY_TRADES_ORDERS.path,
  },
  {
    name: <Trans>DAILY POSITIONS</Trans>,
    inactiveIcon: <Notebook size={24} />,
    activeIcon: <Notebook size={24} weight="fill" />,
    key: TabKeyEnum.POSITIONS,
    route: ROUTES.DAILY_TRADES_POSITIONS.path,
  },
]

const pageTitleMapping = {
  [ROUTES.DAILY_TRADES_ORDERS.path]: t`Daily orders`,
  [ROUTES.DAILY_TRADES_POSITIONS.path]: t`Daily positions`,
}

function MainTab({ pathname }: { pathname: string }) {
  const { md } = useResponsive()

  return (
    <TabHeader
      configs={tabConfigs}
      isActiveFn={(config) => config.route === pathname}
      fullWidth
      sx={{ p: 0, borderBottom: 'none', '& > *': { gap: '0 !important' } }}
      itemSx={{ px: 3, ...(md ? {} : { '& > *': { justifyContent: 'center' } }) }}
    />
  )
}
