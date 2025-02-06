import { useEffect, useState } from 'react'

import { CHAINS } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

const useLatestBlockNumber = ({ chainId, dep }: { chainId: number | undefined; dep?: any }) => {
  const protocolProvider = rpcProvider(chainId ?? 0)
  const [latestBlockNumber, setLatestBlockNumber] = useState(0)

  useEffect(() => {
    if (!chainId || !CHAINS[chainId] || !protocolProvider) return
    protocolProvider.getBlockNumber().then((value: number) => {
      setLatestBlockNumber(value)
    })
  }, [dep])

  return { latestBlockNumber }
}

export default useLatestBlockNumber
