import { ReactNode } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface LoadingContent {
  title?: ReactNode
  description?: ReactNode
  body?: ReactNode
}
interface GlobalLoadingState {
  loading: LoadingContent | undefined
  showLoading: (data: LoadingContent) => void
  hideLoading: () => void
  updateLoading: (data: LoadingContent) => void
}

const useGlobalLoading = create<GlobalLoadingState>()(
  immer((set) => ({
    loading: undefined,
    showLoading: (data: LoadingContent) =>
      set({
        loading: { title: data.title, description: data.description, body: data.body },
      }),
    hideLoading: () => set({ loading: undefined }),
    updateLoading: (data: LoadingContent) =>
      set((state) => {
        state.loading = { ...state.loading, ...data }
        return state
      }),
  }))
)

export default useGlobalLoading
