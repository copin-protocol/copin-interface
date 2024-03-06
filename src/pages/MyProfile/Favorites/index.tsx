import { Trans } from '@lingui/macro'
import { Star } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useLocation } from 'react-router'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import { HomeSwitchProtocols } from 'components/SwitchProtocols'
import useSearchParams from 'hooks/router/useSearchParams'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import SortTradersDropdown from 'pages/Explorer/Layouts/SortTradersDropdown'
import { TabKeyEnum } from 'pages/Explorer/Layouts/layoutConfigs'
import TimeFilterSection, { TimeFilterDropdown } from 'pages/Explorer/TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from 'pages/Explorer/useTradersContext'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import ListTraderFavorites from './ListTraderFavorites'

const Favorites = () => {
  const { setSearchParams } = useSearchParams()
  const { traderFavorites, notes, isLoading } = useTraderFavorites()
  const { isAuthenticated } = useAuthContext()
  const { pathname } = useLocation()
  const { sm } = useResponsive()
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
        {sm && (
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
        )}
        <Box flex="1 0 0">
          <FilterTradersProvider key={pathname} tab={TabKeyEnum.Favorite} accounts={traderFavorites}>
            <ListTraders notes={notes} />
          </FilterTradersProvider>
        </Box>
        <BottomTabWrapperMobile>
          <BottomTabItemMobile
            icon={<Star size={24} weight="fill" />}
            text={<Trans>Trader Favorites Statistics</Trans>}
          />
        </BottomTabWrapperMobile>
      </Flex>
    </Box>
  )
}

export default Favorites

function ListTraders({ notes }: { notes: { [key: string]: string } }) {
  const contextValues = useTradersContext()
  const { sm } = useResponsive()
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box flex="1 1 0" sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        {sm ? (
          <TimeFilterSection contextValues={contextValues} />
        ) : (
          <Flex sx={{ height: 40, alignItems: 'center', px: 3, justifyContent: 'space-between' }}>
            <TimeFilterDropdown contextValues={contextValues} />
            <Flex sx={{ height: '100%' }}>
              <Flex sx={{ height: '100%', alignItems: 'center', borderLeft: 'small', borderLeftColor: 'neutral4' }}>
                <SortTradersDropdown
                  currentSort={contextValues.currentSort}
                  changeCurrentSort={contextValues.changeCurrentSort}
                />
              </Flex>
              <HomeSwitchProtocols
                showIcon
                sx={{ height: '100%' }}
                buttonSx={{
                  borderLeft: 'small',
                  borderLeftColor: 'neutral4',
                  height: '100%',
                  padding: '0 16px !important',
                }}
              />
            </Flex>
          </Flex>
        )}
      </Box>
      <ListTraderFavorites contextValues={contextValues} notes={notes} />
    </Flex>
  )
}
