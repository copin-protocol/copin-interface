import { Trans } from '@lingui/macro'
import { Users } from '@phosphor-icons/react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import { LayoutComponents } from './types'

enum TabKeyEnum {
  REFERRAL = 'referral',
}

const tabConfigs: TabConfig[] = [
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
    route: ROUTES.REFERRAL.path,
  },
]

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
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
          <Route exact path={ROUTES.REFERRAL.path}>
            {components.referral}
          </Route>
          <Redirect to={ROUTES.REFERRAL.path} />
        </Switch>
      </Box>
    </Flex>
  )
}
