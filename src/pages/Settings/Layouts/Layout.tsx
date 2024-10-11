// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Crown } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import AlertIcon from 'theme/Icons/AlertIcon'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import { LayoutComponents } from './types'

enum TabKeyEnum {
  REFERRAL = 'referral',
  USER_SUBSCRIPTION = 'subscription',
  BOT_ALERT = 'bot_alert',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>MY SUBSCRIPTION</Trans>,
    activeIcon: <Crown size={24} weight="fill" />,
    inactiveIcon: <Crown size={24} />,
    key: TabKeyEnum.USER_SUBSCRIPTION,
    route: ROUTES.USER_SUBSCRIPTION.path,
  },
  {
    name: <Trans>ALERT LIST</Trans>,
    activeIcon: <AlertIcon size={24} variant="Bold" />,
    inactiveIcon: <AlertIcon size={24} />,
    key: TabKeyEnum.BOT_ALERT,
    route: ROUTES.ALERT_LIST.path,
  },
]

const pageTitleMapping = {
  [ROUTES.USER_SUBSCRIPTION.path]: t`My Subscription`,
  [ROUTES.ALERT_LIST.path]: t`Alert List`,
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
            <Route exact path={ROUTES.ALERT_LIST.path}>
              {components.botAlert}
            </Route>
            <Route exact path={ROUTES.USER_SUBSCRIPTION.path}>
              {components.userSubscription}
            </Route>
            <Redirect to={ROUTES.USER_SUBSCRIPTION.path} />
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
