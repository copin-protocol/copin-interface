// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useMemo } from 'react'

import useWeb3 from 'hooks/web3/useWeb3'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { WalletProviderError } from 'utils/helpers/handleError'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { CONTRACT_ABIS, getContract, getProviderOrSigner } from 'utils/web3/contracts'
import { getSimpleRpcProvider } from 'utils/web3/getRpcUrl'
import { ContractInfo } from 'utils/web3/types'

export function useSimpleContract<T extends Contract = Contract>({
  contract,
  chainId = DEFAULT_CHAIN_ID,
}: {
  contract: ContractInfo
  chainId?: number
}): T {
  return useMemo(() => {
    return getContract(contract, getSimpleRpcProvider(chainId))
  }, [contract, chainId]) as T
}

// returns null on errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useContract<T extends Contract = Contract>({
  contract,
  withSignerIfPossible = true,
  account,
  provider,
}: {
  contract: ContractInfo
  withSignerIfPossible?: boolean
  account?: string
  provider?: Web3Provider
}): T {
  const { walletProvider, walletAccount, publicProvider } = useWeb3()

  const selectedProvider = provider ?? walletProvider

  return useMemo(() => {
    const providerOrSigner =
      withSignerIfPossible && selectedProvider
        ? getProviderOrSigner(selectedProvider, account ?? walletAccount)
        : publicProvider
    if (!providerOrSigner) throw new WalletProviderError('Unable to get provider')
    return getContract(contract, providerOrSigner)
  }, [account, contract, publicProvider, selectedProvider, walletAccount, withSignerIfPossible]) as T
}

export function useERC20Contract(erc20Address: string, withSignerIfPossible?: boolean) {
  return useContract({
    contract: { address: erc20Address, abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.ERC20] },
    withSignerIfPossible,
  })
}

export function useSmartWalletContract(address: string, withSignerIfPossible?: boolean) {
  return useContract({
    contract: { address, abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET] },
    withSignerIfPossible,
  })
}

export function useSnxV3PerpsMarketContract(chainId: number, withSignerIfPossible?: boolean) {
  return useContract({
    contract: {
      address: CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3],
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3],
    },
    withSignerIfPossible,
  })
}

export function useSnxV2PerpsMarketContract(address: string, withSignerIfPossible?: boolean) {
  return useContract({
    contract: {
      address,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2],
    },
    withSignerIfPossible,
  })
}

export function useSmartWalletFactoryContract(chainId: number, withSignerIfPossible?: boolean) {
  return useContract({
    contract: {
      address: CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY],
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY],
    },
    withSignerIfPossible,
  })
}

export function useFeeRebateContract(chainId: number, withSignerIfPossible?: boolean) {
  return useContract({
    contract: {
      address: CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.FEE_REBATE],
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.FEE_REBATE],
    },
    withSignerIfPossible,
  })
}

export function useReferralRebateContract(chainId: number, withSignerIfPossible?: boolean) {
  return useContract({
    contract: {
      address: CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.REFERRAL_REBATE],
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.REFERRAL_REBATE],
    },
    withSignerIfPossible,
  })
}
