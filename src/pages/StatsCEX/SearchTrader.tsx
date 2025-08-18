// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import { TraderData } from 'entities/trader'
import useSearchAllData from 'hooks/features/trader/useSearchAllData'
import { Button } from 'theme/Buttons'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { SearchResult } from 'theme/Search'
import { Box, Flex, Image } from 'theme/base'
import { parseProtocolImage } from 'utils/helpers/transform'

const SearchTrader = ({
  bg,
  width,
  actionTitle = 'View',
  placeholder = 'Search for traders',
  onSelect,
  allowAllProtocol = true,
}: {
  actionTitle?: string
  placeholder?: string
  bg?: string
  width?: string | number
  onSelect?: (data: TraderData) => void
  allowAllProtocol?: boolean
}) => {
  const {
    searchWrapperRef,
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    handleSearchEnter,
    visibleSearchResult,
    isLoading,
    searchTraders,
  } = useSearchAllData({ onSelect, allowAllProtocol })

  return (
    <Box ref={searchWrapperRef} width={width ?? ['100%', '100%', 220, 220, 380]} sx={{ position: 'relative' }}>
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
        onKeyDown={(e) => e.key === 'Enter' && handleSearchEnter}
      />

      {visibleSearchResult && (
        <SearchResult>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <Loading />
            </Box>
          ) : (
            <Box>
              {(searchTraders?.meta?.total ?? 0) > 0 && (
                <Box>
                  {searchTraders?.data.map((userData) => (
                    <SearchResultItems
                      key={userData.id}
                      keyword={searchText}
                      actionTitle={actionTitle}
                      data={userData}
                      handleClick={onSelect}
                    />
                  ))}
                </Box>
              )}
              {searchTraders?.meta?.total === 0 && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
            </Box>
          )}
        </SearchResult>
      )}
    </Box>
  )
}

export default SearchTrader

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
            keyword={keyword}
            address={data.account}
            smartAccount={data.smartAccount}
            protocol={data.protocol}
            textSx={{
              width: 168,
            }}
          />
          <Image src={parseProtocolImage(data.protocol)} width={20} height={20} />
        </Flex>
      </Button>
    </Box>
  )
}
