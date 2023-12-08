import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getTradersApi } from 'apis/traderApis'
import { QueryFilter } from 'apis/types'
import { TraderData } from 'entities/trader'
import useDebounce from 'hooks/helpers/useDebounce'
import useOnClickOutside from 'hooks/helpers/useOnClickOutside'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { isAddress } from 'utils/web3/contracts'

import { useIsPremium } from '../features/useSubscriptionRestrict'

const MIN_QUICK_SEARCH_LENGTH = 3
export default function useSearchTraders(args?: {
  returnRanking?: boolean
  onSelect?: (data: TraderData) => void
  allowAllProtocol?: boolean
}) {
  const { onSelect, returnRanking = false, allowAllProtocol = false } = args ?? {}
  const { protocol } = useProtocolStore()
  const { myProfile } = useMyProfileStore()
  const isPremiumUser = useIsPremium()
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
    queryFilters.push({
      fieldName: 'type',
      value: isPremiumUser ? TimeFilterByEnum.ALL_TIME : TimeFilterByEnum.S60_DAY,
    })
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

  const allowSearchProtocol = (_protocol: ProtocolEnum) => {
    if (allowAllProtocol) return true
    return onSelect ? protocol === _protocol : true
  }

  const { data: searchUserData, isFetching: searchingUser } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, debounceSearchText, queryFilters, ProtocolEnum.GMX, returnRanking, isPremiumUser],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.GMX,
        body: { pagination: { limit: 5 }, queries: queryFilters, keyword: debounceSearchText, returnRanking },
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        allowSearchProtocol(ProtocolEnum.GMX),
    }
  )

  const { data: searchUserDataKwenta, isFetching: searchingUserKwenta } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, debounceSearchText, queryFilters, ProtocolEnum.KWENTA, returnRanking, isPremiumUser],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.KWENTA,
        body: { pagination: { limit: 5 }, queries: queryFilters, keyword: debounceSearchText, returnRanking },
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        allowSearchProtocol(ProtocolEnum.KWENTA),
    }
  )

  const { data: searchUserDataPolynomial, isFetching: searchingUserPolynomial } = useQuery(
    [
      QUERY_KEYS.GET_TOP_TRADERS,
      debounceSearchText,
      queryFilters,
      ProtocolEnum.POLYNOMIAL,
      returnRanking,
      isPremiumUser,
    ],
    () =>
      getTradersApi({
        protocol: ProtocolEnum.POLYNOMIAL,
        body: { pagination: { limit: 5 }, queries: queryFilters, keyword: debounceSearchText, returnRanking },
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        allowSearchProtocol(ProtocolEnum.POLYNOMIAL),
    }
  )

  useEffect(() => {
    if (!searchingUser && !searchingUserKwenta && !searchingUserPolynomial) {
      setIsLoading(false)
    }
  }, [searchingUser, searchingUserKwenta, searchingUserPolynomial])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    if (e.target.value.trim().length >= MIN_QUICK_SEARCH_LENGTH) {
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
        history.push(
          generateTraderDetailsRoute(
            data?.protocol ?? protocol ?? ProtocolEnum.GMX,
            data?.account ?? debounceSearchText
          )
        )
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
    } else if (searchUserDataPolynomial && searchUserDataPolynomial.data && searchUserDataPolynomial.meta?.total > 0) {
      handleClick(searchUserDataPolynomial.data[0])
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

  return {
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
  }
}
