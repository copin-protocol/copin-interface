import { useEffect, useReducer } from 'react'

import { parseStorageData } from 'utils/helpers/transform'

type State = {
  selectedSelections: string[] | null // null equal select all
}
export default function useSelectMultipleState({
  storage,
  storageKey,
  allSelection,
}: {
  storageKey: string
  storage: Storage
  allSelection: string[]
}) {
  const [state, dispatch] = useReducer(
    (
      state: State,
      action:
        | { type: 'setSelections'; payload: string[] | null }
        | { type: 'addSelections'; payload: string[] }
        | { type: 'removeSelections'; payload: string[] }
        | { type: 'reCheckSelections'; payload: { value: string[]; type: 'addNewer' | 'removeNewer' | 'keepPrevious' } }
        | { type: 'toggleSelection'; payload: string }
    ) => {
      const newState = { ...state }
      switch (action.type) {
        case 'setSelections':
          newState.selectedSelections = action.payload
          if (newState.selectedSelections?.length === allSelection.length) newState.selectedSelections = null
          break
        case 'addSelections':
          newState.selectedSelections = Array.from(new Set([...(newState.selectedSelections ?? []), ...action.payload]))
          if (newState.selectedSelections?.length === allSelection.length) newState.selectedSelections = null
          break
        case 'removeSelections': {
          if (newState.selectedSelections == null) break
          newState.selectedSelections = newState.selectedSelections.filter(
            (address) => !action.payload.includes(address)
          )
          break
        }
        case 'reCheckSelections': {
          if (action.payload.type === 'addNewer') {
            newState.selectedSelections = Array.from(
              new Set([...(newState.selectedSelections ?? []), ...action.payload.value])
            )
          } else if (action.payload.type === 'removeNewer' && !!newState.selectedSelections) {
            newState.selectedSelections = newState.selectedSelections.filter(
              (address) => !action.payload.value.includes(address)
            )
          } else if (action.payload.type === 'keepPrevious' && !!newState.selectedSelections) {
            newState.selectedSelections = newState.selectedSelections.filter((address) =>
              action.payload.value.includes(address)
            )
          }
          if (newState.selectedSelections?.length === allSelection.length) newState.selectedSelections = null
          break
        }
        case 'toggleSelection': {
          if (newState.selectedSelections == null) {
            newState.selectedSelections = allSelection.filter((v) => v !== action.payload)
            break
          }
          const isSelected = newState.selectedSelections.includes(action.payload)
          if (isSelected) {
            newState.selectedSelections = newState.selectedSelections?.filter((address) => action.payload !== address)
          } else {
            newState.selectedSelections = Array.from(new Set([...newState.selectedSelections, action.payload]))
          }
          if (newState.selectedSelections?.length === allSelection.length) newState.selectedSelections = null
          break
        }
        default:
          break
      }
      return newState
    },
    { selectedSelections: null },
    () => {
      const storageData = parseStorageData<State>({ storage, storageKey })
      if (storageData) return storageData
      return {
        selectedSelections: null,
      }
    }
  )

  useEffect(() => {
    const dataStorage = JSON.stringify(state)
    sessionStorage.setItem(storageKey, dataStorage)
  }, [state, storageKey])

  return { state, dispatch }
}
