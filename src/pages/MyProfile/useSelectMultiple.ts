import { useState } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'

export default function useSelectMultiple<T>({
  paramKey,
  defaultSelected,
}: {
  paramKey: string
  defaultSelected: T[]
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const [selected, setSelected] = useState<T[]>(() => {
    const str = searchParams[paramKey] as string
    if (!str) return defaultSelected
    return str.split('_') as T[]
  })
  const checkIsSelected = (status: T) => {
    if (selected.includes(status)) return true
    return false
  }
  const handleToggleSelect = ({ status }: { status: T }) => {
    setSelected((prev) => {
      if (prev.length === 1 && prev.includes(status)) return prev
      let newState: T[] = []
      if (prev.includes(status)) {
        newState = prev.filter((prevStatus) => prevStatus !== status)
      } else {
        newState = [...prev, status]
      }
      setSearchParams({ [paramKey]: newState.join('_') })
      return newState
    })
  }
  return {
    selected,
    checkIsSelected,
    handleToggleSelect,
  }
}
