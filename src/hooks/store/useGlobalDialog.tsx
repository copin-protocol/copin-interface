import { ReactNode } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface DialogContent {
  id?: string
  hasLoading?: boolean
  title?: ReactNode
  description?: ReactNode
  body?: ReactNode
}
interface GlobalDialogState {
  dialog: DialogContent | undefined
  showDialog: (data: DialogContent) => void
  hideDialog: () => void
  updateDialog: (data: DialogContent) => void
}

const useGlobalDialog = create<GlobalDialogState>()(
  immer((set) => ({
    dialog: undefined,
    showDialog: (data: DialogContent) =>
      set({
        dialog: data,
      }),
    hideDialog: () => set({ dialog: undefined }),
    updateDialog: (data: DialogContent) =>
      set((state) => {
        state.dialog = { ...state.dialog, ...data }
        return state
      }),
  }))
)

export default useGlobalDialog
