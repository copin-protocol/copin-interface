import { useCallback } from 'react'
import { useQueryClient } from 'react-query'

export default function useRefetchQueries() {
  const queryClient = useQueryClient()

  return useCallback(
    (queryKeysToFetch: string[], callback?: (args?: any) => any) =>
      setTimeout(
        () =>
          queryClient
            .refetchQueries({
              predicate: ({ queryKey }) => {
                return queryKeysToFetch.includes(queryKey[0] as string)
              },
              active: true,
            })
            .then(() => {
              callback && callback()
            }),
        1000
      ),
    [queryClient]
  )
}
