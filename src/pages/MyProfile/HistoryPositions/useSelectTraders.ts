import { useReducer } from 'react'

export type SelectionState = {
  selectedTraders: string[]
  deletedTraders: string[]
  allTraders: string[]
  version: number
}

const defaultState: SelectionState = {
  selectedTraders: [],
  deletedTraders: [],
  allTraders: [],
  version: 1,
}

export default function useSelectTraders(storageData: string | null) {
  return useReducer(
    (
      state: SelectionState,
      action:
        | { type: 'setTraders'; payload: string[] }
        | { type: 'toggleTrader'; payload: string }
        | { type: 'setDeletedTraders'; payload: string[] }
        | { type: 'setAllTraders' }
        | { type: 'setState'; payload: Partial<Omit<SelectionState, 'version'>> }
    ) => {
      let newState = { ...state }
      switch (action.type) {
        case 'setState':
          newState = { ...newState, ...action.payload }
          break
        case 'setTraders':
          newState.selectedTraders = action.payload
          break
        case 'setAllTraders':
          newState.selectedTraders = state.allTraders
          break
        case 'setDeletedTraders':
          newState.deletedTraders = action.payload
          break
        case 'toggleTrader':
          const isSelected = state.selectedTraders.includes(action.payload)
          if (isSelected) {
            newState.selectedTraders = newState.selectedTraders.filter((address) => action.payload !== address)
          } else {
            newState.selectedTraders = Array.from(new Set([...newState.selectedTraders, action.payload]))
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

export type DispatchSelectTraders = ReturnType<typeof useSelectTraders>['1']
