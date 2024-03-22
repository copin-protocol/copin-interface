import { useEffect, useReducer, useRef } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { PositionStatusEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'

import { checkEqualWallets, toggleSelectedItem } from '../helpers'

export type SelectionState = {
  selectedStatus: PositionStatusEnum[]
  selectedWallets: CopyWalletData[]
  allWallets: CopyWalletData[]
  selectedTraders: string[]
  deletedTraders: string[]
  allTraders: string[]
  version: number
}

const defaultState: SelectionState = {
  selectedStatus: [PositionStatusEnum.OPEN, PositionStatusEnum.CLOSE],
  selectedWallets: [],
  allWallets: [],
  selectedTraders: [],
  deletedTraders: [],
  allTraders: [],
  version: 1,
}

export default function useFilterHistory() {
  const { copyWallets } = useCopyWalletContext()
  const state = useReducer(
    (
      state: SelectionState,
      action:
        | { type: 'setTraders'; payload: string[] }
        | { type: 'toggleTrader'; payload: string }
        | { type: 'setDeletedTraders'; payload: string[] }
        | { type: 'setAllTraders' }
        | { type: 'setState'; payload: Partial<Omit<SelectionState, 'version'>> }
        | { type: 'setWallets'; payload: CopyWalletData[] }
        | { type: 'toggleWallet'; payload: CopyWalletData }
        | { type: 'setAllWallets' }
        | { type: 'toggleStatus'; payload: PositionStatusEnum }
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
          newState.selectedTraders = toggleSelectedItem({
            item: action.payload,
            selected: state.selectedTraders,
            checkSelected(source, target) {
              return source === target
            },
          })
          break
        case 'setWallets':
          newState.selectedWallets = action.payload
          break
        case 'setAllWallets':
          newState.selectedWallets = state.allWallets
          break
        case 'toggleWallet':
          newState.selectedWallets = toggleSelectedItem({
            item: action.payload,
            selected: state.selectedWallets,
            checkSelected(source, target) {
              return source.id === target.id
            },
          })
          break
        case 'toggleStatus':
          if (state.selectedStatus?.length === 1 && action.payload === state.selectedStatus?.[0]) {
            break
          } else {
            newState.selectedStatus = toggleSelectedItem({
              item: action.payload,
              selected: state.selectedStatus,
              checkSelected(source, target) {
                return source === target
              },
            })
          }
          break
        default:
          break
      }
      return newState
    },
    {},
    () => {
      const storageData = sessionStorage.getItem(STORAGE_KEYS.MY_HISTORY_TRADERS)
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
    sessionStorage.setItem(STORAGE_KEYS.MY_HISTORY_TRADERS, dataStorage)
  }, [state[0]])

  return state
}

export type DispatchSelectTraders = ReturnType<typeof useFilterHistory>['1']
