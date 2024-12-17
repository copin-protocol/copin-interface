import { formatUnits, parseUnits } from '@ethersproject/units'
import { useMemo } from 'react'

import { VaultData, VaultUserDetails } from 'entities/vault'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export interface VaultUserDetailsContractData {
  vaultUserDetails?: VaultUserDetails
  isLoading?: boolean
  reloadVaultUserDetails?: () => void
}

const useVaultUserDetails = ({
  vault,
  enabled = true,
}: {
  vault?: VaultData
  enabled?: boolean
}): VaultUserDetailsContractData => {
  const address = vault?.vaultAddress ?? ''

  const decimals = vault?.decimals ?? 6
  const calls: { address: string; name: string; params: any[] }[] = [
    {
      address,
      name: 'getPooledTokenByShares',
      params: [parseUnits(vault?.userBalanceShares?.toFixed(6) ?? '0', decimals)],
    },
  ]

  const {
    data,
    isFetching: isLoading,
    refetch: reloadVaultUserDetails,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.COPIN_VAULT_DETAILS],
    calls,
    ARBITRUM_CHAIN,
    rpcProvider(ARBITRUM_CHAIN),
    undefined,
    {
      enabled: enabled && !!address && !!vault,
    }
  )

  const vaultUserDetails = useMemo<VaultUserDetails | undefined>(() => {
    if (!data || !vault) return
    const userBalanceUsd = data[0]?.[0] ? Number(formatUnits(data[0]?.[0], 6)) : 0
    const netDeposit = vault?.userNetDeposit ?? 0
    const lastPrice = vault?.userBalanceShares ? netDeposit / vault.userBalanceShares : 0
    const currentPrice =
      vault?.totalSupply && vault?.totalPooledToken ? vault?.totalPooledToken / vault?.totalSupply : 0
    const pnl = vault?.userBalanceShares ? (currentPrice - lastPrice) * vault?.userBalanceShares : 0

    return {
      userBalanceUsd,
      netDeposit,
      lastPrice,
      currentPrice,
      pnl,
    }
  }, [data, vault])

  return { vaultUserDetails, isLoading, reloadVaultUserDetails }
}

export default useVaultUserDetails
