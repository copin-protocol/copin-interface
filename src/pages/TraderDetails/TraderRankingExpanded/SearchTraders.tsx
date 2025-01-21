// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import useSearchAllData from 'hooks/features/useSearchAllData'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'

import { FindAndSelectTraderProps } from './FindAndSelectTrader'
import { filterFoundData } from './helpers'

export default function SearchTraders({
  resultHeight = 200,
  ...props
}: FindAndSelectTraderProps & { resultHeight?: number }) {
  const {
    searchWrapperRef,
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    visibleSearchResult,
    isLoading,
    searchTraders,
  } = useSearchAllData({ onSelect: props.onSelect, returnRanking: true, allowAllProtocol: true, limit: props.limit })
  const traders = [...filterFoundData(searchTraders?.data, props.ignoreSelectTraders)]
  return (
    <Box ref={searchWrapperRef} sx={{ position: 'relative' }}>
      <InputSearch
        ref={inputSearchRef}
        placeholder={props.placeholder ?? t`SEARCH BY ADDRESS`}
        sx={{
          width: '100%',
        }}
        value={searchText}
        onFocus={handleSearchFocus}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
      {visibleSearchResult && (
        <Flex
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: 'translateY(100%)',
            maxHeight: resultHeight,
            bg: 'neutral5',
            flexDirection: 'column',
            overflow: 'auto',
            zIndex: 100,
          }}
        >
          {isLoading ? (
            <Box px={1}>
              <Loading />
            </Box>
          ) : (
            <>
              {!traders.length && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
              {traders.map((traderData) => {
                return (
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    role="button"
                    key={traderData.id}
                    onClick={() => props.onSelect(traderData)}
                    sx={{ py: '6px', px: 2, borderRadius: 'sm', '&:hover': { bg: 'neutral6' } }}
                  >
                    <TraderAddress
                      address={traderData.account}
                      protocol={traderData.protocol}
                      options={{
                        isLink: false,
                        textSx: { width: 80 },
                      }}
                    />
                    {props.addWidget}
                  </Flex>
                )
              })}
            </>
          )}
        </Flex>
      )}
    </Box>
  )
}
