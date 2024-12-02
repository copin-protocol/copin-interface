import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  triggerKey: number
  changeTriggerKey: () => void
}

const useTriggerRenderTableBg = create<State>()(
  immer((set) => ({
    triggerKey: 1,
    changeTriggerKey: () =>
      set((state) => {
        state.triggerKey = state.triggerKey + 1
      }),
  }))
)

export default useTriggerRenderTableBg
