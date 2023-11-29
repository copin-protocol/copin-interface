import { useQueryClient } from 'react-query'

export default function useRefetchQueries() {
  const queryClient = useQueryClient()

  return (queryKeysToFetch: string[], callback?: (args?: any) => any) =>
    setTimeout(
      () =>
        queryClient
          .refetchQueries({
            predicate: ({ queryKey }) => {
              return queryKeysToFetch.includes(queryKey[0] as string)
            },
          })
          .then(() => {
            callback && callback()
          }),
      1000
    )
}
