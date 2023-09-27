// eslint-disable-next-line no-restricted-imports
import { WritableDraft } from 'immer/dist/internal'
import { v4 as uuid } from 'uuid'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { BackTestResultData, RequestBackTestData } from 'entities/backTest.d'
import { TraderData } from 'entities/trader'

export interface TestInstanceData {
  id: string
  listTrader: string[]
  settings: RequestBackTestData | null
  stage: 'selecting' | 'setting' | 'simulating' | 'simulated' | 'idle'
  childIds: string[]
  parentId: string | null
  homeId: string
  isVisible: boolean
  name: string
  backtestResult: BackTestResultData[]
}
interface HomeInstanceData {
  id: string
  tradersMapping: Record<string, TraderData>
  tradersByIds: string[]
  backtestInstancesMapping: Record<string, TestInstanceData>
  backtestInstancesByIds: string[]
  currentBacktestInstanceId: string | null
  rootBacktestInstancesByIds: string[]
  isShowedWarningDeleteTrader: boolean
  isTested: boolean
}
interface SelectBacktestTradersStore {
  homeInstancesByIds: string[]
  homeInstancesMapping: Record<string, HomeInstanceData>
  currentHomeInstanceId: string | null
  isFocusBacktest: boolean

  setCurrentHomeInstanceId: (homeId: string) => void
  addTraderToHomeInstance: (data: TraderData | TraderData[]) => void
  removeTraderFromHomeInstance: (data: TraderData | TraderData[]) => void
  removeHomeInstance: () => void
  updateHomeInstance: (args: { homeId: string; data: Partial<HomeInstanceData> }) => void
  addRootBacktestInstance: (args: { listTrader: string[] }) => void

  removeHomeInstanceById: (homeId: string) => void
  setCurrentBacktestInstanceId: (args: { homeId: string; backtestId: string | null }) => void

  addInstance: (instance: Omit<TestInstanceData, 'name'>) => void
  removeInstance: (args: { homeId: string; instanceId: string }) => void
  updateInstance: (instance: Required<Pick<TestInstanceData, 'id' | 'homeId'>> & Partial<TestInstanceData>) => void
  // hideInstance: (args: { homeId: string; instanceId: string }) => void

  toggleFocusBacktest: (value?: boolean) => void

  // getBacktestName: (args: { homeId: string; instanceId: string }) => string
  getCommonData: (args: { homeId?: string | null; instanceId?: string | null }) => {
    homeInstance: HomeInstanceData | null
    backtestInstance: TestInstanceData | null
  }
  resetStore: () => void
}

