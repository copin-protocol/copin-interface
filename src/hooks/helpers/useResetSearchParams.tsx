import { useLayoutEffect } from 'react'

import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import useSearchParams from 'hooks/router/useSearchParams'
import { TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

export default function useResetSearchParams() {
  const { searchParams, setSearchParams } = useSearchParams()
  const homeTimeFilter = searchParams[URL_PARAM_KEYS.HOME_TIME] as unknown as TimeFilterByEnum
  const explorerTimeFilter = searchParams[URL_PARAM_KEYS.EXPLORER_TIME_FILTER] as unknown as TimeFilterByEnum
  const isPremium = useIsPremium()
  useLayoutEffect(() => {
    if (isPremium === false) {
      if (homeTimeFilter === TimeFilterByEnum.ALL_TIME) {
        setSearchParams({ [URL_PARAM_KEYS.HOME_TIME]: null })
      }
      if (explorerTimeFilter === TimeFilterByEnum.ALL_TIME) {
        setSearchParams({ [URL_PARAM_KEYS.EXPLORER_TIME_FILTER]: null })
      }
    }
  }, [explorerTimeFilter, homeTimeFilter, isPremium, setSearchParams])
}
