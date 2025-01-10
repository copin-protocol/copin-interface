import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface OnboardingStore {
  openModal: boolean
  setOpenModal: (isOpen: boolean) => void
  forceOpenModal: () => void
  actionType: 'forced' | null
}

const useOnboardingStore = create<OnboardingStore>()(
  immer((set) => ({
    openModal: false,
    actionType: null,
    setOpenModal: (isOpen) =>
      set((state) => {
        state.openModal = isOpen
        if (!isOpen) state.actionType = null
      }),
    forceOpenModal: () =>
      set((state) => {
        state.openModal = true
        state.actionType = 'forced'
      }),
  }))
)

export default useOnboardingStore
