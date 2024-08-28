// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { WarningCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React from 'react'
import { Switch } from 'react-router'
import { Route, useLocation } from 'react-router-dom'

import Divider from 'components/@ui/Divider'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, IconBox, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export interface LayoutComponents {
  copinFeeRebate: JSX.Element
  gnsFeeRebate: JSX.Element
}

enum TabKeyEnum {
  COPIN_FEE_REBATE = 'copin_rebate',
  GNS_FEE_REBATE = 'gns_rebate',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>COPIN FEE REBATE</Trans>,
    key: TabKeyEnum.COPIN_FEE_REBATE,
    route: ROUTES.FEE_REBATE.path,
  },
  {
    name: <Trans>GTRADE REWARDS</Trans>,
    key: TabKeyEnum.GNS_FEE_REBATE,
    route: ROUTES.GNS_FEE_REBATE.path,
  },
]

export default function Layout(components: LayoutComponents) {
  const { pathname } = useLocation()
  const { xl } = useResponsive()
  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        {xl && <MainTab pathname={pathname} />}

        <Box sx={{ overflow: 'auto', flexBasis: 0, flexGrow: 1 }}>
          <Switch>
            <Route exact path={ROUTES.FEE_REBATE.path}>
              {components.copinFeeRebate}
            </Route>
            <Route exact path={ROUTES.GNS_FEE_REBATE.path}>
              {components.gnsFeeRebate}
            </Route>
          </Switch>
        </Box>

        {!xl && (
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
  const { xl } = useResponsive()
  return (
    <TabHeader
      configs={tabConfigs}
      isActiveFn={(config) => config.route === pathname}
      fullWidth
      externalWidget={
        xl && (
          <Flex
            as="a"
            href="https://blog.copin.io/p/join-copins-decentralized-copy-trading?r=2m5jsa&utm_campaign=post&utm_medium=web&triedRedirect=true"
            target="_blank"
            alignItems="center"
            sx={{ gap: 2 }}
          >
            <IconBox icon={<WarningCircle size={24} />} color="primary1" />
            <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>
          </Flex>
        )
      }
    />
  )
}
