import { useEffect, useMemo } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

type TraderCopying = Record<string, ProtocolEnum[]>

interface TraderCopyingState {
  isLoading: boolean
  submitting: boolean
  traderCopying: TraderCopying
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setTraderCopying: (traders: TraderCopying) => void
}

const useTraderCopyingStore = create<TraderCopyingState>()(
  immer((set) => ({
    traderCopying: {},
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setTraderCopying: (traders: TraderCopying) => set({ traderCopying: traders }),
  }))
)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.WALLET_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
  ROUTES.POSITION_DETAILS.path,
]
export const useInitTraderCopying = () => {
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH)
  const { setTraderCopying, setLoading } = useTraderCopyingStore()
  const { allCopyTrades } = useAllCopyTrades({ enabled: enabledQueryByPaths })

  useEffect(() => {
    const copyingTrader: TraderCopying | undefined = allCopyTrades?.reduce((result, copyTrade) => {
      if (copyTrade.status === CopyTradeStatusEnum.RUNNING)
        return {
          ...result,
          [copyTrade.account]: Array.from(new Set([...(result[copyTrade.account] ?? []), copyTrade.protocol])),
        }
      return result
    }, {} as TraderCopying)
    if (!copyingTrader) return
    setTraderCopying(copyingTrader)
    setLoading(true)
  }, [allCopyTrades])
}

const useTraderCopying = (account: string | undefined, protocol: ProtocolEnum | undefined) => {
  const { isLoading, traderCopying, setTraderCopying } = useTraderCopyingStore()
  const isCopying = account && protocol ? traderCopying[account]?.includes(protocol) : false

  const saveTraderCopying = (address: string, protocol: ProtocolEnum) => {
    if (!traderCopying[address]?.includes(protocol)) {
      setTraderCopying({ ...traderCopying, [address]: [...traderCopying[address], protocol] })
    }
  }
  const removeTraderCopying = (address: string, protocol: ProtocolEnum) => {
    if (traderCopying[address]?.includes(protocol)) {
      setTraderCopying({
        ...traderCopying,
        [address]: traderCopying[address].filter((_protocol) => _protocol !== protocol),
      })
    }
  }
  return {
    isCopying,
    traderCopying,
    isLoading,
    saveTraderCopying,
    removeTraderCopying,
  }
}

export default useTraderCopying
