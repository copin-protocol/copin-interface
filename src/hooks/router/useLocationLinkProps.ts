import { stringify } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import useParsedQueryString from 'hooks/router/useParsedQueryString'

export function useLocationLinkProps(props: any) {
  const location = useLocation()
  const qs = useParsedQueryString()
  return useMemo(
    () =>
      !props
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, ...props }),
            },
            // onClick: () => {
            // },
          },
    [location, qs, props]
  )
}
