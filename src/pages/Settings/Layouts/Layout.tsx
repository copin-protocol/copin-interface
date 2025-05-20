// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ListBullets, Siren } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import { LayoutComponents } from './types'

enum TabKeyEnum {
  ALERT_LIST = 'alert-list',
  ALERT_LOGS = 'alert-logs',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>ALERT LIST</Trans>,
    activeIcon: <Siren size={24} weight="fill" />,
    icon: <Siren size={24} />,
    key: TabKeyEnum.ALERT_LIST,
    route: ROUTES.ALERT_LIST.path,
  },
  {
    name: <Trans>ALERT LOGS</Trans>,
    activeIcon: <ListBullets size={24} weight="fill" />,
    icon: <ListBullets size={24} />,
    key: TabKeyEnum.ALERT_LOGS,
    route: ROUTES.ALERT_LOGS.path,
  },
]

const pageTitleMapping = {
  [ROUTES.ALERT_LIST.path]: t`Alert List`,
  [ROUTES.ALERT_LOGS.path]: t`Alert Logs`,
}

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
  const { md } = useResponsive()
  return (
    <>
      <CustomPageTitle title={pageTitleMapping[pathname]} />
      <Flex sx={{ width: '100%', height: 'calc(100% - 1px)', flexDirection: 'column' }}>
        {md && (
          <>
            <TabHeader
              configs={tabConfigs}
              isActiveFn={(config) => config.route === pathname}
              fullWidth={false}
              size="lg"
            />
            <Divider />
          </>
        )}

        <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
          <Switch>
            <Route exact path={ROUTES.ALERT_LIST.path}>
              {components.alertList}
            </Route>
            <Route exact path={ROUTES.ALERT_LOGS.path}>
              {components.alertLogs}
            </Route>
          </Switch>
        </Box>

        {!md && (
          <BottomWrapperMobile>
            <TabHeader configs={tabConfigs} isActiveFn={(config) => config.route === pathname} fullWidth={false} />
          </BottomWrapperMobile>
        )}
      </Flex>
    </>
  )
}
