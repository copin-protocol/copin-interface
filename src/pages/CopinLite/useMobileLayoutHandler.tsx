import { useCallback, useEffect, useState } from 'react'

import { MobileLayoutType } from 'components/@position/types'

export default function useMobileLayoutHandler({
  mobileBreakpoint,
  storageKey,
}: {
  mobileBreakpoint: boolean
  storageKey: string
}) {
  const [layoutType, setLayoutType] = useState<MobileLayoutType>(() => {
    if (mobileBreakpoint) return 'LIST'
    const storedLayout = localStorage.getItem(storageKey) as MobileLayoutType
    if (!storedLayout) return 'GRID'
    return storedLayout
  })
  useEffect(() => {
    if (mobileBreakpoint) {
      setLayoutType('LIST')
    } else {
      localStorage.setItem(storageKey, layoutType)
    }
  }, [mobileBreakpoint, layoutType, storageKey])
  const handleChangeLayout = useCallback((type: MobileLayoutType) => setLayoutType(type), [])
  return { layoutType, handleChangeLayout }
}
