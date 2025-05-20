import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'

import { useAuthContext } from 'hooks/web3/useAuth'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { SUBSCRIPTION_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export default function useSubscriptionContract() {
  const { wallet } = useAuthContext()
  const publicProvider = useMemo(() => rpcProvider(SUBSCRIPTION_CHAIN_ID), [])

  const providerChain = parseInt(wallet?.chainId ?? '')
  const contractAddressByChain = CONTRACT_ADDRESSES[providerChain]?.[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
  const provider = contractAddressByChain ? wallet?.provider.getSigner().connectUnchecked() : publicProvider

  const contractAddress =
    contractAddressByChain || CONTRACT_ADDRESSES[SUBSCRIPTION_CHAIN_ID]?.[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]

  const abi = CONTRACT_ABIS[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
  const subscriptionContract = new Contract(contractAddress, abi, provider)
  return subscriptionContract
}
