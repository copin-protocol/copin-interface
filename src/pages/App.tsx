import { Suspense, lazy, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ReactGA from 'react-ga4'
import { Route, Switch } from 'react-router-dom'

import NotFound from 'components/@ui/NotFound'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import AuthedRoute, { ProtocolRedirectRoute, ProtocolRoute } from './@helpers/CustomRoutes'
import ErrorFallback from './@helpers/ErrorFallback'
import QSReader from './@helpers/QSReader'
import ScrollToTop from './@helpers/ScrollToTop'
import AppWrapper from './AppWrapper'

const Home = lazy(() => import('./Home'))
const TraderDetails = lazy(() => import('./TraderDetails'))
const PositionDetails = lazy(() => import('./PositionDetails'))
const SharedPositionDetails = lazy(() => import('./SharedPositionDetails'))
const MyProfile = lazy(() => import('./MyProfile'))
const WalletManagement = lazy(() => import('./WalletManagement'))
const Stats = lazy(() => import('./Stats'))
const TopOpenings = lazy(() => import('./TopOpenings'))
const SharedBacktestSingle = lazy(() => import('./SharedBacktestSingle'))
const SharedBacktestMultiple = lazy(() => import('./SharedBacktestMultiple'))
const Settings = lazy(() => import('./Settings'))

function App() {
  useEffect(() => {
    ReactGA.initialize('G-SJ25F1YFSM', { gtagUrl: 'https://www.googletagmanager.com/gtag/js?id=G-SJ25F1YFSM' })
  }, [])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppWrapper>
        <Suspense
          fallback={
            <Box p={4}>
              <Loading />
            </Box>
          }
        >
          <ScrollToTop />
          <QSReader />
          <Switch>
            <ProtocolRoute exact path={ROUTES.TRADER_DETAILS.path} component={TraderDetails}></ProtocolRoute>
            <ProtocolRedirectRoute exact path={`${ROUTES.TRADER_DETAILS.path_prefix}/:address`} />

            <ProtocolRoute
              exact
              path={ROUTES.SHARED_POSITION_DETAILS.path}
              component={SharedPositionDetails}
            ></ProtocolRoute>

            <ProtocolRoute exact path={ROUTES.POSITION_DETAILS.path} component={PositionDetails}></ProtocolRoute>
            <ProtocolRedirectRoute exact path={ROUTES.POSITION_DETAILS.path_prefix} />

            <ProtocolRoute exact path={ROUTES.TOP_OPENINGS.path} component={TopOpenings}></ProtocolRoute>
            <ProtocolRedirectRoute exact path={ROUTES.TOP_OPENINGS.path_prefix} />

            <Route exact path={ROUTES.STATS.path} component={Stats}></Route>
            <ProtocolRoute
              exact
              path={ROUTES.SHARED_BACKTEST_SINGLE.path}
              component={SharedBacktestSingle}
            ></ProtocolRoute>
            <ProtocolRoute
              exact
              path={ROUTES.SHARED_BACKTEST_MULTIPLE.path}
              component={SharedBacktestMultiple}
            ></ProtocolRoute>

            <AuthedRoute path={ROUTES.MY_PROFILE.path} component={MyProfile}></AuthedRoute>
            <AuthedRoute path={ROUTES.SETTINGS.path} component={Settings}></AuthedRoute>
            <AuthedRoute path={ROUTES.WALLET_MANAGEMENT.path} component={WalletManagement}></AuthedRoute>
            <Route path={ROUTES.HOME.path} component={Home}></Route>

            <Route path="*" component={NotFound}></Route>
          </Switch>
        </Suspense>
      </AppWrapper>
    </ErrorBoundary>
  )
}

export default App
