// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useMemo } from 'react'

import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { WalletProviderError } from 'utils/helpers/handleError'
import { CONTRACT_ABIS, getContract, getProviderOrSigner } from 'utils/web3/contracts'
import { getSimpleRpcProvider } from 'utils/web3/getRpcUrl'
import { ContractInfo } from 'utils/web3/types'

export function useSimpleContract<T extends Contract = Contract>({
  contract,
  chainId,
}: {
  contract: ContractInfo
  chainId: number
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
  library,
}: {
  contract: ContractInfo
  withSignerIfPossible?: boolean
  account?: string
  library?: Web3Provider
}): T {
  const { library: activeLibrary, account: activeAccount, simpleRpcProvider } = useActiveWeb3React()

  return useMemo(() => {
    const providerOrSigner = withSignerIfPossible
      ? getProviderOrSigner(library ?? (activeLibrary as Web3Provider), account ?? activeAccount)
      : simpleRpcProvider
    if (!providerOrSigner) throw new WalletProviderError('Unable to get provider')
    return getContract(contract, providerOrSigner)
  }, [contract, withSignerIfPossible, library, activeLibrary, account, activeAccount, simpleRpcProvider]) as T
}

export function useERC20Contract(erc20Address: string, withSignerIfPossible?: boolean) {
  return useContract({
    contract: { address: erc20Address, abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.ERC20] },
    withSignerIfPossible,
  })
}
