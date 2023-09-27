import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'

export const useInactiveListener = () => {
  const { account, connector } = useWeb3React()

  useEffect(() => {
    if (account && connector) {
      const handleDeactivate = () => {
        window.location.href = '/'
      }

      connector.addListener('Web3ReactDeactivate', handleDeactivate)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactivate)
      }
    }
    return undefined
  }, [account, connector])
}
