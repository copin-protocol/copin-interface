import { useEffect, useReducer } from 'react'

import { parseStorageData } from 'utils/helpers/transform'

type State = {
  selectedTraders: string[]
}
export default function useSelectTradersState({ storage, storageKey }: { storageKey: string; storage: Storage }) {
  const [state, dispatch] = useReducer(
    (
      state: State,
      action:
        | { type: 'setTraders'; payload: string[] }
        | { type: 'addTraders'; payload: string[] }
        | { type: 'removeTraders'; payload: string[] }
        | { type: 'reCheckTraders'; payload: string[] }
        | { type: 'toggleTrader'; payload: string }
    ) => {
      const newState = { ...state }
      switch (action.type) {
        case 'setTraders':
          newState.selectedTraders = action.payload
          break
        case 'addTraders':
          newState.selectedTraders = Array.from(new Set([...newState.selectedTraders, ...action.payload]))
          break
        case 'removeTraders':
          newState.selectedTraders = newState.selectedTraders.filter((address) => !action.payload.includes(address))
          break
        case 'reCheckTraders':
          newState.selectedTraders = newState.selectedTraders.filter((address) => action.payload.includes(address))
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
      const storageData = parseStorageData<State>({ storage, storageKey })
      if (storageData) return storageData
      return {
        selectedTraders: [],
      }
    }
  )

  useEffect(() => {
    const dataStorage = JSON.stringify(state)
    sessionStorage.setItem(storageKey, dataStorage)
  }, [state, storageKey])

  return { state, dispatch }
}
