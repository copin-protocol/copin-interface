// eslint-disable-next-line no-restricted-imports
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useRef } from 'react'

import { ELEMENT_IDS } from 'utils/config/keys'

const DEBOUNCE_SCROLL_TIME = 100

export default function useInfiniteLoadMore({
  fetchNextPage,
  hasNextPage,
  isLoading,
  isDesktop,
}: {
  fetchNextPage: (() => void) | undefined
  hasNextPage: boolean | undefined
  isLoading: boolean
  isDesktop: boolean
}) {
  const scrollDesktopRef = useRef<HTMLDivElement>(null)
  const scrollMobileRef = useRef<HTMLDivElement>()
  const scrollRef = isDesktop ? scrollDesktopRef : scrollMobileRef
  useEffect(() => {
    const scrollElement = document.getElementById(ELEMENT_IDS.APP_MAIN_WRAPPER) as HTMLDivElement
    if (!scrollElement) return
    scrollMobileRef.current = scrollElement
  }, [])
  const handleScroll = debounce(
    useCallback(() => {
      if (!scrollRef?.current || isLoading) return
      const rect = scrollRef.current.getBoundingClientRect()
      const { scrollTop, scrollHeight } = scrollRef.current
      if (rect.height + scrollTop + 10 >= scrollHeight && hasNextPage) {
        fetchNextPage && fetchNextPage()
      }
    }, [fetchNextPage, hasNextPage, isLoading, scrollRef]),
    DEBOUNCE_SCROLL_TIME
  )

  useEffect(() => {
    const prevScrollRef = scrollRef?.current
    prevScrollRef?.addEventListener('scroll', handleScroll)
    return () => prevScrollRef?.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollRef])
  return { scrollRef: scrollDesktopRef }
}
