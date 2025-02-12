import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface CustomizeColumnsState {
  columnKeys: string[]
  setColumnKeys: (data: string[]) => void
  resetDefault: () => void
  toggleVisibleColumn: (key: string) => void
}

const createCustomizeColumnsStore = (options: { name: string; version: number; defaultColumns: string[] }) => {
  return create<CustomizeColumnsState>()(
    persist(
      immer((set) => ({
        columnKeys: options.defaultColumns,
        setColumnKeys: (data: string[]) =>
          set((state) => {
            state.columnKeys = data
          }),
        toggleVisibleColumn: (key: string) => {
          set((state) => {
            if (state.columnKeys.includes(key)) {
              state.columnKeys = state.columnKeys.filter((v) => v !== key)
            } else {
              state.columnKeys.push(key)
            }
          })
        },
        resetDefault: () => {
          set((state) => {
            state.columnKeys = options.defaultColumns
          })
        },
      })),
      {
        name: options.name,
        version: options.version,
        getStorage: () => localStorage,
        migrate: (persistedState, version) => {
          if (version < options.version) {
            // Reset to defaults if version is outdated
            ;(persistedState as CustomizeColumnsState).columnKeys = options.defaultColumns
          }
          return persistedState as CustomizeColumnsState
        },
      }
    )
  )
}

export default createCustomizeColumnsStore
