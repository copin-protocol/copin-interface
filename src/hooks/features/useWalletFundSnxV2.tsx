import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import Num from 'entities/Num'
import useMulticallQuery from 'hooks/web3/useMulticallQuery'
import useWeb3 from 'hooks/web3/useWeb3'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS, QUERY_KEYS } from 'utils/config/keys'
import { SYNTHETIX_MARKETS } from 'utils/config/trades'
import { OPTIMISM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'
import { rpcProvider } from 'utils/web3/providers'

export interface SmartWalletFund {
  inWallet: Num | null
  total: Num | null
  available: Num | null
  loading: boolean
  accessibleMargins?: {
    market: string
    value: BigNumber
  }[]
  reloadFund: () => void
}

const useWalletFund = ({
  address,
  enabled = true,
  totalIncluded = false,
  platform = CopyTradePlatformEnum.SYNTHETIX_V2,
}: {
  address?: string
  enabled?: boolean
  totalIncluded?: boolean
  platform?: CopyTradePlatformEnum
}): SmartWalletFund => {
  const chainId = getCopyTradePlatformChain(platform)
  const publicProvider = rpcProvider(chainId)
  const smartWalletContract = useMemo(() => {
    if (!address) return
    return new Contract(address, CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET], publicProvider)
  }, [address, publicProvider])
  const {
    data: availableMargin,
    isLoading: loadingAvailableMargin,
    refetch: reloadAvailableMargin,
  } = useQuery(
    [QUERY_KEYS.GET_AVAILABLE_MARGIN, smartWalletContract?.address],
    () => {
      if (!smartWalletContract) return
      return smartWalletContract.availableFundD18()
    },
    {
      enabled: enabled && !!smartWalletContract,
    }
  )
  const accessibleCalls: { address: string; name: string; params: any[] }[] = useMemo(
    () =>
      SYNTHETIX_MARKETS[OPTIMISM_CHAIN].map((market) => ({
        address: market,
        name: 'accessibleMargin',
        params: [smartWalletContract?.address],
      })),
    [smartWalletContract?.address]
  )
  const remainingCalls: { address: string; name: string; params: any[] }[] = useMemo(
    () =>
      SYNTHETIX_MARKETS[OPTIMISM_CHAIN].map((market) => ({
        address: market,
        name: 'remainingMargin',
        params: [smartWalletContract?.address],
      })),
    [smartWalletContract?.address]
  )
  const {
    data: accessibleMargins,
    isLoading: loadingAccessibleMargins,
    refetch: reloadAccessibleMargins,
  } = useMulticallQuery(CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2], accessibleCalls, OPTIMISM_CHAIN, {
    enabled: enabled && !!smartWalletContract && platform == CopyTradePlatformEnum.SYNTHETIX_V2,
    select: (data: any[]) => {
      if (!data) return []
      const margins = data.map((e, i) => ({
        market: accessibleCalls[i].address,
        value: e[0] as BigNumber,
      }))
      return margins
    },
  })

  const {
    data: remainingMargins,
    isLoading: loadingRemainingMargins,
    refetch: reloadRemainingMargins,
  } = useMulticallQuery(CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2], remainingCalls, OPTIMISM_CHAIN, {
    enabled: enabled && !!smartWalletContract && totalIncluded && platform == CopyTradePlatformEnum.SYNTHETIX_V2,
    select: (data: any[]) => {
      if (!data) return []
      const margins = data.map((e, i) => ({
        market: remainingCalls[i].address,
        value: e[0] as BigNumber,
      }))
      return margins
    },
  })

  // console.log('accessibleMargins', accessibleMargins)

  const available = useMemo(() => {
    if (!availableMargin) return null
    let available = availableMargin
    if (!accessibleMargins) return new Num(available)
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
    if (!availableMargin) return null
    let total = availableMargin
    if (!remainingMargins) return new Num(total)
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

  const reloadFund = () => {
    reloadAvailableMargin()
    reloadAccessibleMargins()
    reloadRemainingMargins()
  }
  return {
    inWallet: availableMargin ? new Num(availableMargin) : null,
    available,
    total,
    loading: loadingAvailableMargin && loadingAccessibleMargins && loadingRemainingMargins,
    accessibleMargins,
    reloadFund,
  }
}

export default useWalletFund
