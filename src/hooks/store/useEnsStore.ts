import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface EnsState {
  ensNames: Record<string, string>
  setEnsName: (address: string, name: string | null) => void
  getEnsName: (address: string) => string | null
}

export const useEnsStore = create<EnsState>()(
  persist(
    immer((set, get) => ({
      ensNames: {},
      setEnsName: (address, name) =>
        set((state) => {
          const normalizedAddress = address.toLowerCase()
          if (name != null) {
            state.ensNames[normalizedAddress] = name
          } else {
            delete state.ensNames[normalizedAddress]
          }
        }),
      getEnsName: (address) => {
        const normalizedAddress = address.toLowerCase()
        return get().ensNames[normalizedAddress] || null
      },
    })),
    {
      name: 'ens-names',
      getStorage: () => localStorage,
    }
  )
)
