import { useApolloClient } from '@apollo/client'
import { createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useEffect } from 'react'

import { getStoredJwt } from 'apis/helpers'
import { useAuthContext } from 'hooks/web3/useAuth'

export default function useModifyApolloClient() {
  const apolloClient = useApolloClient()
  const { isAuthenticated, profile } = useAuthContext()
  useEffect(() => {
    const httpLink = createHttpLink({
      uri: `${import.meta.env.VITE_API}/graphql`,
    })
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = getStoredJwt()
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ?? '',
        },
      }
    })
    if (isAuthenticated) {
      apolloClient.setLink(authLink.concat(httpLink))
    } else {
      apolloClient.setLink(httpLink)
    }
    apolloClient.refetchQueries({ include: 'all' })
  }, [profile?.username])
}
