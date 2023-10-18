import { Result } from '@ethersproject/abi'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { Provider, Web3Provider } from '@ethersproject/providers'

import ERC20_ABI from 'abis/ERC20.json'
import MULTICALL_ABI from 'abis/Multicall.json'
import SMART_ACCOUNT_ABI from 'abis/SmartAccount.json'
import SMART_ACCOUNT_FACTORY_ABI from 'abis/SmartAccountFactory.json'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ContractInfo } from 'utils/web3/types'

import { ARBITRUM_MAINNET, OPTIMISM_GOERLI, OPTIMISM_MAINNET } from './chains'

export interface ContractKey {
  key: string
  chainId: number
}

export const CONTRACT_ABIS: {
  [key: string]: any
} = {
  [CONTRACT_QUERY_KEYS.MULTICALL]: MULTICALL_ABI,
  // BUSD: ERC20_ABI,
  [CONTRACT_QUERY_KEYS.ERC20]: ERC20_ABI,
  [CONTRACT_QUERY_KEYS.SMART_ACCOUNT]: SMART_ACCOUNT_ABI,
  [CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY]: SMART_ACCOUNT_FACTORY_ABI,
}

export const CONTRACT_ADDRESSES: {
  [key: number]: {
    [key: string]: string
  }
} = {
  [ARBITRUM_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [OPTIMISM_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [OPTIMISM_GOERLI]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY]: '0x353A5fCBc3D58dc06cB2EE27162d615Ae93B4531',
  },
}

export function isAddress(value: any): string {
  try {
    return getAddress(value)
  } catch {
    return ''
  }
}

// account is not optional
export function getSigner(provider: Web3Provider, account: string): Signer {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(provider: Web3Provider, account?: string | null): Provider | Signer {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(contract: ContractInfo, signer: Signer | Provider): Contract {
  const { address, abi } = contract
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, abi, signer)
}

const getMulticallAddress = (chainId: number): string => {
  switch (chainId) {
    default:
      return '0xcA11bde05977b3631167028862bE2a173976CA11'
  }
}

export const getMulticallContract = (chainId: number, provider: Signer | Provider) => {
  return getContract({ address: CONTRACT_ADDRESSES[chainId]['MULTICALL'], abi: MULTICALL_ABI }, provider)
}

export const getResultFromReceipt = (receipt: TransactionReceipt, contract: Contract): Result | null => {
  const log = receipt.logs.find((e) => e.address === contract.address && e.transactionHash === receipt.transactionHash)
  if (!log) return null

  const data = contract.interface.parseLog(log)
  if (!data?.args.length) return null
  return data.args
}

export const BLOCK_WAITING_SECONDS: {
  [key: number]: number
} = {
  [ARBITRUM_MAINNET]: 12,
}

export const getDelayTime = (chainId: number) => {
  return (BLOCK_WAITING_SECONDS[chainId] ?? 6) * 1000
}
