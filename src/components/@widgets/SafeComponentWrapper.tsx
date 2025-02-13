import { useEffect, useState } from 'react'

/**
 * This component prevent root page component over rerender, bug did not resolve
 */
export default function SafeComponentWrapper({ children }: { children: any }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])
  if (!loaded) return null
  return children
}
