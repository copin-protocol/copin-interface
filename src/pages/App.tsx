import { Suspense, lazy, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ReactGA from 'react-ga4'
import { Route, Switch } from 'react-router-dom'

import NotFound from 'components/@ui/NotFound'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import AuthedRoute from './@helpers/CustomRoutes'
import ErrorFallback from './@helpers/ErrorFallback'
import QSReader from './@helpers/QSReader'
import ScrollToTop from './@helpers/ScrollToTop'
import AppWrapper from './AppWrapper'
import Favorites from './MyProfile/Favorites'

const Home = lazy(() => import('./Home'))
const Explorer = lazy(() => import('./Explorer'))
const OpenInterest = lazy(() => import('./TopOpenings'))
const Leaderboard = lazy(() => import('./Leaderboard'))
const EventDetails = lazy(() => import('./Event/EventDetailsPage'))
const Events = lazy(() => import('./Event'))
const FeeRebate = lazy(() => import('./FeeRebate/FeeRebatePage'))
const TraderDetails = lazy(() => import('./TraderDetails'))
const PositionDetails = lazy(() => import('./PositionDetails'))
const SharedPositionDetails = lazy(() => import('./SharedPositionDetails'))
const MyProfile = lazy(() => import('./MyProfile'))
const WalletManagement = lazy(() => import('./WalletManagement'))
const Stats = lazy(() => import('./Stats'))
const SharedBacktestSingle = lazy(() => import('./SharedBacktestSingle'))
const SharedBacktestMultiple = lazy(() => import('./SharedBacktestMultiple'))
const Settings = lazy(() => import('./Settings'))
const Subscription = lazy(() => import('./Subscription'))
const LinkBotTelegram = lazy(() => import('./LinkBotTelegram'))
const ComparingTraders = lazy(() => import('./ComparingTraders'))
const Search = lazy(() => import('./SearchTrader'))
const SearchTxHash = lazy(() => import('./SearchTxHash'))
const SystemStatus = lazy(() => import('./SystemStatus'))
const StatsCEX = lazy(() => import('./StatsCEX'))
const CopierLeaderboard = lazy(() => import('./Leaderboard/CopierLeaderboard'))

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
            <Route exact path={ROUTES.EVENTS.path} component={Events}></Route>
            <Route exact path={ROUTES.EVENT_DETAILS.path} component={EventDetails}></Route>
            <Route exact path={ROUTES.EVENT_DETAILS.path} component={EventDetails}></Route>
            <Route exact path={ROUTES.FEE_REBATE.path} component={FeeRebate}></Route>
            <Route exact path={ROUTES.GNS_FEE_REBATE.path} component={FeeRebate}></Route>
            <Route exact path={ROUTES.TRADER_DETAILS.path} component={TraderDetails}></Route>

            <Route exact path={ROUTES.COMPARING_TRADERS.path} component={ComparingTraders} />
            <Route exact path={ROUTES.SUBSCRIPTION.path} component={Subscription} />
            <Route exact path={ROUTES.SHARED_POSITION_DETAILS.path} component={SharedPositionDetails}></Route>
            <Route exact path={ROUTES.POSITION_DETAILS.path} component={PositionDetails}></Route>
            <Route exact path={ROUTES.SHARED_BACKTEST_SINGLE.path} component={SharedBacktestSingle}></Route>
            <Route exact path={ROUTES.SHARED_BACKTEST_MULTIPLE.path} component={SharedBacktestMultiple}></Route>
            <Route exact path={ROUTES.STATS.path} component={Stats}></Route>
            <Route exact path={ROUTES.STATS_CEX.path} component={StatsCEX}></Route>
            <AuthedRoute path={ROUTES.SYSTEM_STATUS.path} component={SystemStatus}></AuthedRoute>

            <AuthedRoute path={ROUTES.MY_PROFILE.path} component={MyProfile}></AuthedRoute>
            <AuthedRoute path={ROUTES.SETTINGS.path} component={Settings}></AuthedRoute>
            <AuthedRoute path={ROUTES.WALLET_MANAGEMENT.path} component={WalletManagement}></AuthedRoute>
            <Route path={ROUTES.LINK_BOT_ALERT.path} component={LinkBotTelegram}></Route>
            <AuthedRoute path={ROUTES.FAVORITES.path} component={Favorites}></AuthedRoute>
            <Route exact path={ROUTES.SEARCH.path} component={Search}></Route>
            <Route exact path={ROUTES.SEARCH_TX_HASH.path} component={SearchTxHash}></Route>
            <Route path={ROUTES.LEADERBOARD.path} component={Leaderboard}></Route>
            <Route path={ROUTES.COPIER_LEADERBOARD.path} component={CopierLeaderboard}></Route>
            <Route path={ROUTES.TRADERS_EXPLORER.path} component={Explorer}></Route>
            <Route path={ROUTES.OPEN_INTEREST.path} component={OpenInterest}></Route>

            {/* <Route exact path={ROUTES.TRADER_EXCHANGES_STATS.path} component={TraderExchangesStats}></Route> */}
            <Route exact path={ROUTES.TRADER_DETAILS_MULTI_EXCHANGE.path} component={TraderDetails}></Route>
            <Route exact path={ROUTES.TRADER_DETAILS_MULTI_EXCHANGE.alter_ath} component={TraderDetails}></Route>

            <Route path={ROUTES.HOME.path} exact component={Home}></Route>

            <Route path="*" component={NotFound}></Route>
          </Switch>
        </Suspense>
      </AppWrapper>
    </ErrorBoundary>
  )
}

export default App
