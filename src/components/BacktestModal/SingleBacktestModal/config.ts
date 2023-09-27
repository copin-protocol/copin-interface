import { produce } from 'immer'
import { v4 as uuid } from 'uuid'

import { BackTestResultData, RequestBackTestData } from 'entities/backTest'

export interface InstanceData {
  order: number
  status: 'setting' | 'testing' | 'tested'
  settings: RequestBackTestData | null
  result: BackTestResultData | null
}

export interface State {
  isFocusBacktest: boolean
  currentInstanceId: string | null
  instanceIds: string[]
  instancesMapping: Record<string, InstanceData>
}
export type ActionType =
  | {
      type: 'setSetting'
      payload: InstanceData['settings']
    }
  | {
      type: 'setResult'
      payload: InstanceData['result']
    }
  | {
      type: 'setStatus'
      payload: InstanceData['status']
    }
  | {
      type: 'setCurrentInstance'
      payload: string
    }
  | {
      type: 'addNewInstance'
    }
  | {
      type: 'removeInstance'
      payload: string
    }
  | {
      type: 'toggleFocusBacktest'
      payload?: boolean
    }
export const initialState = {} as State

export function initBacktestState(args?: {
  isFocusBacktest?: boolean
  status?: InstanceData['status']
  settings?: InstanceData['settings']
}) {
  const id = uuid()
  const state: State = {
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

export function reducer(state: State, action: ActionType) {
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
        const newInstance: InstanceData = { order: lastOrder, status: 'setting', settings: null, result: null }
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
