import { useEffect, useState } from 'react'

import { rpcProvider } from 'utils/web3/providers'

const useLatestBlockNumber = ({ chainId, dep }: { chainId: number; dep?: any }) => {
  const protocolProvider = rpcProvider(chainId)
  const [latestBlockNumber, setLatestBlockNumber] = useState(0)

  useEffect(() => {
    if (!chainId || !protocolProvider) return
    protocolProvider.getBlockNumber().then((value: number) => {
      setLatestBlockNumber(value)
    })
  }, [dep])

  return { latestBlockNumber }
}

export default useLatestBlockNumber
