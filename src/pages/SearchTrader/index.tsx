import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { ProtocolFilter } from 'components/@ui/ProtocolFilter'
import SearchAllResults from 'components/@widgets/SearchAllResults'
import useSearchTraders from 'hooks/features/trader/useSearchTraders'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { useSearchProtocolFilter } from 'hooks/store/useSearchProtocolFilter'
import { Box, Flex, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

const SearchTraderPage = () => {
  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const {
    selectedProtocols,
    checkIsSelected: checkIsProtocolChecked,
    handleToggle: handleToggleProtocol,
    setSelectedProtocols,
  } = useSearchProtocolFilter({ defaultSelects: protocolOptions.map((_p) => _p.id) })
  const {
    keyword,
    searchTraders,
    searchHLTrader,
    isLoadingHLTrader,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    currentProtocol,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
    changeCurrentProtocol,
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
            <Box sx={{ width: '1px', height: '48px', bg: 'neutral4' }} />
            <ProtocolFilter
              selectedProtocols={selectedProtocols}
              setSelectedProtocols={setSelectedProtocols}
              checkIsProtocolChecked={checkIsProtocolChecked}
              handleToggleProtocol={handleToggleProtocol}
              allowList={allowList}
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
