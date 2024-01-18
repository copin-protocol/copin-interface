import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ParamsState {
  marketsPage: Record<string, string>
  marketPage: Record<string, string>
  overallPage: Record<string, string>
  setMarketsPageParams: (params: Record<string, string>) => void
  setMarketPageParams: (params: Record<string, string>) => void
  setOverallPageParams: (params: Record<string, string>) => void
}

const useSearchParamsState = create<ParamsState>()(
  immer((set) => ({
    marketsPage: {},
    marketPage: {},
    overallPage: {},
    setMarketsPageParams: (params) => set({ marketsPage: params }),
    setMarketPageParams: (params) => set({ marketPage: params }),
    setOverallPageParams: (params) => set({ overallPage: params }),
  }))
)

export default useSearchParamsState
