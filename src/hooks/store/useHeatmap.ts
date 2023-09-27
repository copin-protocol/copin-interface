import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ProtocolState {
  heatmapVisible: boolean
  setHeatmapVisible: (bool: boolean) => void
}

export const useHeatmapStore = create<ProtocolState>()(
  persist(
    immer((set) => ({
      heatmapVisible: false,
      setHeatmapVisible: (bool) =>
        set((state) => {
          state.heatmapVisible = bool
        }),
    })),
    {
      name: 'heatmap',
      getStorage: () => localStorage,
    }
  )
)
