import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWallets } from '@web3-onboard/react'
import { useMemo } from 'react'

import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { SUBSCRIPTION_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export default function useSubscriptionContract() {
  const [wallet] = useWallets()
  const publicProvider = useMemo(() => rpcProvider(SUBSCRIPTION_CHAIN_ID), [])

  const providerChain = parseInt(wallet?.chains[0]?.id ?? '')
  const contractAddressByChain = CONTRACT_ADDRESSES[providerChain]?.[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
  const provider = contractAddressByChain
    ? new Web3Provider(wallet.provider, 'any').getSigner(wallet.accounts[0].address).connectUnchecked()
    : publicProvider

  const contractAddress =
    contractAddressByChain || CONTRACT_ADDRESSES[SUBSCRIPTION_CHAIN_ID]?.[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]

  const abi = CONTRACT_ABIS[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
  const subscriptionContract = new Contract(contractAddress, abi, provider)
  return subscriptionContract
}
