import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SearchAllResults from 'components/@widgets/SearchAllResults'
import useSearchTraders from 'hooks/features/useSearchTraders'
import { Box, Flex, Type } from 'theme/base'

const SearchTrader = () => {
  // const { lg } = useResponsive()
  const {
    keyword,
    searchTraders,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    currentProtocol,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
    changeCurrentProtocol,
  } = useSearchTraders()

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
        <Flex
          width="100%"
          p={3}
          sx={{ gap: 2, borderBottom: 'small', borderBottomColor: 'neutral4' }}
          alignItems="center"
          flexWrap="wrap"
        >
          <Type.LargeBold>
            All results for <Type.LargeBold color="primary1">{keyword}</Type.LargeBold>
          </Type.LargeBold>
        </Flex>
        <Flex
          width="100%"
          height="100%"
          flexDirection={['column', 'column', 'column', 'row', 'row']}
          maxWidth={['100%', '100%', '100%', 800, 800]}
        >
          {/*{lg ? (*/}
          {/*  <SwitchProtocolsDesktop currentProtocol={currentProtocol} changeCurrentProtocol={changeCurrentProtocol} />*/}
          {/*) : (*/}
          {/*  <SwitchProtocolsMobile currentProtocol={currentProtocol} changeCurrentProtocol={changeCurrentProtocol} />*/}
          {/*)}*/}
          <Box sx={{ flex: '1' }}>
            <SearchAllResults
              keyword={keyword}
              isLoading={isLoading}
              searchTraders={searchTraders}
              currentPage={currentPage}
              currentLimit={currentLimit}
              currentSort={currentSort}
              currentProtocol={currentProtocol}
              changeCurrentLimit={changeCurrentLimit}
              changeCurrentPage={changeCurrentPage}
              changeCurrentSort={changeCurrentSort}
              changeCurrentProtocol={changeCurrentProtocol}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default SearchTrader
