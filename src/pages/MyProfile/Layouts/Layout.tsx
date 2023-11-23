// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ClockCounterClockwise, Notebook, SubtractSquare } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import ManagementLayoutDesktop from './ManagementLayoutDesktop'
import ManagementLayoutMobile from './ManagementLayoutMobile'
import { LayoutComponents } from './types'

enum TabKeyEnum {
  MANAGEMENT = 'management',
  HISTORY = 'history',
  ACTIVITIES = 'activities',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>MANAGEMENT</Trans>,
    activeIcon: <SubtractSquare size={24} weight="fill" />,
    inactiveIcon: <SubtractSquare size={24} />,
    key: TabKeyEnum.MANAGEMENT,
    route: ROUTES.MY_MANAGEMENT.path,
  },
  {
    name: <Trans>HISTORY</Trans>,
    inactiveIcon: <ClockCounterClockwise size={24} />,
    activeIcon: <ClockCounterClockwise size={24} weight="fill" />,
    key: TabKeyEnum.HISTORY,
    route: ROUTES.MY_HISTORY.path,
  },
  {
    name: <Trans>ACTIVITIES</Trans>,
    inactiveIcon: <Notebook size={24} />,
    activeIcon: <Notebook size={24} weight="fill" />,
    key: TabKeyEnum.ACTIVITIES,
    route: ROUTES.USER_ACTIVITY.path,
  },
]

const pageTitleMapping = {
  [ROUTES.MY_MANAGEMENT.path]: t`Copy Management`,
  [ROUTES.MY_HISTORY.path]: t`History`,
  [ROUTES.USER_ACTIVITY.path]: t`Activities`,
}

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
  const { lg } = useResponsive()
  const ManagementLayout = lg ? ManagementLayoutDesktop : ManagementLayoutMobile
  return (
    <>
      <CustomPageTitle title={pageTitleMapping[pathname]} />
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        {lg && <MainTab pathname={pathname} />}

        <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
          <Switch>
            <Route exact path={ROUTES.MY_MANAGEMENT.path}>
              <ManagementLayout {...components} />
            </Route>
            <Route exact path={ROUTES.MY_HISTORY.path}>
              {components.historyTable}
            </Route>
            <Route exact path={ROUTES.USER_ACTIVITY.path}>
              {components.activities}
            </Route>
            <Redirect to={ROUTES.MY_MANAGEMENT.path} />
          </Switch>
        </Box>

        {!lg && (
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
  return (
    <TabHeader
      configs={tabConfigs}
      isActiveFn={(config) => config.route === pathname}
      fullWidth
      sx={{ borderBottom: 'small', borderColor: 'neutral4', px: 16, width: '100%', mb: 0 }}
      itemSx={{
        flex: [1, 1, '0 0 auto'],
        pb: 10,
        fontSize: 16,
        display: 'flex',
        justifyContent: 'center',
      }}
    />
  )
}
