import { useCallback, useState } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'

export default function useSelectMultiple<T>({
  paramKey,
  defaultSelected,
  toggleLastItem = false,
}: {
  paramKey: string | undefined
  defaultSelected: T[]
  toggleLastItem?: boolean
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const [selected, setSelected] = useState<T[]>(() => {
    if (!paramKey) return defaultSelected
    const str = searchParams[paramKey] as string
    if (!str) return defaultSelected
    return str.toUpperCase().split('__') as T[]
  })
  const isToggledAll = selected?.length === defaultSelected.length
  const checkIsSelected = useCallback(
    (status: T) => {
      if (selected.includes(status)) return true
      return false
    },
    [selected]
  )
  const toggleAll = useCallback(
    (isToggledAll: boolean) => {
      if (isToggledAll) {
        setSelected(defaultSelected)
        paramKey && setSearchParams({ [paramKey]: defaultSelected.join('__').toLowerCase() })
      } else {
        setSelected([])
        paramKey && setSearchParams({ [paramKey]: null })
      }
    },
    [defaultSelected, paramKey, setSearchParams]
  )
  const handleToggleSelect = useCallback(
    (option: T) => {
      setSelected((prev) => {
        if (!toggleLastItem && prev.length === 1 && prev.includes(option)) return prev
        let newState: T[] = []
        if (prev.includes(option)) {
          newState = prev.filter((prevStatus) => prevStatus !== option)
        } else {
          newState = [...prev, option]
        }
        paramKey && setSearchParams({ [paramKey]: newState.join('__').toLowerCase() })
        return newState
      })
    },
    [paramKey, setSearchParams, toggleLastItem]
  )
  return {
    selected,
    checkIsSelected,
    handleToggleSelect,
    toggleAll,
    isToggledAll,
  }
}
