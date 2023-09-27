import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ReferralState {
  userReferral: string | null
  setUserReferral: (referral: string | null) => void
}

const useUserReferralStore = create<ReferralState>()(
  persist(
    immer((set) => ({
      userReferral: null,
      setUserReferral: (data) =>
        set((state) => {
          state.userReferral = data
        }),
    })),
    {
      name: 'userReferral',
      getStorage: () => localStorage,
    }
  )
)

const useUserReferral = () => {
  const { userReferral, setUserReferral } = useUserReferralStore()

  return {
    userReferral,
    setUserReferral,
  }
}

export default useUserReferral
