import { Trans } from '@lingui/macro'
import { ClockCounterClockwise, SubtractSquare, Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import ManagementLayoutDesktop from './ManagementLayoutDesktop'
import ManagementLayoutMobile from './ManagementLayoutMobile'
import { LayoutComponents } from './types'

enum TabKeyEnum {
  MANAGEMENT = 'management',
  HISTORY = 'history',
  REFERRAL = 'referral',
}

const tabConfigs: TabConfig[] = [
  {
    name: (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <SubtractSquare size={24} />
        <Box as="span">
          <Trans>MANAGEMENT</Trans>
        </Box>
      </Flex>
    ),
    key: TabKeyEnum.MANAGEMENT,
    route: ROUTES.MY_MANAGEMENT.path,
  },
  {
    name: (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <ClockCounterClockwise size={24} />
        <Box as="span">
          <Trans>HISTORY</Trans>
        </Box>
      </Flex>
    ),
    key: TabKeyEnum.HISTORY,
    route: ROUTES.MY_HISTORY.path,
  },
  {
    name: (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Users size={24} />
        <Box as="span">
          <Trans>REFERRAL</Trans>
        </Box>
      </Flex>
    ),
    key: TabKeyEnum.REFERRAL,
    route: ROUTES.MY_REFERRAL.path,
  },
]

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
  const { lg } = useResponsive()
  const ManagementLayout = lg ? ManagementLayoutDesktop : ManagementLayoutMobile
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
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

      <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
        <Switch>
          <Route exact path={ROUTES.MY_MANAGEMENT.path}>
            <ManagementLayout {...components} />
          </Route>
          <Route exact path={ROUTES.MY_HISTORY.path}>
            {components.historyTable}
          </Route>
          <Route exact path={ROUTES.MY_REFERRAL.path}>
            {components.referral}
          </Route>
          <Redirect to={ROUTES.MY_MANAGEMENT.path} />
        </Switch>
      </Box>
    </Flex>
  )
}
