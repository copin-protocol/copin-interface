import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'
import { ReactNode, createContext, useContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import ERC20_ABI from 'abis/ERC20.json'
import { getVaultDetailsAprApi } from 'apis/vaultApis'
import { VaultAprData, VaultData, VaultUserDetails } from 'entities/vault'
import useWalletFund, { SmartWalletFund } from 'hooks/features/copyTrade/useWalletFundSnxV2'
import { useAuthContext } from 'hooks/web3/useAuth'
import useContractQuery from 'hooks/web3/useContractQuery'
import useWeb3 from 'hooks/web3/useWeb3'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { USD_ASSET } from 'utils/web3/chains'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

import useVaultDetails from './useVaultDetails'
import useVaultUserDetails from './useVaultUserDetails'

export interface VaultDetailsContextValues {
  vaultAddress: string
  vaultCopyWallet: string
  vaultOwner: string
  vault?: VaultData
  vaultUserDetails?: VaultUserDetails
  vaultApr?: VaultAprData
  vaultBalanceUsd?: number
  vaultAvailableBalance?: number
  userRemainingMaxWithdraw?: number
  smartWalletFund?: SmartWalletFund
  isLoadingVaultDetails?: boolean
  isLoadingVaultUserDetails?: boolean
  isLoadingVaultApr?: boolean
  isLoading?: boolean
  lastTimeUpdated?: string
  reload?: () => void
}

export const VaultDetailsContext = createContext({} as VaultDetailsContextValues)

export function VaultDetailsProvider({ children }: { children: ReactNode }) {
  const { address: vaultAddress } = useParams<{ address: string }>()
  const { account } = useAuthContext()
  const {
    vault,
    isLoading: isLoadingVaultDetails,
    reloadVaultDetails,
  } = useVaultDetails({ vaultAddress, account: account?.address })
  const {
    vaultUserDetails,
    isLoading: isLoadingVaultUserDetails,
    reloadVaultUserDetails,
  } = useVaultUserDetails({ vault })

  const {
    data: vaultApr,
    isLoading: isLoadingVaultApr,
    refetch: reloadVaultApr,
  } = useQuery([QUERY_KEYS.GET_VAULT_DETAILS_APR, vaultAddress], () => getVaultDetailsAprApi(), {
    enabled: !!vaultAddress,
    retry: 0,
  })

  const smartWalletFund = useWalletFund({ address: vault?.copyWallet, platform: CopyTradePlatformEnum.GNS_V8 })

  const chainId = getCopyTradePlatformChain(CopyTradePlatformEnum.GNS_V8)
  const { publicProvider } = useWeb3({ chainId })
  const usdAsset = USD_ASSET[chainId]
  const usdAssetContract = useMemo(() => new Contract(usdAsset.address, ERC20_ABI, publicProvider), [publicProvider])
  const { data: vaultBalanceUsd, refetch: refetchVaultBalanceUsd } = useContractQuery<number>(
    usdAssetContract,
    'balanceOf',
    [vaultAddress],
    {
      enabled: !!vaultAddress,
      select(data) {
        return Number(formatUnits(data, usdAsset.decimals))
      },
    }
  )

  const vaultBalance = vaultBalanceUsd ?? 0
  const smartWalletBalance = smartWalletFund?.available?.num ?? 0
  const userBalance = vaultUserDetails?.userBalanceUsd ?? 0
  const minMargin = vault?.vaultConfigs?.minMargin ?? 0
  const vaultAvailableBalance = vaultBalance + smartWalletBalance - minMargin
  const userRemainingMaxWithdraw = useMemo(() => {
    return Math.min(vaultBalance + smartWalletBalance - minMargin, userBalance)
  }, [userBalance, vaultBalance, smartWalletBalance, minMargin])

  const reload = () => {
    reloadVaultDetails?.()
    reloadVaultUserDetails?.()
    reloadVaultApr?.()
    refetchVaultBalanceUsd?.()
    smartWalletFund?.reloadFund?.()
  }

  const contextValue: VaultDetailsContextValues = {
    vaultCopyWallet: vault?.copyWallet ?? '',
    vaultOwner: vault?.owner ?? '',
    vaultAddress,
    vault,
    vaultUserDetails,
    vaultApr,
    vaultBalanceUsd,
    vaultAvailableBalance,
    userRemainingMaxWithdraw,
    smartWalletFund,
    isLoadingVaultDetails,
    isLoadingVaultUserDetails,
    isLoadingVaultApr,
    isLoading: isLoadingVaultDetails || isLoadingVaultUserDetails || isLoadingVaultApr,
    reload,
  }

  return <VaultDetailsContext.Provider value={contextValue}>{children}</VaultDetailsContext.Provider>
}

const useVaultDetailsContext = () => useContext(VaultDetailsContext)
export default useVaultDetailsContext
