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
  } = useSearchAllData({ onSelect: props.onSelect, returnRanking: true, allowAllProtocol: true })
  const traders = [...filterFoundData(searchTraders?.data, props.ignoreSelectTraders)]
  return (
    <Box ref={searchWrapperRef} sx={{ position: 'relative' }}>
      <InputSearch
        ref={inputSearchRef}
        placeholder={t`Search by address`}
        sx={{
          px: 2,
          py: 1,
          width: '100%',
          borderColor: 'transparent',
          bg: 'neutral8',
          borderRadius: 'sm',
        }}
        value={searchText}
        onFocus={handleSearchFocus}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
      {visibleSearchResult && (
        <Flex
          sx={{
            pt: 12,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: 'translateY(100%)',
            height: resultHeight,
            bg: 'neutral5',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {isLoading ? (
            <Box pt={4}>
              <Loading />
            </Box>
          ) : (
            <>
              {!traders.length && <NoDataFound message={<Trans>No Trader Found In The Past 60 Days</Trans>} />}
              {traders.map((traderData) => {
                return (
                  <Box
                    role="button"
                    key={traderData.id}
                    onClick={() => props.onSelect(traderData)}
                    sx={{ py: '6px', px: 1, borderRadius: 'sm', '&:hover': { bg: 'neutral6' } }}
                  >
                    <TraderAddress
                      address={traderData.account}
                      protocol={traderData.protocol}
                      options={{
                        isLink: false,
                        textSx: { width: 80 },
                      }}
                    />
                  </Box>
                )
              })}
            </>
          )}
        </Flex>
      )}
    </Box>
  )
}
