import { Trans } from '@lingui/macro'
import { Star } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import { ProtocolFilter, ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import useTraderFavorites, { parseTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import SortTradersDropdown from 'pages/Explorer/Layouts/SortTradersDropdown'
import { TabKeyEnum } from 'pages/Explorer/Layouts/layoutConfigs'
import TimeFilterSection, { TimeFilterDropdown } from 'pages/Explorer/TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from 'pages/Explorer/useTradersContext'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { generateFavoriteTradersRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams, getProtocolFromUrl } from 'utils/helpers/graphql'

import ListTraderFavorites from './ListTraderFavorites'

const Favorites = () => {
  const { searchParams, pathname } = useSearchParams()
  const { traderFavorites, notes, isLoading } = useTraderFavorites()
  const { isAuthenticated } = useAuthContext()
  const { sm } = useResponsive()
  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols } = useProtocolFilter({
    defaultSelects: protocolOptions.map((_p) => _p.id),
  })
  const foundProtocolInUrl = getProtocolFromUrl(searchParams, pathname)
  const protocolParams = convertProtocolToParams(foundProtocolInUrl)

  useEffect(() => {
    if (foundProtocolInUrl) {
      setSelectedProtocols(foundProtocolInUrl)
    }
  }, [])

  if (!isAuthenticated) return <NoLoginFavorite />
  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Redirect to={generateFavoriteTradersRoute({ params: { ...searchParams, protocol: protocolParams } })} />
      <CustomPageTitle title="Trader Favorites" />
      <Flex flexDirection="column" height="100%">
        {sm && (
          <Flex p={3} sx={{ alignItems: 'center', columnGap: 3, rowGap: 2, flexWrap: 'wrap' }}>
            <Type.H5>
              <Trans>Trader Favorites Statistics</Trans>
            </Type.H5>
            <ProtocolFilter
              selectedProtocols={selectedProtocols}
              handleToggleProtocol={handleToggle}
              checkIsProtocolChecked={checkIsSelected}
              allowList={allowList}
              setSelectedProtocols={setSelectedProtocols}
              placement={sm ? 'bottom' : 'bottomRight'}
              menuSx={{ width: ['300px', '400px', '50vw', '50vw'] }}
            />
          </Flex>
        )}
        <Box flex="1 0 0">
          <FilterTradersProvider
            key={pathname}
            tab={TabKeyEnum.Favorite}
            accounts={traderFavorites
              .filter((value) => selectedProtocols.includes(parseTraderFavoriteValue(value).protocol))
              .map((value) => parseTraderFavoriteValue(value).address)}
          >
            <ListTraders
              notes={notes}
              protocolFilters={{
                selectedProtocols,
                handleToggleProtocol: handleToggle,
                checkIsProtocolChecked: checkIsSelected,
                setSelectedProtocols,
                allowList,
              }}
            />
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

function ListTraders({
  notes,
  protocolFilters,
}: {
  notes: { [key: string]: string }
  protocolFilters: ProtocolFilterProps
}) {
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
                <ProtocolFilter
                  {...protocolFilters}
                  placement={sm ? 'bottom' : 'bottomRight'}
                  menuSx={{ width: ['300px', '400px', '50vw', '50vw'] }}
                />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
      <ListTraderFavorites contextValues={contextValues} notes={notes} />
    </Flex>
  )
}
