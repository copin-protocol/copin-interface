import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseEther } from '@ethersproject/units'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import Num from 'entities/Num'
import { CONTRACT_QUERY_KEYS, QUERY_KEYS } from 'utils/config/keys'
import { BASE_CHAIN, USD_ASSET } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

export interface SmartWalletFund {
  inWallet: Num | null
  total: Num | null
  available: Num | null
  loading: boolean
  reloadFund: () => void
}

const useWalletFund = ({ address, enabled = true }: { address?: string; enabled?: boolean }): SmartWalletFund => {
  const publicProvider = rpcProvider(BASE_CHAIN)
  const usdAsset = USD_ASSET[BASE_CHAIN]

  const smartWalletContract = useMemo(() => {
    if (!address) return
    return new Contract(address, CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET], publicProvider)
  }, [address])
  const {
    data: availableFund,
    isLoading: loadingAvailableFund,
    refetch: reloadAvailableFund,
  } = useQuery(
    [QUERY_KEYS.GET_AVAILABLE_MARGIN, smartWalletContract?.address],
    () => {
      if (!smartWalletContract) return
      return smartWalletContract.availableFund()
    },
    {
      enabled: enabled && !!smartWalletContract,
    }
  )

  const {
    data: idleMargin,
    isLoading: loadingIdleMargin,
    refetch: reloadIdleMargin,
  } = useQuery(
    [QUERY_KEYS.GET_IDLE_MARGIN, smartWalletContract?.address],
    () => {
      if (!smartWalletContract) return
      return smartWalletContract.getPerpIdleMargin()
    },
    {
      enabled: enabled && !!smartWalletContract,
    }
  )

  const {
    data: margin,
    isLoading: loadingMargin,
    refetch: reloadMargin,
  } = useQuery(
    [QUERY_KEYS.GET_REMAINING_MARGIN, smartWalletContract?.address],
    () => {
      if (!smartWalletContract) return
      return smartWalletContract.getPerpMargin()
    },
    {
      enabled: enabled && !!smartWalletContract,
    }
  )

  const inWallet = useMemo(
    () => (availableFund ? new Num(availableFund, usdAsset.decimals) : null),
    [availableFund, usdAsset.decimals]
  )

  const available = useMemo(() => {
    let amount = BigNumber.from(0)
    if (inWallet) amount = amount.add(parseEther(inWallet.str))
    if (idleMargin) amount = amount.add(idleMargin)
    return new Num(amount)
  }, [inWallet, idleMargin])
  const total = useMemo(() => {
    let amount = BigNumber.from(0)
    if (inWallet) amount = amount.add(parseEther(inWallet.str))
    if (margin) amount = amount.add(margin)
    return new Num(amount)
  }, [inWallet, margin])

  const reloadFund = useCallback(() => {
    reloadAvailableFund()
    reloadIdleMargin()
    reloadMargin()
  }, [reloadAvailableFund, reloadIdleMargin, reloadMargin])

  return {
    inWallet,
    available,
    total,
    loading: loadingAvailableFund && loadingIdleMargin && loadingMargin,
    reloadFund,
  }
}

export default useWalletFund
