// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ClockCounterClockwise, Notebook, SubtractSquare } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Redirect, Route, Switch, useLocation } from 'react-router'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import WarningLimitVolume from 'pages/@layouts/WarningLimitVolume'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import BalanceMenu from './BalanceMenu'
import CheckingWalletRenderer from './CheckingWalletRenderer'
import HistoryPositions from './HistoryPositions'
import ManagementLayoutDesktop from './Layouts/ManagementLayoutDesktop'
import ManagementLayoutMobile from './Layouts/ManagementLayoutMobile'
import MainSection from './MainSection'
import OpeningPosition from './OpeningPositions'
import Stats from './Stats'
import UserActivity from './UserActivity'
import useProfileState from './useProfileState'

export default function MyProfile() {
  const { pathname } = useLocation()
  const { lg } = useResponsive()
  const ManagementLayout = lg ? ManagementLayoutDesktop : ManagementLayoutMobile
  const { loadingCopyWallets, copyWallets, myProfile, activeWallet, setActiveWallet } = useProfileState()

  return (
    <>
      <CustomPageTitle title={pageTitleMapping[pathname] ?? t`My Profile`} />
      <WarningLimitVolume />
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
                  <CheckingWalletRenderer loadingCopyWallets={loadingCopyWallets} copyWallets={copyWallets}>
                    <ManagementLayout
                      balanceMenu={
                        <BalanceMenu
                          copyWallets={copyWallets}
                          activeWallet={activeWallet}
                          onChangeKey={setActiveWallet}
                        />
                      }
                      mainSection={
                        <>
                          {!!myProfile && (
                            <MainSection
                              myProfile={myProfile}
                              exchange={activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX}
                              copyWallet={activeWallet}
                            />
                          )}
                        </>
                      }
                      positionsTable={
                        <>
                          {!!myProfile?.id && <OpeningPosition activeWallet={activeWallet} copyWallets={copyWallets} />}
                        </>
                      }
                      stats={
                        <Stats
                          exchange={activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX}
                          copyWalletId={activeWallet?.id}
                        />
                      }
                    />
                  </CheckingWalletRenderer>
                </Route>
                <Route exact path={ROUTES.MY_HISTORY.path}>
                  <>{!!myProfile?.id && <HistoryPositions />}</>
                </Route>
                <Route exact path={ROUTES.USER_ACTIVITY.path}>
                  <>{!!myProfile?.id && <UserActivity />}</>
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

function MainTab({ pathname }: { pathname: string }) {
  return <TabHeader configs={tabConfigs} isActiveFn={(config) => config.route === pathname} fullWidth />
}
