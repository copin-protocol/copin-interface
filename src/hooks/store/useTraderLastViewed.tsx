import { useMemo } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum } from 'utils/config/enums'

interface TraderViewed {
  protocol: ProtocolEnum
  address: string
}

interface TraderLastViewedState {
  traderLastViewed: TraderViewed[]
  setTraderLastViewed: (traders: TraderViewed[]) => void
}

const useTraderLastViewedStore = create<TraderLastViewedState>()(
  persist(
    immer((set) => ({
      traderLastViewed: [],
      setTraderLastViewed: (traders: TraderViewed[]) =>
        set((state) => {
          state.traderLastViewed = traders
        }),
    })),
    {
      name: 'trader-last-viewed',
      getStorage: () => localStorage,
    }
  )
)

const useTraderLastViewed = (protocol?: ProtocolEnum, address?: string) => {
  const { traderLastViewed, setTraderLastViewed } = useTraderLastViewedStore()

  const isLastViewed = useMemo(
    () =>
      protocol && address && traderLastViewed
        ? traderLastViewed.findIndex((e) => e.protocol === protocol && e.address === address) > -1
        : false,
    [address, protocol, traderLastViewed]
  )

  const addTraderLastViewed = (protocol: ProtocolEnum, address: string) => {
    const index = traderLastViewed?.findIndex((e) => e.protocol === protocol && e.address === address)
    const oldData = traderLastViewed ? [...traderLastViewed] : []
    if (index < 0) {
      if (traderLastViewed && traderLastViewed.length >= 5) {
        oldData.pop()
      }
      const newTrader: TraderViewed = {
        protocol,
        address,
      }
      setTraderLastViewed([newTrader, ...oldData])
    }
  }

  return {
    isLastViewed,
    traderLastViewed,
    addTraderLastViewed,
  }
}

export default useTraderLastViewed
