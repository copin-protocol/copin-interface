import { useEffect, useState } from 'react'

const useDebounce = <T>(initialValue: T, time = 300): T => {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    const debounce = setTimeout(() => {
      setValue(initialValue)
    }, time)
    return () => {
      clearTimeout(debounce)
    }
  }, [initialValue, time])

  return value
}

export default useDebounce
