import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { searchPositionsApi } from 'apis/positionApis'
import { searchTradersApi } from 'apis/traderApis'
import { PositionData, TraderData } from 'entities/trader'
import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import useDebounce from 'hooks/helpers/useDebounce'
import useOnClickOutside from 'hooks/helpers/useOnClickOutside'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { EVM_TX_HASH_REGEX, SEARCH_DEBOUNCE_TIME, SEARCH_DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { generatePositionDetailsRoute, generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { isAddress } from 'utils/web3/contracts'

const MIN_QUICK_SEARCH_LENGTH = 3
export default function useSearchAllData(args?: {
  returnRanking?: boolean
  onSelect?: (data: TraderData) => void
  allowAllProtocol?: boolean
  allowSearchPositions?: boolean
}) {
  const { onSelect, allowAllProtocol = false, allowSearchPositions = false } = args ?? {}
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
  const [currentProtocol, setCurrentProtocol] = useState<ProtocolEnum | undefined>()

  const isTxHash = useMemo(
    () => allowSearchPositions && EVM_TX_HASH_REGEX.test(debounceSearchText),
    [allowSearchPositions, debounceSearchText]
  )

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

  const { data: searchTraders, isFetching: searchingTraders } = useQuery(
    [QUERY_KEYS.SEARCH_ALL_TRADERS, debounceSearchText, isPremiumUser, allowAllProtocol, protocol, currentProtocol],
    () =>
      searchTradersApi({
        limit: SEARCH_DEFAULT_LIMIT,
        keyword: debounceSearchText,
        protocol: !!currentProtocol ? currentProtocol : allowAllProtocol ? undefined : protocol,
        sortBy: 'lastTradeAtTs',
        sortType: SortTypeEnum.DESC,
      }),
    {
      enabled:
        Boolean(debounceSearchText.length >= MIN_QUICK_SEARCH_LENGTH && debounceSearchText === trimmedSearchText) &&
        !isTxHash,
    }
  )

  const { data: searchPositions, isFetching: searchingPositions } = useQuery(
    [QUERY_KEYS.SEARCH_TX_HASH, debounceSearchText, isPremiumUser, allowAllProtocol, protocol],
    () =>
      searchPositionsApi({
        limit: SEARCH_DEFAULT_LIMIT,
        txHash: debounceSearchText,
        protocol: allowAllProtocol ? undefined : protocol,
      }),
    {
      enabled: isTxHash,
    }
  )

  useEffect(() => {
    if (!searchingTraders && !searchingPositions) {
      setIsLoading(false)
    }
  }, [searchingTraders, searchingPositions])

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
      return
    }
    setVisibleSearchResult(false)
    setCurrentProtocol(undefined)
  }

  const handleClick = useCallback(
    (data?: TraderData) => {
      if (onSelect && data) {
        onSelect(data)
        logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_CUSTOM_ADD)
      } else {
        history.push(
          generateTraderMultiExchangeRoute({
            protocol: data?.protocol,
            address: data?.account ?? debounceSearchText,
          })
        )
        logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_CLICK)
      }
      setVisibleSearchResult(false)
    },
    [debounceSearchText, history, logEventSearch, onSelect, protocol]
  )

  const handleClickPosition = useCallback(
    (data: PositionData) => {
      history.push(
        generatePositionDetailsRoute({ ...data, txHash: data.txHashes[0] }, { highlightTxHash: debounceSearchText })
      )
      logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_CLICK_POSITION)
      setVisibleSearchResult(false)
    },
    [debounceSearchText, history, logEventSearch]
  )

  const handleSearchEnter = () => {
    if (trimmedSearchText.length === 0) return
    if (!isAddress(debounceSearchText)) return
    if (searchTraders && searchTraders.data && searchTraders.meta?.total > 0) {
      handleClick(searchTraders.data[0])
    } else {
      handleClick()
    }
    logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_ENTER)
  }

  const handleSearchPositionsEnter = () => {
    if (trimmedSearchText.length === 0) return
    if (!isTxHash) return
    if (searchPositions && searchPositions.length > 0) {
      handleClickPosition(searchPositions[0])
    }
    logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_ENTER_POSITION)
  }

  const handleClickViewAll = () => {
    if (trimmedSearchText.length === 0) return
    if (isAddress(debounceSearchText)) {
      history.push(generateTraderMultiExchangeRoute({ address: debounceSearchText }))
      setVisibleSearchResult(false)
      return
    }
    if (isTxHash) {
      history.push(`${ROUTES.SEARCH_TX_HASH.path_prefix}/${debounceSearchText}`)
    } else {
      const matchProtocol = !!currentProtocol ? `&protocol=${currentProtocol}` : ''
      history.push(
        `${ROUTES.SEARCH.path}?keyword=${trimmedSearchText}${matchProtocol}&sort_by=lastTradeAtTs&sort_type=${SortTypeEnum.DESC}`
      )
    }
    setVisibleSearchResult(false)
    logEventSearch(EVENT_ACTIONS[EventCategory.SEARCH].SEARCH_VIEW_ALL)
  }

  const handleClearSearch = () => {
    setSearchText('')
    setVisibleSearchResult(false)
    setCurrentProtocol(undefined)
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
    handleSearchEnter,
    handleClickViewAll,
    handleSearchPositionsEnter,
    visibleSearchResult,
    isLoading,
    handleClick,
    handleClickPosition,
    searchTraders,
    searchPositions,
    allowSearchProtocol,
    allowSearchPositions,
    isTxHash,
    currentProtocol,
    setCurrentProtocol,
  }
}
