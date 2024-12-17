import isEqual from 'lodash/isEqual'
import { useEffect, useReducer, useRef } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { STORAGE_KEYS } from 'utils/config/keys'

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

export default function useFilterActivities() {
  const { copyWallets: _copyWallets, vaultWallets } = useCopyWalletContext()
  const copyWallets = [...(_copyWallets ?? []), ...(vaultWallets ?? [])]

  const state = useReducer(
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
          const isSelected = state.selectedWallets?.findIndex((e) => e.id === action.payload.id) !== -1
          if (isSelected) {
            newState.selectedWallets = newState.selectedWallets?.filter((e) => action.payload.id !== e.id)
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
          const isCopyTradeSelected = state.selectedCopyTrades?.findIndex((e) => e.id === action.payload.id) !== -1
          if (isCopyTradeSelected) {
            newState.selectedCopyTrades = newState.selectedCopyTrades?.filter((e) => action.payload.id !== e.id)
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
      const storageData = sessionStorage.getItem(STORAGE_KEYS.MY_ACTIVITIES)
      if (!!storageData) {
        try {
          const _storageData = JSON.parse(storageData) as SelectionState
          if (copyWallets && !checkEqualWallets(_storageData.allWallets, copyWallets)) {
            _storageData.allWallets === copyWallets
            _storageData.selectedWallets = copyWallets
          }
          if (!_storageData.version || _storageData.version < 1) {
            return defaultState
          }
          return _storageData
        } catch {}
      }
      return defaultState
    }
  )
  const prevAllWallets = useRef(state[0].allWallets)
  useEffect(() => {
    if (!copyWallets?.length || checkEqualWallets(prevAllWallets.current, copyWallets)) return
    prevAllWallets.current = copyWallets ?? []
    state[1]({
      type: 'setState',
      payload: {
        selectedWallets: copyWallets,
        allWallets: copyWallets,
      },
    })
  }, [copyWallets])

  useEffect(() => {
    const dataStorage = JSON.stringify(state[0])
    sessionStorage.setItem(STORAGE_KEYS.MY_ACTIVITIES, dataStorage)
  }, [state[0]])

  return state
}

function checkEqualWallets(source: CopyWalletData[] | undefined, target: CopyWalletData[] | undefined) {
  if (!source?.length || !target?.length) return false
  const sourceIds = source.map((wallet) => wallet.id)
  const targetIds = target.map((wallet) => wallet.id)
  return isEqual(sourceIds, targetIds)
}

export type DispatchFilterActivities = ReturnType<typeof useFilterActivities>['1']
