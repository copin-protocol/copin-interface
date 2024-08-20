import { produce } from 'immer'
import { v4 as uuid } from 'uuid'

import { BacktestActionType, BacktestInstanceData, BacktestState } from '../types'

export const initialState = {} as BacktestState

export function initBacktestState(args?: {
  isFocusBacktest?: boolean
  status?: BacktestInstanceData['status']
  settings?: BacktestInstanceData['settings']
}) {
  const id = uuid()
  const state: BacktestState = {
    isFocusBacktest: args?.isFocusBacktest ?? false,
    currentInstanceId: id,
    instanceIds: [id],
    instancesMapping: {
      [id]: {
        order: 1,
        status: args?.status ?? 'setting',
        settings: args?.settings ?? null,
        result: null,
      },
    },
  }
  return state
}

export function reducer(state: BacktestState, action: BacktestActionType) {
  return produce(state, (drafState) => {
    switch (action.type) {
      case 'setSetting':
        if (!drafState.currentInstanceId) return
        drafState.instancesMapping[drafState.currentInstanceId].settings = action.payload
        break
      case 'setResult':
        if (!drafState.currentInstanceId) return
        drafState.instancesMapping[drafState.currentInstanceId].result = action.payload
        break
      case 'setStatus':
        if (!drafState.currentInstanceId) return
        drafState.instancesMapping[drafState.currentInstanceId].status = action.payload
        break
      case 'setCurrentInstance':
        drafState.currentInstanceId = action.payload
        break
      case 'addNewInstance':
        const id = uuid()
        const lastId = drafState.instanceIds.at(-1)
        const lastOrder = lastId ? drafState.instancesMapping[lastId].order + 1 : 1
        const newInstance: BacktestInstanceData = { order: lastOrder, status: 'setting', settings: null, result: null }
        drafState.currentInstanceId = id
        drafState.instanceIds.push(id)
        drafState.instancesMapping[id] = newInstance
        break
      case 'removeInstance':
        if (drafState.instanceIds.length === 1) {
          drafState.instancesMapping[action.payload] = {
            order: 1,
            status: 'setting',
            settings: null,
            result: null,
          }
          drafState.isFocusBacktest = false
          return
        }
        drafState.instanceIds = drafState.instanceIds.filter((id) => id !== action.payload)
        drafState.currentInstanceId = drafState.instanceIds[0]
        delete drafState.instancesMapping[action.payload]
        break
      case 'toggleFocusBacktest':
        drafState.isFocusBacktest = action.payload ?? !drafState.isFocusBacktest
        break
      default:
        break
    }
  })
}
