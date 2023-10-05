import NoFavoriteFound from 'components/@ui/NoDataFound/NoFavoriteFound'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'

import { TabKeyEnum } from './Layouts/layoutConfigs'
import ListTradersSection from './ListTradersSection'
import TimeFilterSection from './TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from './useTradersContext'

const Favorites = ({ tab }: { tab: TabKeyEnum }) => {
  const { traderFavorites, notes, isLoading } = useTraderFavorites()
  const { isAuthenticated } = useAuthContext()
  if (!isAuthenticated) return <NoLoginFavorite />
  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {traderFavorites.length ? (
        <FilterTradersProvider tab={tab} accounts={traderFavorites}>
          <ListTraders notes={notes} />
        </FilterTradersProvider>
      ) : (
        <NoFavoriteFound />
      )}
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
      <ListTradersSection contextValues={contextValues} notes={notes} />
    </Flex>
  )
}
