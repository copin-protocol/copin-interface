import { Suspense, lazy, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ReactGA from 'react-ga4'
import { Route, Switch } from 'react-router-dom'

import NotFound from 'components/@ui/NotFound'
import useModifyApolloClient from 'hooks/helpers/useModifyApolloClient'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import AuthedRoute from './@helpers/CustomRoutes'
import ErrorFallback from './@helpers/ErrorFallback'
import QSReader from './@helpers/QSReader'
import ScrollToTop from './@helpers/ScrollToTop'
import AppWrapper from './AppWrapper'

const FavoritesPage = lazy(() => import('./MyProfile/Favorites'))
const VaultDetailsPage = lazy(() => import('./VaultDetails'))
const PerpDEXsExplorerPage = lazy(() => import('./PerpDEXsExplorer'))
const HomePage = lazy(() => import('./Home'))
const ExplorerPage = lazy(() => import('./Explorer'))
const OpenInterestPage = lazy(() => import('./OpenInterest'))
const LeaderboardPage = lazy(() => import('./Leaderboard'))
const EventDetailsPage = lazy(() => import('./Event/EventDetails'))
const EventsPage = lazy(() => import('./Event'))
const FeeRebatePage = lazy(() => import('./FeeRebate'))
const TraderDetailsPage = lazy(() => import('./TraderDetails'))
const PositionDetailsPage = lazy(() => import('./PositionDetails'))
const SharedPositionDetailsPage = lazy(() => import('./SharedPositionDetails'))
const MyProfilePage = lazy(() => import('./MyProfile'))
const WalletManagementPage = lazy(() => import('./WalletManagement'))
const StatsPage = lazy(() => import('./Stats'))
const SharedBacktestSinglePage = lazy(() => import('./SharedBacktestSingle'))
const SharedBacktestMultiplePage = lazy(() => import('./SharedBacktestMultiple'))
const AlertDashboardPage = lazy(() => import('./Settings/AlertDashboard'))
const UserSubscriptionPage = lazy(() => import('./Settings/UserSubscription'))
const SubscriptionPage = lazy(() => import('./Subscription'))
const LinkBotTelegramPage = lazy(() => import('./LinkBotTelegram'))
const AlertSettingDetailsPage = lazy(() => import('./Settings/AlertSettingDetails'))
const ComparingTradersPage = lazy(() => import('./ComparingTraders'))
const SearchPage = lazy(() => import('./SearchTrader'))
const SearchTxHashPage = lazy(() => import('./SearchTxHash'))
const SystemStatusPage = lazy(() => import('./SystemStatus'))
const StatsCEXPage = lazy(() => import('./StatsCEX'))
const CopierRankingPage = lazy(() => import('./Leaderboard/CopierLeaderboard'))
const RedirectToCopierRankingPage = lazy(() => import('./Leaderboard/CopierLeaderboard/RedirectToCopierRanking'))
const OldExplorerPage = lazy(() => import('./Explorer/OldExplorer'))
const OldTopOpeningInterestPage = lazy(() => import('./OpenInterest/OldTopOpeningInterest'))
const ReferralManagementPage = lazy(() => import('./ReferralManagement'))
const DailyTradesPage = lazy(() => import('./DailyTrades'))
const PerpDEXDetailsPage = lazy(() => import('./PerpDEXsExplorer/PerpDexDetails'))
const CopinLitePage = lazy(() => import('./CopinLite'))

function App() {
  useEffect(() => {
    ReactGA.initialize('G-SJ25F1YFSM', { gtagUrl: 'https://www.googletagmanager.com/gtag/js?id=G-SJ25F1YFSM' })
  }, [])
  useModifyApolloClient()

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
            <Route exact path={ROUTES.VAULT_DETAILS.path} component={VaultDetailsPage}></Route>
            <Route exact path={ROUTES.EVENTS.path} component={EventsPage}></Route>
            <Route exact path={ROUTES.EVENT_DETAILS.path} component={EventDetailsPage}></Route>
            <Route exact path={ROUTES.FEE_REBATE.path} component={FeeRebatePage}></Route>
            <Route exact path={ROUTES.GNS_FEE_REBATE.path} component={FeeRebatePage}></Route>
            <Route exact path={ROUTES.TRADER_DETAILS.path} component={TraderDetailsPage}></Route>

            <Route exact path={ROUTES.COMPARING_TRADERS.path} component={ComparingTradersPage} />
            <Route exact path={ROUTES.SUBSCRIPTION.path} component={SubscriptionPage} />
            <Route exact path={ROUTES.SHARED_POSITION_DETAILS.path} component={SharedPositionDetailsPage}></Route>
            <Route exact path={ROUTES.POSITION_DETAILS.path} component={PositionDetailsPage}></Route>
            <Route exact path={ROUTES.SHARED_BACKTEST_SINGLE.path} component={SharedBacktestSinglePage}></Route>
            <Route exact path={ROUTES.SHARED_BACKTEST_MULTIPLE.path} component={SharedBacktestMultiplePage}></Route>
            <Route exact path={ROUTES.STATS.path} component={StatsPage}></Route>
            <Route exact path={ROUTES.STATS_CEX.path} component={StatsCEXPage}></Route>
            <AuthedRoute path={ROUTES.SYSTEM_STATUS.path} component={SystemStatusPage}></AuthedRoute>

            <AuthedRoute path={ROUTES.MY_PROFILE.path} component={MyProfilePage}></AuthedRoute>
            <AuthedRoute path={ROUTES.ALERT_LIST.path} component={AlertDashboardPage}></AuthedRoute>
            <AuthedRoute path={ROUTES.USER_SUBSCRIPTION.path} component={UserSubscriptionPage}></AuthedRoute>
            <AuthedRoute path={ROUTES.WALLET_MANAGEMENT.path} component={WalletManagementPage}></AuthedRoute>
            <Route path={ROUTES.LINK_BOT_ALERT.path} component={LinkBotTelegramPage}></Route>
            <AuthedRoute path={ROUTES.ALERT_SETTING_DETAILS.path} component={AlertSettingDetailsPage}></AuthedRoute>
            <AuthedRoute path={ROUTES.FAVORITES.path} component={FavoritesPage}></AuthedRoute>
            <Route exact path={ROUTES.SEARCH.path} component={SearchPage}></Route>
            <Route exact path={ROUTES.SEARCH_TX_HASH.path} component={SearchTxHashPage}></Route>
            <Route path={ROUTES.LEADERBOARD.path} component={LeaderboardPage}></Route>
            <Route path={ROUTES.COPIER_LEADERBOARD.path} component={RedirectToCopierRankingPage}></Route>
            <Route path={ROUTES.COPIER_RANKING.path} component={CopierRankingPage}></Route>
            <Route path={ROUTES.REFERRAL_MANAGEMENT.path} component={ReferralManagementPage}></Route>
            <Route path={ROUTES.LIVE_TRADES.path} component={DailyTradesPage}></Route>
            <Route exact path={ROUTES.PERP_DEX_DETAILS.path} component={PerpDEXDetailsPage}></Route>
            <Route exact path={ROUTES.PERP_DEXS_EXPLORER.path} component={PerpDEXsExplorerPage}></Route>

            {/* OLD ROUTE */}
            <Route exact path={ROUTES.TRADERS_EXPLORER.path} component={OldExplorerPage}></Route>
            {/* NEW ROUTE */}
            <Route exact path={ROUTES.ALL_TRADERS_EXPLORER.path} component={ExplorerPage}></Route>

            {/* NEW ROUTE */}
            <Route path={ROUTES.ROOT_OPEN_INTEREST_POSITIONS.path} component={OpenInterestPage}></Route>
            {/* OLD ROUTE */}
            <Route exact path={ROUTES.OPEN_INTEREST.path} component={OldTopOpeningInterestPage}></Route>

            {/* <Route exact path={ROUTES.TRADER_EXCHANGES_STATS.path} component={TraderExchangesStats}></Route> */}
            <Route exact path={ROUTES.TRADER_DETAILS_MULTI_EXCHANGE.path} component={TraderDetailsPage}></Route>
            <Route exact path={ROUTES.TRADER_DETAILS_MULTI_EXCHANGE.alter_ath} component={TraderDetailsPage}></Route>

            <AuthedRoute path={ROUTES.LITE.path} exact component={CopinLitePage}></AuthedRoute>
            <Route path={ROUTES.HOME.path} exact component={HomePage}></Route>

            <Route path="*" component={NotFound}></Route>
          </Switch>
        </Suspense>
      </AppWrapper>
    </ErrorBoundary>
  )
}

export default App
