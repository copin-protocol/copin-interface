import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface WhatIfState {
  nextHours?: number
  setNextHours: (data?: number) => void
}

export const useWhatIfStore = create<WhatIfState>()(
  persist(
    immer((set) => ({
      nextHours: undefined,
      setNextHours: (data) =>
        set((state) => {
          state.nextHours = data
        }),
    })),
    {
      name: 'what-if',
      getStorage: () => localStorage,
    }
  )
)
