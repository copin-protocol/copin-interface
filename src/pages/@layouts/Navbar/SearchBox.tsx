// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'

import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import { TraderData } from 'entities/trader'
import useSearchTraders from 'hooks/helpers/useSearchTraders'
import { Button } from 'theme/Buttons'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { parseProtocolImage } from 'utils/helpers/transform'

import { SearchResult, SearchWrapper } from './styled'

const SearchBox = ({
  bg,
  width,
  actionTitle = 'View',
  placeholder = 'Search Address',
  onSelect,
  returnRanking = false,
}: {
  actionTitle?: string
  placeholder?: string
  bg?: string
  width?: string | number
  onSelect?: (data: TraderData) => void
  returnRanking?: boolean
}) => {
  const {
    searchWrapperRef,
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    handleClickViewAll,
    visibleSearchResult,
    isLoading,
    searchUserData,
    handleClick,
    searchUserDataKwenta,
    searchUserDataPolynomial,
    allowSearchProtocol,
  } = useSearchTraders({ onSelect, returnRanking })

  return (
    <SearchWrapper ref={searchWrapperRef} width={width ?? ['100%', '100%', 220, 300]}>
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
        onKeyDown={(e) => e.key === 'Enter' && handleClickViewAll()}
      />

      {visibleSearchResult && (
        <SearchResult>
          {isLoading ? (
            <Box textAlign="center" py={4}>
              <Loading />
            </Box>
          ) : (
            <Box p={2}>
              {(searchUserData?.meta?.total ?? 0) > 0 && allowSearchProtocol(ProtocolEnum.GMX) && (
                <Box>
                  <Flex mb={1} alignItems="center" sx={{ gap: 2 }}>
                    <Image src={parseProtocolImage(ProtocolEnum.GMX)} width={20} height={20} />
                    <Type.CaptionBold color="neutral3">
                      <Trans>GMX</Trans>
                    </Type.CaptionBold>
                  </Flex>
                  {searchUserData?.data.map((userData) => (
                    <SearchResultItems
                      key={userData.id}
                      actionTitle={actionTitle}
                      data={userData}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              )}
              {(searchUserDataKwenta?.meta?.total ?? 0) > 0 && allowSearchProtocol(ProtocolEnum.KWENTA) && (
                <Box mt={2}>
                  <Flex mb={1} alignItems="center" sx={{ gap: 2 }}>
                    <Image src={parseProtocolImage(ProtocolEnum.KWENTA)} width={20} height={20} />
                    <Type.CaptionBold color="neutral3">
                      <Trans>Kwenta</Trans>
                    </Type.CaptionBold>
                  </Flex>
                  {searchUserDataKwenta?.data.map((userData) => (
                    <SearchResultItems
                      key={userData.id}
                      actionTitle={actionTitle}
                      data={userData}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              )}
              {(searchUserDataPolynomial?.meta?.total ?? 0) > 0 && allowSearchProtocol(ProtocolEnum.POLYNOMIAL) && (
                <Box mt={2}>
                  <Flex mb={1} alignItems="center" sx={{ gap: 2 }}>
                    <Image src={parseProtocolImage(ProtocolEnum.POLYNOMIAL)} width={20} height={20} />
                    <Type.CaptionBold color="neutral3">
                      <Trans>Polynomial</Trans>
                    </Type.CaptionBold>
                  </Flex>
                  {searchUserDataPolynomial?.data.map((userData) => (
                    <SearchResultItems
                      key={userData.id}
                      actionTitle={actionTitle}
                      data={userData}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              )}
              {searchUserData?.meta?.total === 0 &&
              searchUserDataKwenta?.meta?.total === 0 &&
              searchUserDataPolynomial?.meta?.total === 0 ? (
                <NoDataFound message={<Trans>No Trader Found In The Past 60 Days</Trans>} />
              ) : null}
            </Box>
          )}
        </SearchResult>
      )}
    </SearchWrapper>
  )
}

export default SearchBox

const SearchResultItems = ({
  data,
  actionTitle,
  handleClick,
}: {
  data: TraderData
  actionTitle?: string
  handleClick?: (data: TraderData) => void
}) => {
  return (
    <Box py={1}>
      <Button
        variant="ghost"
        type="button"
        onClick={() => (handleClick ? handleClick(data) : undefined)}
        sx={{ color: 'inherit', p: 0, mx: 0 }}
        width="100%"
      >
        <Flex sx={{ gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <AccountInfo isOpenPosition={data.isOpenPosition} address={data.account} protocol={data.protocol} />
          <Type.Caption color="neutral3" sx={{ ':hover': { textDecoration: 'underline' } }}>
            {actionTitle}
          </Type.Caption>
        </Flex>
      </Button>
    </Box>
  )
}
