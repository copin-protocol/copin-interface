import { useCallback, useState } from 'react'

import useSearchParams from './useSearchParams'

const useTabHandler = ({ defaultTab, tabKey = 'tab' }: { defaultTab: string; tabKey?: string }) => {
  const { searchParams, setSearchParams } = useSearchParams()
  const tab = (searchParams[tabKey] as string) ?? defaultTab
  const handleTab = useCallback(
    ({ tab, otherParams = {} }: { tab: string; otherParams?: Record<string, string | undefined | null> }) => {
      setSearchParams({
        [tabKey]: tab as string,
        ...otherParams,
      })
    },
    [setSearchParams]
  )
  return { tab, handleTab }
}

export default useTabHandler
