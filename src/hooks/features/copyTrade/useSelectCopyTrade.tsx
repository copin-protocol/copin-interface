import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { CopyTradeData } from 'entities/copyTrade'

export type SelectCopyTradeState = {
  prevListCopyTrade: CopyTradeData[]
  listCopyTrade: CopyTradeData[]
  allCopyTrades: CopyTradeData[]
  isSelectedFn: (copyTrade: CopyTradeData) => boolean
  isSelectAll: boolean
  toggleCopyTrade: (copyTrade: CopyTradeData) => void
  toggleSelectAll: (isSelectAll?: boolean) => void
  setAllCopyTrades: (copyTrades: CopyTradeData[]) => void
  reset: () => void
  recheckCopyTrades: (copyTrades: CopyTradeData[]) => void
  setPrevListCopyTrade: (copyTrades: CopyTradeData[]) => void
}

export const useSelectCopyTrade = create<SelectCopyTradeState>()(
  immer((set, get) => ({
    prevListCopyTrade: [],
    listCopyTrade: [],
    allCopyTrades: [],
    isSelectedFn: (copyTrade) => {
      return !!get().listCopyTrade.find((v) => v.id === copyTrade.id)
    },
    isSelectAll: false,
    toggleCopyTrade: (copyTrade) => {
      set((state) => {
        const isSelected = state.listCopyTrade.find((v) => v.id === copyTrade.id)
        state.listCopyTrade = isSelected
          ? state.listCopyTrade.filter((v) => v.id !== copyTrade.id)
          : [...state.listCopyTrade, copyTrade]
        state.isSelectAll = checkIsSelectedAllByIds(state.listCopyTrade, state.allCopyTrades)
      })
    },
    toggleSelectAll: (isSelectAll) => {
      set((state) => {
        if (isSelectAll != null ? !isSelectAll : state.isSelectAll) {
          state.isSelectAll = false
          state.listCopyTrade = []
        }
        if (isSelectAll != null ? isSelectAll : !state.isSelectAll) {
          state.isSelectAll = true
          state.listCopyTrade = state.allCopyTrades
        }
      })
    },
    setAllCopyTrades: (ids) => {
      set((state) => {
        state.allCopyTrades = ids
      })
    },
    setPrevListCopyTrade: (copyTrades) => {
      set((state) => {
        state.prevListCopyTrade = copyTrades
      })
    },
    reset: () => {
      set((state) => {
        state.allCopyTrades = []
        state.listCopyTrade = []
        state.isSelectAll = false
      })
    },
    recheckCopyTrades: (copyTrades) => {
      set((state) => {
        state.allCopyTrades = copyTrades
        state.listCopyTrade = state.listCopyTrade.filter((v) => !!state.allCopyTrades.find((_v) => _v.id === v.id))
      })
    },
  }))
)

const checkIsSelectedAllByIds = (source: CopyTradeData[], target: CopyTradeData[]) => {
  if (!source.length || !target.length) return false
  const sourceKey = source
    .map((v) => v.id)
    .sort()
    .join()
  const targetKey = target
    .map((v) => v.id)
    .sort()
    .join()
  return sourceKey === targetKey
}
