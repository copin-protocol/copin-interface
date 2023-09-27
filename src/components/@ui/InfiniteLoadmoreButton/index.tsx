// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import debounce from 'lodash/debounce'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { Button } from 'theme/Buttons'

const STEPS = 3 // 4 load per click
const DEBOUNCE_SCROLL_TIME = 100

function InfiniteLoadMoreButton({
  fetchNextPage,
  hasNextPage,
  isLoading,
  containerRef,
  buttonSx,
}: {
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isLoading: boolean
  containerRef: RefObject<HTMLDivElement>
  buttonSx?: any
}) {
  const [isMustForcedFetch, setIsMustForcedFetch] = useState(true)
  const loadMoreCount = useRef(0)

  const handleScroll = debounce(
    useCallback(() => {
      if (!containerRef.current) return
      const { bottom } = containerRef.current.getBoundingClientRect()

      if (loadMoreCount.current > STEPS) {
        loadMoreCount.current = 0
        setIsMustForcedFetch(true)
        return
      }

      if (!isMustForcedFetch && bottom < window.innerHeight && hasNextPage) {
        loadMoreCount.current += 1
        fetchNextPage()
      }
    }, [containerRef, fetchNextPage, hasNextPage, isMustForcedFetch]),
    DEBOUNCE_SCROLL_TIME
  )

  useEffect(() => {
    const manualScroll = () => {
      if (isMustForcedFetch) return
      window.dispatchEvent(new CustomEvent('scroll'))
    }
    const timeout = setTimeout(manualScroll, 0)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMustForcedFetch])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <>
      {isMustForcedFetch && hasNextPage && (
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          sx={{ display: 'block', mx: 'auto', ...(buttonSx || {}) }}
          variant="primary"
          mt={4}
          onClick={() => {
            setIsMustForcedFetch(false)
          }}
        >
          <Trans>Show more</Trans>
        </Button>
      )}
    </>
  )
}

export default InfiniteLoadMoreButton
