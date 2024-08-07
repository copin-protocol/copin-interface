import { formatEther } from 'ethers/lib/utils'
import { useMemo } from 'react'

import { EpochHistoryData, EpochRebateData } from 'entities/feeRebate'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export interface FeeRebateHistoriesContractData {
  histories?: EpochHistoryData[]
  isLoading?: boolean
  reloadHistories?: () => void
}

const useFeeRebateHistories = ({
  maxEpochs,
  enabled = true,
}: {
  maxEpochs?: number
  enabled?: boolean
}): FeeRebateHistoriesContractData => {
  const address = CONTRACT_ADDRESSES[ARBITRUM_CHAIN][CONTRACT_QUERY_KEYS.FEE_REBATE]

  const calls: { address: string; name: string; params: any[] }[] =
    [...Array.from({ length: maxEpochs ?? 0 }, (v, k) => k + 1)].map((epoch) => {
      return {
        address,
        name: 'epochs',
        params: [epoch],
      }
    }) ?? []

  const {
    data,
    isFetching: isLoading,
    refetch: reloadHistories,
  } = useCustomMulticallQuery<any>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.FEE_REBATE],
    calls,
    ARBITRUM_CHAIN,
    rpcProvider(ARBITRUM_CHAIN),
    undefined,
    {
      enabled: enabled && !!address && !!maxEpochs,
    }
  )

  const histories = useMemo<EpochHistoryData[] | undefined>(() => {
    if (!data || data.length === 0) return
    const res: EpochHistoryData[] = data.map((epoch: any) => {
      const epochStart = epoch[0]?.toNumber() * 1000
      const epochEnd = epoch[1]?.toNumber() * 1000
      const totalRewardPool = Number(formatEther(epoch[2]))
      const lastUpdated = epoch[3]?.toNumber() * 1000
      const status = Number(epoch[4])
      const rebateData = epoch[5]?.[0]?.map((item: any, index: number) => {
        return {
          trader: item,
          fee: Number(formatEther(epoch[5]?.[1]?.[index])),
        } as EpochRebateData
      })

      return {
        epochStart,
        epochEnd,
        totalRewardPool,
        status,
        rebateData,
        lastUpdated,
      }
    })

    return res
      .sort((a, b) => a.epochStart - b.epochStart)
      .map((item, index) => {
        return { ...item, epochId: index + 1 }
      })
    // .sort((a, b) => b.epochId - a.epochId)
  }, [data])

  return { histories, isLoading, reloadHistories }
}

export default useFeeRebateHistories
