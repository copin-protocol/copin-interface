import { Trans } from '@lingui/macro'
import { useLocation } from 'react-router'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoFavoriteFound from 'components/@ui/NoDataFound/NoFavoriteFound'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import useSearchParams from 'hooks/router/useSearchParams'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { TabKeyEnum } from 'pages/Home/Layouts/layoutConfigs'
import { HomeSwitchProtocols } from 'pages/Home/SwitchProtocols'
import TimeFilterSection from 'pages/Home/TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from 'pages/Home/useTradersContext'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import ListTraderFavorites from './ListTraderFavorites'

const Favorites = ({ tab }: { tab: TabKeyEnum }) => {
  const { setSearchParams } = useSearchParams()
  const { traderFavorites, notes, isLoading } = useTraderFavorites()
  const { isAuthenticated } = useAuthContext()
  const { pathname } = useLocation()
  if (!isAuthenticated) return <NoLoginFavorite />
  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <CustomPageTitle title="Trader Favorites" />
      <Flex flexDirection="column" height="100%">
        <Flex p={3} sx={{ alignItems: 'center', columnGap: 3, rowGap: 2, flexWrap: 'wrap' }}>
          <Type.H5>
            <Trans>Trader Favorites Statistics</Trans>
          </Type.H5>
          <HomeSwitchProtocols
            buttonSx={{ border: 'none', p: 0 }}
            onSwitch={(protocol: ProtocolEnum) => {
              setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocol })
            }}
          />
        </Flex>
        <Box flex="1">
          {traderFavorites.length ? (
            <FilterTradersProvider key={pathname} tab={tab} accounts={traderFavorites}>
              <ListTraders notes={notes} />
            </FilterTradersProvider>
          ) : (
            <NoFavoriteFound />
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default Favorites

function ListTraders({ notes }: { notes: { [key: string]: string } }) {
  const contextValues = useTradersContext()
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box flex="1 1 0" sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        <TimeFilterSection contextValues={contextValues} />
      </Box>
      <ListTraderFavorites contextValues={contextValues} notes={notes} />
    </Flex>
  )
}
