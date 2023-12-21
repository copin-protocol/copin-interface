import { useResponsive } from 'ahooks'
import React from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SearchAllResults from 'components/SearchAllResults'
import useSearchTraders from 'hooks/features/useSearchTraders'
import { Box, Flex, Type } from 'theme/base'

import SwitchProtocolsDesktop from './SwitchProtocolsDesktop'
import SwitchProtocolsMobile from './SwitchProtocolsMobile'

const SearchTrader = () => {
  const { lg } = useResponsive()
  const {
    keyword,
    currentProtocol,
    changeCurrentProtocol,
    searchTraders,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
  } = useSearchTraders()

  return (
    <>
      <CustomPageTitle title={`Search results on ${currentProtocol.text}`} />
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
          mb={[0, 0, 0, 3, 3]}
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
          {lg ? (
            <SwitchProtocolsDesktop currentProtocol={currentProtocol} changeCurrentProtocol={changeCurrentProtocol} />
          ) : (
            <SwitchProtocolsMobile currentProtocol={currentProtocol} changeCurrentProtocol={changeCurrentProtocol} />
          )}
          <Box sx={{ flex: '1' }}>
            <SearchAllResults
              keyword={keyword}
              isLoading={isLoading}
              searchTraders={searchTraders}
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

export default SearchTrader
