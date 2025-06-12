import { useMemo } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { ProtocolFilter } from 'components/@widgets/ProtocolFilter'
import SearchAllResults from 'components/@widgets/SearchAllResults'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useSearchTraders from 'hooks/features/trader/useSearchTraders'
import useSearchParams from 'hooks/router/useSearchParams'
import { useSearchProtocolFilter } from 'hooks/store/useSearchProtocolFilter'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

const SearchTraderPage = () => {
  const { searchParams, setSearchParams } = useSearchParams()
  const protocolFromQuery = searchParams[URL_PARAM_KEYS.PAGE_SEARCH_PROTOCOL] as string | undefined
  const { copyableProtocols, convertParamsToProtocol, convertProtocolToParams } = useProtocolPermission()
  const parsedNewProtocolOptions = useMemo(() => convertParamsToProtocol(protocolFromQuery), [protocolFromQuery])
  const {
    selectedProtocols,
    checkIsSelected: checkIsProtocolChecked,
    handleToggle: handleToggleProtocol,
    setSelectedProtocols,
  } = useSearchProtocolFilter({ defaultSelects: parsedNewProtocolOptions })
  const {
    keyword,
    searchTraders,
    searchHLTrader,
    isLoadingHLTrader,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
  } = useSearchTraders({ protocols: selectedProtocols })

  let traders
  if (
    searchHLTrader &&
    !searchTraders?.data?.find(
      (t) => t.account.toLowerCase() === searchHLTrader.account.toLowerCase() && t.protocol === ProtocolEnum.HYPERLIQUID
    )
  ) {
    if (searchTraders) {
      traders = {
        data: [searchHLTrader, ...searchTraders.data],
        meta: {
          ...searchTraders.meta,
          total: searchTraders.meta.total + 1,
        },
      }
    } else {
      traders = {
        data: [searchHLTrader],
        meta: {
          limit: currentLimit,
          offset: 0,
          total: 1,
          totalPages: 1,
        },
      }
    }
  } else {
    traders = searchTraders
  }

  return (
    <>
      <CustomPageTitle title={`Search results for ${keyword}`} />
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Flex width="100%" height="100%" flexDirection="column" maxWidth={['100%', '100%', '100%', 1000, 1000]}>
          <Flex
            width="100%"
            height="56px"
            px={3}
            sx={{ gap: 2, border: 'small', borderColor: 'neutral4', borderTop: 'none' }}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Type.BodyBold flex={1}>
              All results for <Type.BodyBold color="primary1">{keyword}</Type.BodyBold>
            </Type.BodyBold>
            <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />
            {/* TODO: fix search protocol */}
            <ProtocolFilter
              selectedProtocols={selectedProtocols}
              setSelectedProtocols={(protocols) => {
                setSearchParams({
                  [URL_PARAM_KEYS.PAGE_SEARCH_PROTOCOL]: convertProtocolToParams({ protocols, ignorePermission: true }),
                })
                setSelectedProtocols(protocols)
              }}
              checkIsProtocolChecked={checkIsProtocolChecked}
              handleToggleProtocol={handleToggleProtocol}
              allowList={copyableProtocols}
              shouldCheckPermission={false}
            />
          </Flex>
          <Box sx={{ flex: '1' }}>
            <SearchAllResults
              keyword={keyword}
              isLoading={isLoading || isLoadingHLTrader}
              searchTraders={traders}
              currentPage={currentPage}
              currentLimit={currentLimit}
              currentSort={currentSort}
              changeCurrentLimit={changeCurrentLimit}
              changeCurrentPage={changeCurrentPage}
              changeCurrentSort={changeCurrentSort}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default SearchTraderPage
