import { memo, useEffect } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

type TraderCopying = Record<string, Record<string, string[]>>

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
const useInitTraderCopying = () => {
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH)
  const { setTraderCopying, setLoading } = useTraderCopyingStore()
  const { allCopyTrades } = useAllCopyTrades({ enabled: enabledQueryByPaths })

  useEffect(() => {
    const copyingTrader: TraderCopying | undefined = allCopyTrades?.reduce((result, copyTrade) => {
      if (copyTrade.status === CopyTradeStatusEnum.RUNNING) {
        const accounts = (copyTrade.multipleCopy ? copyTrade.accounts ?? [] : [copyTrade.account]).filter((e) => !!e)
        accounts.forEach((account) => {
          if (!result[account]) {
            result[account] = {}
          }
          if (!result[account][copyTrade.protocol]) {
            result[account][copyTrade.protocol] = []
          }
          result[account][copyTrade.protocol] = Array.from(
            new Set([...result[account][copyTrade.protocol], copyTrade.copyWalletId])
          )
        })
      }
      return result
    }, {} as TraderCopying)
    if (!copyingTrader) return
    setTraderCopying(copyingTrader)
    setLoading(true)
  }, [allCopyTrades])
}

export const InitTraderCopying = memo(function InitTraderCopyingMemo() {
  useInitTraderCopying()
  return null
})

const useTraderCopying = (account: string | undefined, protocol: ProtocolEnum | undefined) => {
  const { isLoading, traderCopying, setTraderCopying } = useTraderCopyingStore()
  const isCopying = account && protocol ? !!traderCopying[account]?.[protocol]?.length : false

  const saveTraderCopying = (address: string, protocol: ProtocolEnum, copyWalletId: string) => {
    if (!traderCopying[address]?.[protocol]?.length) {
      setTraderCopying({
        ...traderCopying,
        [address]: {
          ...traderCopying[address],
          [protocol]: Array.from(new Set([...(traderCopying[address]?.[protocol] ?? []), copyWalletId])),
        },
      })
    }
  }
  const removeTraderCopying = (address: string, protocol: ProtocolEnum, copyWalletId: string) => {
    if (!!traderCopying[address]?.[protocol]?.length) {
      const updatedProtocols = traderCopying[address]?.[protocol]?.filter((id) => id !== copyWalletId) ?? []
      if (updatedProtocols.length === 0) {
        const { [protocol]: _, ...restProtocols } = traderCopying[address] || {}
        setTraderCopying({
          ...traderCopying,
          [address]: restProtocols,
        })
      } else {
        setTraderCopying({
          ...traderCopying,
          [address]: {
            ...traderCopying[address],
            [protocol]: updatedProtocols,
          },
        })
      }
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
