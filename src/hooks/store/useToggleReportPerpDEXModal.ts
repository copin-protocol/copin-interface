import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useMyProfileStore from 'hooks/store/useMyProfile'

interface ReportPerpDEXModaltate {
  isOpen: boolean
  perpdex: PerpDEXSourceResponse | null
  setIsOpen: (bool: boolean) => void
  setPerpDEX: (perpdex: PerpDEXSourceResponse | null) => void
}

export const useToggleModal = create<ReportPerpDEXModaltate>()(
  persist(
    immer((set) => ({
      isOpen: false,
      perpdex: null,
      setIsOpen: (bool) =>
        set((state) => {
          state.isOpen = bool
        }),
      setPerpDEX: (value: PerpDEXSourceResponse | null) =>
        set((state) => {
          state.perpdex = value
        }),
    })),
    {
      name: 'toggle-report-perp-dex-modal',
      getStorage: () => localStorage,
    }
  )
)

export const useToggleReportPerpDEXModal = () => {
  const { myProfile } = useMyProfileStore()
  const { isOpen, setIsOpen, perpdex, setPerpDEX } = useToggleModal()
  const handleClickLogin = useClickLoginButton()

  const isLoggedIn = !!myProfile

  const checkIsEligible = () => {
    if (!isLoggedIn) {
      handleClickLogin()
      return false
    }
    return true
  }

  const handleOpen = (enable: boolean) => {
    if (checkIsEligible()) {
      setIsOpen(enable)
    }
  }

  return { isOpen, setIsOpen: handleOpen, perpdex, setPerpDEX }
}
