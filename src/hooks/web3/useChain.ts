import { useMemo, useState } from 'react'

import { DEFAULT_CHAIN_ID, getChainMetadata } from 'utils/web3/chains'

import { useAuthContext } from './useAuth'

const useChain = () => {
  const { wallet } = useAuthContext()
  const [, setReload] = useState(0)
  const currentChain = useMemo(() => getChainMetadata(wallet?.chainId ? wallet.chainId : DEFAULT_CHAIN_ID), [wallet])

  const setChain = async (chainId: number | string) => {
    if (!wallet) return
    await wallet
      .switchChain(typeof chainId === 'string' ? (chainId as `0x${string}`) : `0x${chainId.toString(16)}`)
      .catch((err) => {
        throw err
      })
    setReload((r) => r + 1)
  }

  return { chain: currentChain, setChain, connectedChain: wallet?.chainId }
}

export default useChain
