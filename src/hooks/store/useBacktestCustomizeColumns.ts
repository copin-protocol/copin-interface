import { Draft } from 'immer'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface BacktestCustomizeState<T> {
  visibleColumns: (keyof T)[]
  toggleVisibleColumn: (key: keyof T) => void
}

export const useBacktestCustomizeColumn = <T>(initialColumns: (keyof T)[]) =>
  create<BacktestCustomizeState<T>>()(
    persist(
      immer((set) => ({
        visibleColumns: initialColumns,
        toggleVisibleColumn: (key) =>
          set((state) => {
            if (state.visibleColumns.includes(key as Draft<keyof T>)) {
              state.visibleColumns = state.visibleColumns.filter((columnKey) => columnKey !== key)
            } else {
              state.visibleColumns.push(key as Draft<keyof T>)
            }
          }),
      })),
      {
        name: 'backtest-table-customize',
        version: 2,
        getStorage: () => localStorage,
        migrate: (persistedState, version) => {
          if (version < 2) {
            ;(persistedState as BacktestCustomizeState<T>).visibleColumns = initialColumns
            // if the stored value is in version lower, we set state to default
          }

          return persistedState as BacktestCustomizeState<T>
        },
      }
    )
  )()
