import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { STORAGE_KEYS } from 'utils/config/keys'

// Note: feature relate to tabs open need to call later the init hook
export function useInitTabsOpen() {
  const loadedRef = useRef(false)
  useLayoutEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const tabsOpen = localStorage.getItem(STORAGE_KEYS.TABS_OPEN)
    if (tabsOpen == null || tabsOpen === '0') {
      localStorage.setItem(STORAGE_KEYS.TABS_OPEN, '1')
    } else {
      localStorage.setItem(STORAGE_KEYS.TABS_OPEN, `${parseInt(tabsOpen) + 1}`)
    }

    window.addEventListener('beforeunload', decreaseTabs)
    return () => {
      if (loadedRef.current) return
      decreaseTabs()
    }
  }, [])
}

function decreaseTabs() {
  const tabsCount = localStorage.getItem(STORAGE_KEYS.TABS_OPEN)
  if (tabsCount != null) {
    localStorage.setItem(STORAGE_KEYS.TABS_OPEN, `${parseInt(tabsCount) - 1}`)
  }
}

export function getTabsOpen() {
  const tabsOpen = localStorage.getItem(STORAGE_KEYS.TABS_OPEN)
  return tabsOpen == null ? null : parseInt(tabsOpen)
}