export const useSelectBacktestTraders = create<SelectBacktestTradersStore>()(
  immer((set, get) => ({
    homeInstancesByIds: [],
    homeInstancesMapping: {},
    currentHomeInstanceId: null,
    isFocusBacktest: false,
    addTraderToHomeInstance(data) {
      set((state) => {
        const listAddressTrader = Array.isArray(data) ? data.map((values) => values.account) : [data.account]
        const tradersMapping = Array.isArray(data)
          ? data.reduce<HomeInstanceData['tradersMapping']>((result, values) => {
              result[values.account] = values
              return result
            }, {})
          : { [data.account]: data }
        // Empty store
        if (!state.currentHomeInstanceId) {
          const homeInstanceId = uuid()
          const homeInstance: HomeInstanceData = {
            id: homeInstanceId,
            tradersMapping,
            tradersByIds: listAddressTrader,
            backtestInstancesMapping: {},
            backtestInstancesByIds: [],
            currentBacktestInstanceId: null,
            rootBacktestInstancesByIds: [],
            isTested: false,
            isShowedWarningDeleteTrader: false,
          }
          state.homeInstancesByIds = [...(state.homeInstancesByIds || []), homeInstanceId]
          state.homeInstancesMapping[homeInstanceId] = homeInstance
          state.currentHomeInstanceId = homeInstanceId
        } else {
          const { homeInstance } = getCommonData({ state, homeId: state.currentHomeInstanceId })
          if (!homeInstance) return
          const newListTradersByIds = Array.from(new Set([...homeInstance.tradersByIds, ...listAddressTrader]))
          // change to backtest group tab
          homeInstance.currentBacktestInstanceId = null
          homeInstance.tradersByIds = newListTradersByIds
          homeInstance.tradersMapping = { ...homeInstance.tradersMapping, ...tradersMapping }
        }
      })
    },
    // backtest group
    addRootBacktestInstance({ listTrader }) {
      set((state) => {
        const currentHomeId = state.currentHomeInstanceId
        if (!currentHomeId) return
        const homeInstance = state.homeInstancesMapping[currentHomeId]
        if (!homeInstance) return
        const rootBacktestInstanceId = uuid()
        const rootBacktestInstanceName = homeInstance.rootBacktestInstancesByIds.length + 1
        const rootBacktestInstance: TestInstanceData = {
          id: rootBacktestInstanceId,
          listTrader,
          settings: null,
          stage: 'setting',
          childIds: [],
          parentId: null,
          homeId: currentHomeId,
          isVisible: true,
          name: rootBacktestInstanceName.toString(),
          backtestResult: [],
        }
        homeInstance.rootBacktestInstancesByIds.push(rootBacktestInstanceId)
        homeInstance.backtestInstancesByIds.push(rootBacktestInstanceId)
        homeInstance.backtestInstancesMapping[rootBacktestInstanceId] = rootBacktestInstance
        homeInstance.currentBacktestInstanceId = rootBacktestInstanceId
      })
    },

    removeTraderFromHomeInstance(data) {
      set((state) => {
        const { homeInstance } = getCommonData({ state, homeId: state.currentHomeInstanceId })
        if (!homeInstance) return
        // change tab to backtest group
        homeInstance.currentBacktestInstanceId = null
        const listAddressTrader = Array.isArray(data) ? data.map((values) => values.account) : [data.account]
        const newListTradersByIds = homeInstance.tradersByIds.filter((traderId) => {
          const needRemove = listAddressTrader.includes(traderId)
          if (needRemove && !homeInstance.isTested) {
            delete homeInstance.tradersMapping[traderId]
          }
          return !needRemove
        })
        homeInstance.tradersByIds = newListTradersByIds
        // Reset backtest instances and re===move focus if only 1 instance home and list trader = 0
        if (state.homeInstancesByIds.length === 1 && !homeInstance.tradersByIds.length) {
          state.homeInstancesByIds = []
          state.homeInstancesMapping = {}
          state.currentHomeInstanceId = null
          state.isFocusBacktest = false
          return
        }
      })
    },
    updateHomeInstance({ homeId, data }) {
      set((state) => {
        const { homeInstance } = getCommonData({ state, homeId })
        if (!homeInstance) return
        state.homeInstancesMapping[homeId] = { ...homeInstance, ...data }
      })
    },
    removeHomeInstance() {
      set((state) => {
        const homeInstanceId = state.currentHomeInstanceId
        if (!homeInstanceId) return
        state.homeInstancesByIds = state.homeInstancesByIds.filter((id) => id !== homeInstanceId)
        delete state.homeInstancesMapping[homeInstanceId]
        if (!state.homeInstancesByIds.length) {
          state.homeInstancesByIds = []
          state.homeInstancesMapping = {}
          state.currentHomeInstanceId = null
          state.isFocusBacktest = false
          return
        }
        state.currentHomeInstanceId = state.homeInstancesByIds[0]
      })
    },
    removeHomeInstanceById(homeId) {
      set((state) => {
        state.homeInstancesByIds = state.homeInstancesByIds.filter((id) => id !== homeId)
        delete state.homeInstancesMapping[homeId]
        if (!state.homeInstancesByIds.length) {
          state.homeInstancesByIds = []
          state.homeInstancesMapping = {}
          state.currentHomeInstanceId = null
          state.isFocusBacktest = false
          return
        }
        state.currentHomeInstanceId = state.homeInstancesByIds[0]
      })
    },
    setCurrentHomeInstanceId(homeId) {
      set((state) => {
        state.currentHomeInstanceId = homeId
      })
    },
    setCurrentBacktestInstanceId({ homeId, backtestId }) {
      set((state) => {
        const homeInstance = state.homeInstancesMapping[homeId]
        if (!homeInstance) return
        homeInstance.currentBacktestInstanceId = backtestId
      })
    },
    addInstance(instance) {
      set((state) => {
        const { homeInstance } = getCommonData({ state, homeId: instance.homeId })
        if (!homeInstance) return
        const newInstance: TestInstanceData = { ...instance, name: '' }
        const parentId = instance.parentId
        if (!!parentId) {
          // fixed name of instance
          const parentInstance = homeInstance.backtestInstancesMapping[parentId]
          if (!!parentInstance) {
            const lastChildId = parentInstance.childIds.at(-1)
            let instanceName = '1'
            if (!!lastChildId) {
              const lastChild = homeInstance.backtestInstancesMapping[lastChildId]
              if (lastChild) {
                const lastName = lastChild.name.split(' - ').at(-1)
                const lastNameNum = Number(lastName)
                instanceName = (lastNameNum + 1).toString()
              }
            }
            parentInstance.childIds = [...(parentInstance.childIds || []), instance.id]
            newInstance.name = `${parentInstance.name} - ${instanceName}`
          }
        }
        homeInstance.backtestInstancesByIds.push(instance.id)
        homeInstance.backtestInstancesMapping[instance.id] = newInstance
        homeInstance.currentBacktestInstanceId = instance.id
      })
    },
    removeInstance({ homeId, instanceId }) {
      set((state) => {
        const { homeInstance, backtestInstance } = getCommonData({ state, homeId, instanceId })
        if (!homeInstance || !backtestInstance) return
        const instancesMapping = homeInstance.backtestInstancesMapping
        const parentId = backtestInstance.parentId
        const parentInstance = instancesMapping[parentId ?? '']
        if (parentInstance) {
          const childIds = parentInstance.childIds ?? []
          parentInstance.childIds = childIds.filter((id) => id !== instanceId)
          if (parentInstance.childIds.every((id) => !instancesMapping[id])) {
            parentInstance.childIds = []
          }
        }
        homeInstance.backtestInstancesByIds = homeInstance.backtestInstancesByIds.filter((id) => id !== instanceId)
        homeInstance.currentBacktestInstanceId = homeInstance.backtestInstancesByIds[0] ?? null
        delete homeInstance.backtestInstancesMapping[instanceId]
        if (
          !parentId &&
          homeInstance.rootBacktestInstancesByIds.every((id) => !homeInstance.backtestInstancesMapping[id])
        ) {
          homeInstance.rootBacktestInstancesByIds = []
        }
      })
    },
    updateInstance(instanceData) {
      set((state) => {
        const { homeInstance, backtestInstance } = getCommonData({
          state,
          homeId: instanceData.homeId,
          instanceId: instanceData.id,
        })
        if (!homeInstance || !backtestInstance) return
        homeInstance.backtestInstancesMapping[instanceData.id] = { ...backtestInstance, ...instanceData }
      })
    },
    toggleFocusBacktest(value) {
      set((state) => {
        if (typeof value === 'boolean') {
          state.isFocusBacktest = value
          return
        }
        state.isFocusBacktest = !state.isFocusBacktest
      })
    },
    resetStore() {
      set((state) => {
        state.homeInstancesByIds = []
        state.homeInstancesMapping = {}
        state.currentHomeInstanceId = null
        state.isFocusBacktest = false
      })
    },
    getCommonData({ homeId, instanceId }) {
      const store = get()
      const homeInstance = store.homeInstancesMapping[homeId ?? ''] ?? null
      const backtestInstance = homeInstance?.backtestInstancesMapping?.[instanceId ?? ''] ?? null
      return { homeInstance, backtestInstance }
    },
  }))
)

function getCommonData({
  state,
  homeId,
  instanceId,
}: {
  state: WritableDraft<SelectBacktestTradersStore>
  homeId: string | null
  instanceId?: string | null
}): { homeInstance: WritableDraft<HomeInstanceData> | null; backtestInstance: WritableDraft<TestInstanceData> | null } {
  const homeInstance = state.homeInstancesMapping[homeId ?? ''] ?? null
  const backtestInstance = homeInstance?.backtestInstancesMapping?.[instanceId ?? ''] ?? null
  return { homeInstance, backtestInstance }
}
