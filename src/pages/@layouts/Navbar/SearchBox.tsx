// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getTradersApi } from 'apis/traderApis'
import { QueryFilter } from 'apis/types'
import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import { TraderData } from 'entities/trader'
import useDebounce from 'hooks/helpers/useDebounce'
import useOnClickOutside from 'hooks/helpers/useOnClickOutside'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Button } from 'theme/Buttons'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { isAddress } from 'utils/web3/contracts'

import { SearchResult, SearchWrapper } from './styled'

const MIN_QUICK_SEARCH_LENGTH = 3

const SearchBox = ({
  bg,
  width,
  actionTitle = 'View',
  placeholder = 'Search Address',
  onSelect,
}: {
  actionTitle?: string
  placeholder?: string
  bg?: string
  width?: string | number
  onSelect?: (data: TraderData) => void
}) => {
  const { protocol } = useProtocolStore()
  const { myProfile } = useMyProfile()
  const history = useHistory()
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [visibleSearchResult, setVisibleSearchResult] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)
  const [isLoading, setIsLoading] = useState(false)
  const queryFilters: QueryFilter[] = []
  if (!!debounceSearchText) {
    // let keyword = debounceSearchText
    // try {
    //   keyword = getAddress(debounceSearchText.toLowerCase())
    // } catch (e: any) {
    //   //
    // }
    // queryFilters.push({ fieldName: 'account', value: keyword })
    queryFilters.push({ fieldName: 'type', value: TimeFilterByEnum.S60_DAY })
  }

  const logEventSearch = useCallback(
    (action: string) => {
      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.SEARCH,
        action,
      })
    },
    [myProfile?.username]
  )

  useOnClickOutside(searchWrapperRef, () => {
    setVisibleSearchResult(false)
  })

  const allowSearchProtocol = (data: ProtocolEnum) => {
    return onSelect ? protocol === data : true
  }

  const { data: searchUserData, isFetching: searchingUser } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, debounceSearchText, queryFilters, ProtocolEnum.GMX],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.GMX,
        body: { pagination: { limit: 5 }, queries: queryFilters, keyword: debounceSearchText },
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        allowSearchProtocol(ProtocolEnum.GMX),
    }
  )

  const { data: searchUserDataKwenta, isFetching: searchingUserKwenta } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, debounceSearchText, queryFilters, ProtocolEnum.KWENTA],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.KWENTA,
        body: { pagination: { limit: 5 }, queries: queryFilters, keyword: debounceSearchText },
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        allowSearchProtocol(ProtocolEnum.KWENTA),
    }
  )

  useEffect(() => {
    if (!searchingUser && !searchingUserKwenta) {
      setIsLoading(false)
    }
  }, [searchingUser, searchingUserKwenta])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    if (!isLoading && e.target.value.trim().length >= MIN_QUICK_SEARCH_LENGTH) {
      setIsLoading(true)
      setVisibleSearchResult(true)
    } else {
      setIsLoading(false)
      setVisibleSearchResult(false)
    }
  }

  // disable loading when spacing
  useEffect(() => {
    if (debounceSearchText === trimmedSearchText) {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  const handleSearchFocus = () => {
    if (trimmedSearchText.length) {
      setVisibleSearchResult(true)
    }
    setVisibleSearchResult(false)
  }

  const handleClick = useCallback(
    (data?: TraderData) => {
      if (onSelect && data) {
        onSelect(data)
        logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_CUSTOM_ADD)
      } else {
        history.push(generateTraderDetailsRoute(data?.protocol ?? protocol, data?.account ?? debounceSearchText))
        logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_CLICK)
      }
      setVisibleSearchResult(false)
    },
    [debounceSearchText, history, logEventSearch, onSelect, protocol]
  )

  const handleClickViewAll = () => {
    if (trimmedSearchText.length === 0) return
    if (!isAddress(debounceSearchText)) return
    if (searchUserDataKwenta && searchUserDataKwenta.data && searchUserDataKwenta.meta?.total > 0) {
      handleClick(searchUserDataKwenta.data[0])
    } else {
      handleClick()
    }
    logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_ENTER)
  }

  const handleClearSearch = () => {
    setSearchText('')
    setVisibleSearchResult(false)
  }

  useEffect(() => {
    if (!inputSearchRef.current) return
    inputSearchRef.current.blur()
  }, [history.location.pathname])

  return (
    <SearchWrapper ref={searchWrapperRef} width={width ?? ['100%', '100%', 280, 380]}>
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
              {searchUserData?.meta?.total === 0 && searchUserDataKwenta?.meta?.total === 0 ? <NoDataFound /> : null}
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
