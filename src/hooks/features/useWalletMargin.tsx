import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import Num from 'entities/Num'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import useWeb3 from 'hooks/web3/useWeb3'
import { CONTRACT_QUERY_KEYS, QUERY_KEYS } from 'utils/config/keys'
import { SYNTHETIX_MARKETS } from 'utils/config/trades'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'

const useWalletMargin = ({
  address,
  enabled = true,
  availableOnly = true,
}: {
  address?: string
  enabled?: boolean
  availableOnly?: boolean
}) => {
  const { publicProvider } = useWeb3()

  const smartAccountContract = useMemo(() => {
    if (!address) return
    return new Contract(address, CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT], publicProvider)
  }, [address, publicProvider])
  const { data: availableMargin, isLoading: loadingAvailableMargin } = useQuery(
    [QUERY_KEYS.GET_AVAILABLE_MARGIN, smartAccountContract?.address],
    () => {
      if (!smartAccountContract) return
      return smartAccountContract.availableMargin()
    },
    {
      enabled: enabled && !!smartAccountContract,
    }
  )
  const accessibleCalls: { address: string; name: string; params: any[] }[] = SYNTHETIX_MARKETS[DEFAULT_CHAIN_ID].map(
    (market) => ({
      address: market,
      name: 'accessibleMargin',
      params: [smartAccountContract?.address],
    })
  )
  const remainingCalls: { address: string; name: string; params: any[] }[] = SYNTHETIX_MARKETS[DEFAULT_CHAIN_ID].map(
    (market) => ({
      address: market,
      name: 'remainingMargin',
      params: [smartAccountContract?.address],
    })
  )
  const { data: accessibleMargins, isLoading: loadingAccessibleMargins } = useCustomMulticallQuery(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SYNTHETIX_MARKET],
    accessibleCalls,
    DEFAULT_CHAIN_ID,
    publicProvider,
    undefined,
    {
      enabled: enabled && !!smartAccountContract,
      select: (data: any[]) => {
        if (!data) return []
        const margins = data.map((e, i) => ({
          market: accessibleCalls[i].address,
          value: e[0] as BigNumber,
        }))
        return margins
      },
    }
  )

  const { data: remainingMargins, isLoading: loadingRemainingMargins } = useCustomMulticallQuery(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SYNTHETIX_MARKET],
    remainingCalls,
    DEFAULT_CHAIN_ID,
    publicProvider,
    undefined,
    {
      enabled: enabled && !!smartAccountContract && !availableOnly,
      select: (data: any[]) => {
        if (!data) return []
        const margins = data.map((e, i) => ({
          market: remainingCalls[i].address,
          value: e[0] as BigNumber,
        }))
        return margins
      },
    }
  )
  const available = useMemo(() => {
    if (!availableMargin || !accessibleMargins) return null
    let available = BigNumber.from(0)
    available = available.add(availableMargin)
    available = available.add(
      accessibleMargins.reduce((prev: BigNumber, cur: { market: string; value: BigNumber }) => {
        if (cur.value) {
          return prev.add(cur.value)
        }
        return prev
      }, BigNumber.from(0))
    )
    return new Num(available)
  }, [availableMargin, accessibleMargins])
  const total = useMemo(() => {
    if (!remainingMargins) return null
    let total = BigNumber.from(0)
    if (availableMargin) total = total.add(availableMargin)
    total = total.add(
      remainingMargins.reduce((prev: BigNumber, cur: { market: string; value: BigNumber }) => {
        if (cur.value) {
          return prev.add(cur.value)
        }
        return prev
      }, BigNumber.from(0))
    )
    return new Num(total)
  }, [availableMargin, remainingMargins])
  return {
    inWallet: availableMargin ? new Num(availableMargin) : null,
    available,
    total,
    loading: loadingAvailableMargin && loadingAccessibleMargins && loadingRemainingMargins,
    accessibleMargins,
  }
}

export default useWalletMargin
