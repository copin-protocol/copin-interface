import dayjs from 'dayjs'
import { formatEther } from 'ethers/lib/utils'
import { useMemo } from 'react'

import { FeeRebateData } from 'entities/feeRebate'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export interface FeeRebateContractData {
  info?: FeeRebateData
  isLoading?: boolean
  reloadFeeRebate?: () => void
}

const useFeeRebate = ({
  account,
  enabled = true,
}: {
  account?: string | null
  enabled?: boolean
}): FeeRebateContractData => {
  const address = CONTRACT_ADDRESSES[ARBITRUM_CHAIN][CONTRACT_QUERY_KEYS.FEE_REBATE]

  const calls: { address: string; name: string; params: any[] }[] = [
    {
      address,
      name: 'EPOCH_START',
      params: [],
    },
    {
      address,
      name: 'EPOCH_LENGTH',
      params: [],
    },
    {
      address,
      name: 'MAX_EPOCHS',
      params: [],
    },
    {
      address,
      name: 'MAX_REWARD',
      params: [],
    },
    {
      address,
      name: 'currentEpochId',
      params: [],
    },
    {
      address,
      name: 'totalDistributedReward',
      params: [],
    },
  ]
  if (!!account) {
    calls.push({
      address,
      name: 'getClaimableFees',
      params: [account],
    })
    calls.push({
      address,
      name: 'getClaimedFees',
      params: [account],
    })
    calls.push({
      address,
      name: 'getOngoingFees',
      params: [account],
    })
  }

  const {
    data,
    isLoading,
    refetch: reloadFeeRebate,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.FEE_REBATE],
    calls,
    ARBITRUM_CHAIN,
    rpcProvider(ARBITRUM_CHAIN),
    account,
    {
      enabled: enabled && !!address,
    }
  )

  const info = useMemo<FeeRebateData | undefined>(() => {
    if (!data || data.length === 0) return
    const epochStart = data[0]?.[0]?.toNumber() * 1000
    const epochLength = data[1]?.[0]?.toNumber()
    const maxEpochs = data[2]?.[0]?.toNumber()
    const maxReward = data[3]?.[0] ? Number(formatEther(data[3]?.[0])) : 0
    const currentEpochId = data[4]?.[0]?.toNumber()
    const totalDistributedReward = data[5]?.[0] ? Number(formatEther(data[5]?.[0])) : 0
    const claimableFees = data[6]?.[0] ? Number(formatEther(data[6]?.[0])) : 0
    const claimedFees = data[7]?.[0] ? Number(formatEther(data[7]?.[0])) : 0
    const ongoingFees = data[8]?.[0] ? Number(formatEther(data[8]?.[0])) : 0

    const totalFees = ongoingFees + claimableFees + claimedFees
    const epochEnd = dayjs(epochStart)
      .add(epochLength * maxEpochs - 1, 'seconds')
      .valueOf()

    return {
      epochStart,
      epochEnd,
      epochLength,
      maxEpochs,
      currentEpochId,
      maxReward,
      totalDistributedReward,
      claimableFees,
      claimedFees,
      ongoingFees,
      totalFees,
    }
  }, [data])

  return { info, isLoading, reloadFeeRebate }
}

export default useFeeRebate
