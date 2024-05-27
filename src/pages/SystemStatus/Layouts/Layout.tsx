// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ThermometerSimple, Wallet } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import { LayoutComponents } from './types'

enum TabKeyEnum {
  NODE_STATUS = 'node_status',
  WALLET_WATCHER = 'wallet_watcher',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>NODE STATUS</Trans>,
    activeIcon: <ThermometerSimple size={24} weight="fill" />,
    inactiveIcon: <ThermometerSimple size={24} />,
    key: TabKeyEnum.NODE_STATUS,
    route: ROUTES.NODE_STATUS.path,
  },
  {
    name: <Trans>WALLET WATCHER</Trans>,
    activeIcon: <Wallet size={24} weight="fill" />,
    inactiveIcon: <Wallet size={24} />,
    key: TabKeyEnum.WALLET_WATCHER,
    route: ROUTES.WALLET_WATCHER.path,
  },
]

const pageTitleMapping = {
  [ROUTES.NODE_STATUS.path]: t`Node Status`,
  [ROUTES.WALLET_WATCHER.path]: t`Wallet Watcher`,
}

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
  const { sm } = useResponsive()

  return (
    <>
      <CustomPageTitle title={pageTitleMapping[pathname]} />
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        {sm && <MainTab pathname={pathname} />}

        <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
          <Switch>
            <Route exact path={ROUTES.NODE_STATUS.path}>
              {components.nodeStatus}
            </Route>
            <Route exact path={ROUTES.WALLET_WATCHER.path}>
              {components.walletWatcher}
            </Route>
            <Redirect to={ROUTES.NODE_STATUS.path} />
          </Switch>
        </Box>

        {!sm && (
          <>
            <Divider />
            <MainTab pathname={pathname} />
          </>
        )}
      </Flex>
    </>
  )
}

function MainTab({ pathname }: { pathname: string }) {
  return <TabHeader configs={tabConfigs} isActiveFn={(config) => config.route === pathname} fullWidth />
}
