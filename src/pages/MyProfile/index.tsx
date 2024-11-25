// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ClockCounterClockwise, Notebook, SquareHalf, SubtractSquare } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import CEXManagement from './CEXManagement'
import DCPManagement from './DCPManagement'
import HistoryPositions from './HistoryPositions'
import UserActivity from './UserActivity'

export default function MyProfile() {
  const { pathname } = useLocation()
  const { lg } = useResponsive()
  const myProfile = useMyProfileStore((s) => s.myProfile)
  if (!myProfile) return null

  return (
    <>
      <CustomPageTitle title={pageTitleMapping[pathname] ?? t`My Profile`} />
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box flex="1 0 0 " sx={{ overflow: 'hidden' }}>
          <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
            {lg && <MainTab pathname={pathname} />}

            <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
              <Switch>
                <Route exact path={ROUTES.MY_MANAGEMENT.path}>
                  <CEXManagement />
                </Route>
                <Route exact path={ROUTES.USER_DCP_MANAGEMENT.path}>
                  <DCPManagement />
                </Route>
                <Route exact path={ROUTES.MY_HISTORY.path}>
                  <HistoryPositions />
                </Route>
                <Route exact path={ROUTES.USER_ACTIVITY.path}>
                  <UserActivity />
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
        </Box>
      </Flex>
    </>
  )
}

enum TabKeyEnum {
  MANAGEMENT = 'management',
  DCP_MANAGEMENT = 'dcp-management',
  HISTORY = 'history',
  ACTIVITIES = 'activities',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>API WALLET</Trans>,
    activeIcon: <SquareHalf size={24} weight="fill" />,
    inactiveIcon: <SquareHalf size={24} />,
    key: TabKeyEnum.MANAGEMENT,
    route: ROUTES.MY_MANAGEMENT.path,
  },
  {
    name: <Trans>SMART WALLET</Trans>,
    activeIcon: <SubtractSquare size={24} weight="fill" />,
    inactiveIcon: <SubtractSquare size={24} />,
    key: TabKeyEnum.DCP_MANAGEMENT,
    route: ROUTES.USER_DCP_MANAGEMENT.path,
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
  [ROUTES.MY_MANAGEMENT.path]: t`API Wallet Management`,
  [ROUTES.USER_DCP_MANAGEMENT.path]: t`Smart Wallet Management`,
  [ROUTES.MY_HISTORY.path]: t`History`,
  [ROUTES.USER_ACTIVITY.path]: t`Activities`,
}

function MainTab({ pathname }: { pathname: string }) {
  return <TabHeader configs={tabConfigs} isActiveFn={(config) => config.route === pathname} fullWidth />
}
