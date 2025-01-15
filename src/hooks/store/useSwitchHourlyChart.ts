import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { HOURLY_CHART_OPTIONS } from 'utils/config/constants'

interface HourlyChartState {
  chartOption: { id: string; text: string }
  setChartOption: (option: { id: string; text: string }) => void
}

export const useHourlyChartStore = create<HourlyChartState>()(
  persist(
    immer((set) => ({
      chartOption: HOURLY_CHART_OPTIONS[0],
      setChartOption: (option) =>
        set((state) => {
          state.chartOption = option
        }),
    })),
    {
      name: 'hourly-chart-option',
      getStorage: () => localStorage,
    }
  )
)
