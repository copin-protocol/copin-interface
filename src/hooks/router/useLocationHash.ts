import { useCallback, useMemo } from 'react'

const useLocationHash = () => {
  const hash = useMemo<string>(() => window.location.hash?.replace('#', ''), [])
  const setHash = useCallback((h: string) => {
    window.history.pushState({}, '', `#${h}`)
  }, [])
  return { hash, setHash }
}

export default useLocationHash
