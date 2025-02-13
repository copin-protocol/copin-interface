import { formatUnits } from '@ethersproject/units'
import { useMemo } from 'react'

import { VaultData } from 'entities/vault'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export interface VaultDetailsContractData {
  vault?: VaultData
  isLoading?: boolean
  reloadVaultDetails?: () => void
}

const useVaultDetails = ({
  vaultAddress,
  account,
  enabled = true,
}: {
  vaultAddress?: string
  account?: string
  enabled?: boolean
}): VaultDetailsContractData => {
  const address = vaultAddress ?? ''

  const calls: { address: string; name: string; params: any[] }[] = [
    {
      address,
      name: 'copyWallet',
      params: [],
    },
    {
      address,
      name: 'getTotalShares',
      params: [],
    },
    {
      address,
      name: 'getTotalPooledToken',
      params: [],
    },
    {
      address,
      name: 'totalSupply',
      params: [],
    },
    {
      address,
      name: 'decimals',
      params: [],
    },
    {
      address,
      name: 'profitSharingRatio',
      params: [],
    },
    {
      address,
      name: 'depositFee',
      params: [],
    },
    {
      address,
      name: 'withdrawFee',
      params: [],
    },
    {
      address,
      name: 'managementFee',
      params: [],
    },
    {
      address,
      name: 'lockDepositDuration',
      params: [],
    },
    {
      address,
      name: 'lastSnapshot',
      params: [],
    },
    {
      address,
      name: 'lastSnapshotBalance',
      params: [],
    },
    {
      address,
      name: 'paused',
      params: [],
    },
    {
      address,
      name: 'vaultConfigs',
      params: [],
    },
    {
      address,
      name: 'owner',
      params: [],
    },
  ]
  if (!!account) {
    calls.push({
      address,
      name: 'netAccountDeposits',
      params: [account],
    })
    calls.push({
      address,
      name: 'balanceOf',
      params: [account],
    })
    calls.push({
      address,
      name: 'lastDepositTimes',
      params: [account],
    })
  }

  const {
    data,
    isLoading,
    refetch: reloadVaultDetails,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.COPIN_VAULT_DETAILS],
    calls,
    ARBITRUM_CHAIN,
    rpcProvider(ARBITRUM_CHAIN),
    address,
    {
      enabled: enabled && !!address,
    }
  )

  const vault = useMemo<VaultData | undefined>(() => {
    if (!data || data.length === 0) return
    const copyWallet = data[0]?.[0]?.toString()
    const totalShares = data[1]?.[0] ? Number(formatUnits(data[1]?.[0], 6)) : 0
    const totalPooledToken = data[2]?.[0] ? Number(formatUnits(data[2]?.[0], 6)) : 0
    const totalSupply = data[3]?.[0] ? Number(formatUnits(data[3]?.[0], 6)) : 0
    const decimals = Number(data[4]?.[0])
    const profitSharingRatio = data[5]?.[0] ? data[5]?.[0]?.toNumber() / 10000 : 0
    const depositFee = data[6]?.[0] ? data[6]?.[0]?.toNumber() / 10000 : 0
    const withdrawFee = data[7]?.[0] ? data[7]?.[0]?.toNumber() / 10000 : 0
    const managementFee = data[8]?.[0] ? data[8]?.[0]?.toNumber() / 10000 : 0
    const lockDepositDuration = data[9]?.[0]?.toNumber()
    const lastSnapshot = data[10]?.[0]?.toNumber()
    const lastSnapshotBalance = data[11]?.[0] ? Number(formatUnits(data[11]?.[0], 6)) : 0
    const paused = Boolean(data[12]?.[0])
    const vaultConfigs = {
      minDeposit: data[13]?.[0] ? Number(formatUnits(data[13]?.[0], 6)) : 0,
      maxDeposit: data[13]?.[1] ? Number(formatUnits(data[13]?.[1], 6)) : 0,
      minMargin: data[13]?.[2] ? Number(formatUnits(data[13]?.[2], 6)) : 0,
      maxMargin: data[13]?.[3] ? Number(formatUnits(data[13]?.[3], 6)) : 0,
    }
    const owner = data[14]?.[0]

    const userNetDeposit = data[15]?.[0] ? Number(formatUnits(data[15]?.[0], 6)) : 0
    const userBalanceShares = data[16]?.[0] ? Number(formatUnits(data[16]?.[0], 6)) : 0
    const userLastDepositTimes = data[17]?.[0] ? Number(data[17]?.[0]) * 1000 : 0

    return {
      vaultAddress,
      copyWallet,
      owner,
      totalShares,
      totalPooledToken,
      totalSupply,
      decimals,
      profitSharingRatio,
      depositFee,
      withdrawFee,
      managementFee,
      lockDepositDuration,
      lastSnapshot,
      lastSnapshotBalance,
      paused,
      vaultConfigs,
      userNetDeposit,
      userBalanceShares,
      userLastDepositTimes,
    }
  }, [data, vaultAddress])

  return { vault, isLoading, reloadVaultDetails }
}

export default useVaultDetails
