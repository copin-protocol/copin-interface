import { useSetChain } from '@web3-onboard/react'
import { useMemo } from 'react'

import { DEFAULT_CHAIN_ID, getChainMetadata } from 'utils/web3/chains'

const useChain = () => {
  const [{ connectedChain, settingChain }, setChain] = useSetChain()
  const currentChain = useMemo(
    () => getChainMetadata(connectedChain?.id ? parseInt(connectedChain?.id, 16) : DEFAULT_CHAIN_ID),
    [connectedChain]
  )

  return { chain: currentChain, setChain, settingChain }
}

export default useChain
