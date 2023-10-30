import { useMemo } from 'react'

import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { getSimpleRpcProvider } from 'utils/web3/getRpcUrl'

import { useAuthContext } from './useAuth'

const useWeb3 = ({ chainId = DEFAULT_CHAIN_ID }: { chainId?: number } = {}) => {
  const { provider, account } = useAuthContext()
  const simpleRpcProvider = useMemo(() => getSimpleRpcProvider(chainId), [chainId])
  // console.log('account', account)
  return {
    walletProvider: provider,
    publicProvider: simpleRpcProvider,
    walletAccount: account,
  }
}

export default useWeb3
