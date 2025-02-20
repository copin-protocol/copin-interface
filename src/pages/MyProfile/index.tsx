// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ClockCounterClockwise, Notebook, SquareHalf, SubtractSquare } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useInternalRole from 'hooks/features/useInternalRole'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'

import CEXManagementPage from './CEXManagement'
import DCPManagementPage from './DCPManagement'
import HistoryPositionsPage from './HistoryPositions'
import UserActivityPage from './UserActivity'
import VaultManagementPage from './VaultManagement'

export default function MyProfilePage() {
  const { pathname } = useLocation()
  const { lg } = useResponsive()
  const myProfile = useMyProfileStore((s) => s.myProfile)
  if (!myProfile) return null

  return (
    <SafeComponentWrapper>
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
                  <CEXManagementPage />
                </Route>
                <Route exact path={ROUTES.USER_DCP_MANAGEMENT.path}>
                  <DCPManagementPage />
                </Route>
                <Route exact path={ROUTES.USER_VAULT_MANAGEMENT.path}>
                  <VaultManagementPage />
                </Route>
                <Route exact path={ROUTES.MY_HISTORY.path}>
                  <HistoryPositionsPage />
                </Route>
                <Route exact path={ROUTES.USER_ACTIVITY.path}>
                  <UserActivityPage />
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
    </SafeComponentWrapper>
  )
}

enum TabKeyEnum {
  MANAGEMENT = 'management',
  DCP_MANAGEMENT = 'dcp-management',
  VAULT_MANAGEMENT = 'vault-management',
  HISTORY = 'history',
  ACTIVITIES = 'activities',
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>API WALLET</Trans>,
    activeIcon: <SquareHalf size={24} weight="fill" />,
    icon: <SquareHalf size={24} />,
    key: TabKeyEnum.MANAGEMENT,
    route: ROUTES.MY_MANAGEMENT.path,
  },
  {
    name: <Trans>SMART WALLET</Trans>,
    activeIcon: <SubtractSquare size={24} weight="fill" />,
    icon: <SubtractSquare size={24} />,
    key: TabKeyEnum.DCP_MANAGEMENT,
    route: ROUTES.USER_DCP_MANAGEMENT.path,
  },
  {
    name: <Trans>HISTORY</Trans>,
    icon: <ClockCounterClockwise size={24} />,
    activeIcon: <ClockCounterClockwise size={24} weight="fill" />,
    key: TabKeyEnum.HISTORY,
    route: ROUTES.MY_HISTORY.path,
  },
  {
    name: <Trans>ACTIVITIES</Trans>,
    icon: <Notebook size={24} />,
    activeIcon: <Notebook size={24} weight="fill" />,
    key: TabKeyEnum.ACTIVITIES,
    route: ROUTES.USER_ACTIVITY.path,
  },
]

const internalTabConfigs: TabConfig[] = [
  {
    name: <Trans>API WALLET</Trans>,
    activeIcon: <SquareHalf size={24} weight="fill" />,
    icon: <SquareHalf size={24} />,
    key: TabKeyEnum.MANAGEMENT,
    route: ROUTES.MY_MANAGEMENT.path,
  },
  {
    name: <Trans>SMART WALLET</Trans>,
    activeIcon: <SubtractSquare size={24} weight="fill" />,
    icon: <SubtractSquare size={24} />,
    key: TabKeyEnum.DCP_MANAGEMENT,
    route: ROUTES.USER_DCP_MANAGEMENT.path,
  },
  {
    name: <Trans>VAULT</Trans>,
    activeIcon: <SubtractSquare size={24} weight="fill" />,
    icon: <SubtractSquare size={24} />,
    key: TabKeyEnum.VAULT_MANAGEMENT,
    route: ROUTES.USER_VAULT_MANAGEMENT.path,
  },
  {
    name: <Trans>HISTORY</Trans>,
    icon: <ClockCounterClockwise size={24} />,
    activeIcon: <ClockCounterClockwise size={24} weight="fill" />,
    key: TabKeyEnum.HISTORY,
    route: ROUTES.MY_HISTORY.path,
  },
  {
    name: <Trans>ACTIVITIES</Trans>,
    icon: <Notebook size={24} />,
    activeIcon: <Notebook size={24} weight="fill" />,
    key: TabKeyEnum.ACTIVITIES,
    route: ROUTES.USER_ACTIVITY.path,
  },
]

const pageTitleMapping = {
  [ROUTES.MY_MANAGEMENT.path]: t`API Wallet Management`,
  [ROUTES.USER_DCP_MANAGEMENT.path]: t`Smart Wallet Management`,
  [ROUTES.USER_VAULT_MANAGEMENT.path]: t`Vault Management`,
  [ROUTES.MY_HISTORY.path]: t`History`,
  [ROUTES.USER_ACTIVITY.path]: t`Activities`,
}

function MainTab({ pathname }: { pathname: string }) {
  const isInternal = useInternalRole()
  const { lg } = useResponsive()
  return (
    <TabHeader
      fullWidth={!lg}
      configs={isInternal ? internalTabConfigs : tabConfigs}
      isActiveFn={(config) => config.route === pathname}
      size="lg"
      sx={{ borderBottom: ['none', 'none', 'small'], borderColor: ['neutral4', 'neutral4', 'neutral4'] }}
      itemSx={{
        width: '100%',
      }}
    />
  )
}
