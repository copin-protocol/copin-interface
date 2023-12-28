// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import SearchPositionResultItem from 'components/@ui/SearchPositionResult'
import { TraderData } from 'entities/trader'
import useSearchAllData from 'hooks/features/useSearchAllData'
import { Button } from 'theme/Buttons'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { SEARCH_DEFAULT_LIMIT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'
import { parseProtocolImage } from 'utils/helpers/transform'

import { SearchResult, SearchWrapper } from './styled'

const SearchBox = ({
  bg,
  width,
  actionTitle = 'View',
  placeholder = 'Search for wallets or transactions',
  onSelect,
  returnRanking = false,
  allowAllProtocol = true,
  allowSearchPositions = true,
}: {
  actionTitle?: string
  placeholder?: string
  bg?: string
  width?: string | number
  onSelect?: (data: TraderData) => void
  returnRanking?: boolean
  allowAllProtocol?: boolean
  allowSearchPositions?: boolean
}) => {
  const {
    searchWrapperRef,
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    handleSearchEnter,
    handleClickViewAll,
    visibleSearchResult,
    isLoading,
    searchTraders,
    searchPositions,
    handleClick,
    handleClickPosition,
    handleSearchPositionsEnter,
    isTxHash,
  } = useSearchAllData({ onSelect, returnRanking, allowAllProtocol, allowSearchPositions })

  const totalResultTraders = searchTraders?.meta?.total ?? 0
  const totalResultPositions = searchPositions?.length ?? 0

  return (
    <SearchWrapper ref={searchWrapperRef} width={width ?? ['100%', '100%', 220, 380]}>
      <InputSearch
        ref={inputSearchRef}
        placeholder={placeholder}
        sx={{
          padding: 2,
          width: '100%',
          height: 'max-content',
          borderColor: 'neutral5',
          borderRadius: 'xs',
          bg: bg ?? undefined,
        }}
        value={searchText}
        onFocus={handleSearchFocus}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        onKeyDown={(e) => e.key === 'Enter' && (isTxHash ? handleSearchPositionsEnter() : handleSearchEnter())}
      />

      {visibleSearchResult && (
        <SearchResult>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <Loading />
            </Box>
          ) : (
            <Box>
              {allowAllProtocol && (
                <Flex px={3} py="6px" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                  <Type.CaptionBold color="neutral3">
                    {isTxHash ? <Trans>Position</Trans> : <Trans>Trader</Trans>} <Trans>Results</Trans>
                  </Type.CaptionBold>
                  <Button variant="ghostPrimary" type="button" onClick={handleClickViewAll} sx={{ p: 0, mx: 0 }}>
                    <Type.Caption sx={{ ':hover': { textDecoration: 'underline' } }}>
                      <Trans>View All</Trans> ({formatNumber(isTxHash ? totalResultPositions : totalResultTraders)})
                    </Type.Caption>
                  </Button>
                </Flex>
              )}
              {!isTxHash && (searchTraders?.meta?.total ?? 0) > 0 && (
                <Box>
                  {searchTraders?.data.map((userData) => (
                    <SearchResultItems
                      key={userData.id}
                      keyword={searchText}
                      actionTitle={actionTitle}
                      data={userData}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              )}
              {isTxHash && (searchPositions?.length ?? 0) > 0 && (
                <Box>
                  {searchPositions?.slice(0, SEARCH_DEFAULT_LIMIT)?.map((positionData) => (
                    <SearchPositionResultItem
                      key={positionData.id}
                      data={positionData}
                      handleClick={handleClickPosition}
                    />
                  ))}
                </Box>
              )}
              {!isTxHash && searchTraders?.meta?.total === 0 && (
                <NoDataFound message={<Trans>No Trader Found</Trans>} />
              )}
              {isTxHash && searchPositions?.length === 0 && (
                <NoDataFound message={<Trans>No Transaction Found</Trans>} />
              )}
            </Box>
          )}
        </SearchResult>
      )}
    </SearchWrapper>
  )
}

export default SearchBox

const SearchResultItems = ({
  keyword,
  data,
  actionTitle,
  handleClick,
}: {
  keyword: string
  data: TraderData
  actionTitle?: string
  handleClick?: (data: TraderData) => void
}) => {
  return (
    <Box
      px={3}
      py="6px"
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '&:hover': {
          backgroundColor: '#292d40',
        },
      }}
    >
      <Button
        variant="ghost"
        type="button"
        onClick={() => (handleClick ? handleClick(data) : undefined)}
        sx={{ color: 'inherit', p: 0, mx: 0 }}
        width="100%"
      >
        <Flex sx={{ gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <AccountInfo
            isOpenPosition={data.isOpenPosition}
            keyword={keyword}
            address={data.account}
            smartAccount={data.smartAccount}
            protocol={data.protocol}
            size={40}
            sx={{
              width: 168,
            }}
          />
          <Image src={parseProtocolImage(data.protocol)} width={20} height={20} />
        </Flex>
      </Button>
    </Box>
  )
}
