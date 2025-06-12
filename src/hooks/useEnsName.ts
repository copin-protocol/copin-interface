import { isAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'utils/config/keys'

import { useEnsStore } from './store/useEnsStore'

export function useEnsName(address: string | undefined | null) {
  const { getEnsName, setEnsName } = useEnsStore()

  const {
    data: ensName,
    isLoading,
    error,
  } = useQuery(
    [QUERY_KEYS.GET_ENS_NAME, address],
    async () => {
      if (!address) return null

      if (!isAddress(address)) {
        return null
      }

      // Check if we already have the ENS name in store
      const cachedName = getEnsName(address)
      if (cachedName != null) return cachedName

      // Create a provider using public Ethereum node
      const provider = new JsonRpcProvider('https://ethereum-rpc.publicnode.com')

      // Resolve ENS name
      const name = await provider.lookupAddress(address)
      setEnsName(address, name || '')
      return name
    },
    {
      enabled: !!address,
      retry: 0,
      keepPreviousData: true,
    }
  )

  return {
    ensName: ensName || null,
    isLoading,
    error,
  }
}
