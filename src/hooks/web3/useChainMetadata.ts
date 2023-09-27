import { useMemo } from 'react'

import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import { getChainMetadata } from 'utils/web3/chains'

const useChainMetadata = () => {
  const { chainId } = useActiveWeb3React()
  const currentChain = useMemo(() => getChainMetadata(chainId), [chainId])
  return {
    chainId,
    chainName: currentChain.chainName,
    currencySymbol: currentChain.nativeCurrency.symbol,
    currencyDecimals: currentChain.nativeCurrency.decimals,
    explorerUrl: currentChain.blockExplorerUrls[0],
  }
}

export default useChainMetadata
