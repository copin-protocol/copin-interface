import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum } from 'utils/config/enums'
import { WorkerBalanceMessage } from 'utils/types'

interface TraderBalanceStore {
  balances: { [traderAndProtocol: string]: WorkerBalanceMessage['balances'] }
  traderToGetBalance: { address: string; protocol: ProtocolEnum }[] | null
  setBalances: (args: { [traderAndProtocol: string]: WorkerBalanceMessage['balances'] }) => void
  setTraderToGetBalance: (args: { address: string; protocol: ProtocolEnum }[]) => void
}

const useTraderBalanceStore = create<TraderBalanceStore>()(
  immer((set) => ({
    balances: {},
    traderToGetBalance: null,
    setBalances: (args) =>
      set((state) => {
        state.balances = { ...state.balances, ...args }
      }),
    setTraderToGetBalance: (args) =>
      set((state) => {
        state.traderToGetBalance = args
      }),
  }))
)
export default useTraderBalanceStore
