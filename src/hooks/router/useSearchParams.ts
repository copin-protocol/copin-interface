import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { parsedQueryString } from './useParsedQueryString'

export default function useSearchParams() {
  const { search, pathname } = useLocation()
  const history = useHistory()
  const searchParams = useMemo(() => parsedQueryString(search), [search])

  const setSearchParams = useCallback(
    (params: { [key: string]: string | null | undefined }) => {
      if (Object.keys(params).length === 0) return
      const urlSearchParams = new URLSearchParams(search)
      for (const key in params) {
        if (!!key) {
          if (params[key]) {
            urlSearchParams.set(key, params[key] ?? '')
          } else {
            urlSearchParams.delete(key)
          }
        }
      }
      history.replace({ search: urlSearchParams.toString() })
    },
    [history, search]
  )

  const setSearchParamsOnly = (params: { [key: string]: string | undefined }) => {
    const urlSearchParams = new URLSearchParams()
    for (const key in params) {
      const value = params[key]
      if (value == null) continue
      if (!!key) urlSearchParams.set(key, value)
    }
    history.replace({ search: urlSearchParams.toString() })
  }

  return { searchParams, setSearchParams, setSearchParamsOnly, pathname }
}
