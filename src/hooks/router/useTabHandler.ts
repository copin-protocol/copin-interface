import { useCallback, useState } from 'react'

import useSearchParams from './useSearchParams'

const useTabHandler = (defaultTab: string, shouldChangeUrl = true, tabKey?: string) => {
  const { searchParams, setSearchParams } = useSearchParams()
  const [tab, setTab] = useState<string>(
    shouldChangeUrl ? (searchParams[tabKey ?? 'tab'] as string) || defaultTab : defaultTab
  )
  const handleTab = useCallback(
    (t: string) => {
      setTab(t)
      shouldChangeUrl &&
        setSearchParams({
          [tabKey ?? 'tab']: t,
        })
    },
    [setSearchParams]
  )
  return { tab, handleTab }
}

export default useTabHandler
