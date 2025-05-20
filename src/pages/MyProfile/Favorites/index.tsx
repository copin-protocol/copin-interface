import { Trans } from '@lingui/macro'
import { Star } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoLoginFavorite from 'components/@ui/NoLogin/NoLoginFavorite'
import { GlobalProtocolFilter, GlobalProtocolFilterProps } from 'components/@widgets/ProtocolFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useTraderFavorites, { parseTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import { useAuthContext } from 'hooks/web3/useAuth'
import { TopWrapperMobile } from 'pages/@layouts/Components'
import SortTradersDropdown from 'pages/Explorer/Layouts/SortTradersDropdown'
import { TabKeyEnum } from 'pages/Explorer/Layouts/layoutConfigs'
import TimeFilterSection, { TimeFilterDropdown } from 'pages/Explorer/TimeFilterSection'
import useTradersContext, { FilterTradersProvider } from 'pages/Explorer/useTradersContext'
import Loading from 'theme/Loading'
import PageTitle from 'theme/PageTitle'
import { Box, Flex } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import { SubscriptionFeatureEnum } from 'utils/config/enums'

import ListTraderFavorites from './ListTraderFavorites'

const FavoritesPage = () => {
  const { pathname } = useSearchParams()
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { traderFavorites, notes, isLoading } = useTraderFavorites()
  const { isAuthenticated } = useAuthContext()
  const { md } = useResponsive()

  const protocolFilterProps: GlobalProtocolFilterProps = useMemo(
    () => ({
      placement: md ? 'bottom' : 'bottomRight',
      menuSx: { width: ['300px', '400px', '50vw', '50vw'] },
    }),
    [md]
  )

  if (selectedProtocols == null) return null

  if (!isAuthenticated) return <NoLoginFavorite />
  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <CustomPageTitle title="Trader Favorites" />
      <TopWrapperMobile>
        <PageTitle title={<Trans>TRADER FAVORITES STATISTICS</Trans>} icon={Star} />
      </TopWrapperMobile>
      <Flex flex="1 0 0" flexDirection="column" height="100%">
        {md && (
          <Flex
            height={PAGE_TITLE_HEIGHT}
            pl={3}
            sx={{
              alignItems: 'center',
              columnGap: 3,
              rowGap: 2,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            <PageTitle title={<Trans>TRADER FAVORITES STATISTICS</Trans>} icon={Star} />
            <GlobalProtocolFilter {...protocolFilterProps} />
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
            <ListTraders notes={notes} />
          </FilterTradersProvider>
        </Box>
      </Flex>
    </Flex>
  )
}

export default FavoritesPage

function ListTraders({ notes }: { notes: { [key: string]: string } }) {
  const contextValues = useTradersContext()
  const { md } = useResponsive()
  const protocolFilterProps: GlobalProtocolFilterProps = useMemo(
    () => ({
      placement: md ? 'bottom' : 'bottomRight',
      menuSx: { width: ['300px', '400px', '50vw', '50vw'] },
    }),
    [md]
  )
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <Box flex="1 1 0" sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        {md ? (
          <TimeFilterSection contextValues={contextValues} learnMoreSection={SubscriptionFeatureEnum.TRADER_FAVORITE} />
        ) : (
          <Flex sx={{ height: 40, alignItems: 'center', pl: 3, pr: [3, 3, 0], justifyContent: 'space-between' }}>
            <TimeFilterDropdown contextValues={contextValues} />
            <Flex sx={{ height: '100%' }}>
              <Flex sx={{ height: '100%', alignItems: 'center', borderLeft: 'small', borderLeftColor: 'neutral4' }}>
                <SortTradersDropdown
                  currentSort={contextValues.currentSort}
                  changeCurrentSort={contextValues.changeCurrentSort}
                />
                <GlobalProtocolFilter {...protocolFilterProps} />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
      <ListTraderFavorites contextValues={contextValues} notes={notes} />
    </Flex>
  )
}
