import { useReducer } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'

export type SelectionState = {
  selectedWallets: CopyWalletData[]
  allWallets: CopyWalletData[]
  selectedCopyTrades: CopyTradeData[]
  allCopyTrades: CopyTradeData[]
  version: number
}

const defaultState: SelectionState = {
  selectedWallets: [],
  allWallets: [],
  selectedCopyTrades: [],
  allCopyTrades: [],
  version: 1,
}

export default function useFilterActivities(storageData: string | null) {
  return useReducer(
    (
      state: SelectionState,
      action:
        | { type: 'setWallets'; payload: CopyWalletData[] }
        | { type: 'toggleWallet'; payload: CopyWalletData }
        | { type: 'setAllWallets' }
        | { type: 'setCopyTrades'; payload: CopyTradeData[] }
        | { type: 'toggleCopyTrade'; payload: CopyTradeData }
        | { type: 'setAllCopyTrades' }
        | { type: 'setState'; payload: Partial<Omit<SelectionState, 'version'>> }
    ) => {
      let newState = { ...state }
      switch (action.type) {
        case 'setState':
          newState = { ...newState, ...action.payload }
          break
        case 'setWallets':
          newState.selectedWallets = action.payload
          break
        case 'setAllWallets':
          newState.selectedWallets = state.allWallets
          break
        case 'toggleWallet':
          const isSelected = state.selectedWallets.findIndex((e) => e.id === action.payload.id) !== -1
          if (isSelected) {
            newState.selectedWallets = newState.selectedWallets.filter((e) => action.payload.id !== e.id)
          } else {
            newState.selectedWallets = Array.from(new Set([...newState.selectedWallets, action.payload]))
          }
          break
        case 'setCopyTrades':
          newState.selectedCopyTrades = action.payload
          break
        case 'setAllCopyTrades':
          newState.selectedCopyTrades = state.allCopyTrades
          break
        case 'toggleCopyTrade':
          const isCopyTradeSelected = state.selectedCopyTrades.findIndex((e) => e.id === action.payload.id) !== -1
          if (isCopyTradeSelected) {
            newState.selectedCopyTrades = newState.selectedCopyTrades.filter((e) => action.payload.id !== e.id)
          } else {
            newState.selectedCopyTrades = Array.from(new Set([...newState.selectedCopyTrades, action.payload]))
          }
          break
        default:
          break
      }
      return newState
    },
    {},
    () => {
      if (!!storageData) {
        try {
          const _storageData = JSON.parse(storageData) as SelectionState
          if (!_storageData.version || _storageData.version < 1) {
            return defaultState
          }
          return _storageData
        } catch {}
      }
      return defaultState
    }
  )
}

export type DispatchFilterActivities = ReturnType<typeof useFilterActivities>['1']
