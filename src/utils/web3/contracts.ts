import { Result } from '@ethersproject/abi'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { Provider, Web3Provider } from '@ethersproject/providers'

import ERC20_ABI from 'abis/ERC20.json'
import FEE_REBATE_ABI from 'abis/FeeRebate.json'
import MULTICALL_ABI from 'abis/Multicall.json'
import REFERRAL_REBATE_ABI from 'abis/ReferralRebate.json'
import SMART_COPYWALLET_ABI from 'abis/SmartWallet.json'
import SMART_COPYWALLET_FACTORY_ABI from 'abis/SmartWalletFactory.json'
import SNX_PERPS_MARKET_V2_ABI from 'abis/SnxPerpV2Market.json'
import SNX_PERPS_MARKET_V3_ABI from 'abis/SnxPerpV3Market.json'
import SUBSCRIPTION_ABI from 'abis/Subscription.json'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ContractInfo } from 'utils/web3/types'

import {
  ARBITRUM_MAINNET,
  ARBITRUM_SEPOLIA,
  BASE_MAINNET,
  BASE_SEPOLIA,
  BLAST_MAINNET,
  BNB_MAINNET,
  GOERLI,
  MANTA_MAINNET,
  MANTLE_MAINNET,
  MODE_MAINNET,
  OPBNB_MAINNET,
  OPTIMISM_MAINNET,
  OPTIMISM_SEPOLIA,
  POLYGON_MAINNET,
  SCROLL_MAINNET,
  USD_ASSET,
} from './chains'

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
  [CONTRACT_QUERY_KEYS.SMART_COPYWALLET]: SMART_COPYWALLET_ABI,
  [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: SMART_COPYWALLET_FACTORY_ABI,
  [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3]: SNX_PERPS_MARKET_V3_ABI,
  [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2]: SNX_PERPS_MARKET_V2_ABI,
  [CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]: SUBSCRIPTION_ABI,
  [CONTRACT_QUERY_KEYS.FEE_REBATE]: FEE_REBATE_ABI,
  [CONTRACT_QUERY_KEYS.REFERRAL_REBATE]: REFERRAL_REBATE_ABI,
}

export const CONTRACT_ADDRESSES: {
  [key: number]: {
    [key: string]: string
  }
} = {
  [ARBITRUM_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '0xAfAae4be2c07948eb83e003FfdB859b5e6cabC63',
    [CONTRACT_QUERY_KEYS.USDC]: USD_ASSET[ARBITRUM_MAINNET].address,
    // [CONTRACT_QUERY_KEYS.EXECUTOR]: '0xdDAf82aD2ceF6dDAB6170C46111398d7622eE829',
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '0xbd3726fc0B8411869aE8268345cFfF48747F39da',
    [CONTRACT_QUERY_KEYS.GAINS_TRADING_V8]: '0xFF162c694eAA571f685030649814282eA457f169',
    [CONTRACT_QUERY_KEYS.FEE_REBATE]: '0x36c9b37367918AdE91b04000C9E110F42557e602',
    [CONTRACT_QUERY_KEYS.REFERRAL_REBATE]: '0xDbd46bcE63A9bdF98B8e84d963BaEcdE37C8DdFA',
  },
  [OPTIMISM_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '0xB27A14Fa98608A95d81C22023F09648f2Cb714C2',
    [CONTRACT_QUERY_KEYS.SUSD]: USD_ASSET[OPTIMISM_MAINNET].address,
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '0x76Ea7951214A0a3b8D132fb7C80c174dbeD62bcf',
    [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2_SETTINGS]: '0x649F44CAC3276557D03223Dbf6395Af65b11c11c',
    [CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]: '0xE77C8B98D21e7Aa2960A90AebDf0B50EAb83Ff55',
  },
  [OPTIMISM_SEPOLIA]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '0x329b3599e51B992879349C0388D29a5B06861B0B',
    [CONTRACT_QUERY_KEYS.SUSD]: USD_ASSET[OPTIMISM_SEPOLIA].address,
    // [CONTRACT_QUERY_KEYS.EXECUTOR]: '0xdDAf82aD2ceF6dDAB6170C46111398d7622eE829',
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '0x2d4B54D05079A2eb2fc39031b5d3c1f2553a4F0b',
    [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2_SETTINGS]: '0x34ffA8af41B1B3077e7b40cC19B6906c3125Cd0c',
    [CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]: '0x15C03E0bA39Bd0Aa087BEF2e27AB7316A65bcC56',
  },
  [ARBITRUM_SEPOLIA]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '0x1e879694C79D68FCf48D90d09c2FeEb692AF2087',
    [CONTRACT_QUERY_KEYS.USDC]: USD_ASSET[ARBITRUM_SEPOLIA].address,
    // [CONTRACT_QUERY_KEYS.EXECUTOR]: '0xdDAf82aD2ceF6dDAB6170C46111398d7622eE829',
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '0x949408171c4BE8C7017Ed4331B6c927Cbfe332cD',
    [CONTRACT_QUERY_KEYS.GAINS_TRADING_V8]: '0xd659a15812064C79E189fd950A189b15c75d3186',
    [CONTRACT_QUERY_KEYS.FEE_REBATE]: '0xbFD39C7bAB89ee2173AD7E119146786db891b355',
    [CONTRACT_QUERY_KEYS.REFERRAL_REBATE]: '0x28631d21609989D00d6af8E83D52dd2CD7F9fc6C',
  },
  [BASE_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '',
    [CONTRACT_QUERY_KEYS.USDC]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '',
    [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3]: '0x73157413479Cf449601cc6C022C7985222166E44',
  },
  [BASE_SEPOLIA]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY]: '0x2Bf1fDde19FF0cDAF8BA9f36Fb6E372CD36d6167',
    [CONTRACT_QUERY_KEYS.USDC]: '0x4967d1987930b2CD183dAB4B6C40B8745DD2eba1',
    [CONTRACT_QUERY_KEYS.EXECUTOR]: '0x70F5CB11f15C7e1632BAf03fa150044aC0453DF6',
    [CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3]: '0x75c43165ea38cB857C45216a37C5405A7656673c',
  },
  [GOERLI]: {
    [CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]: '0xd6e992c9a794a599da83812b9d27b14876c25f73',
  },
  [OPBNB_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [BLAST_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [MANTA_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [MANTLE_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [MODE_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [POLYGON_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [SCROLL_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  [BNB_MAINNET]: {
    [CONTRACT_QUERY_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
}

export function isAddress(value: any): string {
  try {
    if (value?.startsWith('dydx')) return value
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
