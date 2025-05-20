import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { UserData } from 'entities/user.d'

interface MyProfileState {
  myProfile: UserData | null
  isAuthenticated: boolean | null
  setMyProfile: (myProfile: UserData | null) => void
}

const useMyProfileStore = create<MyProfileState>()(
  immer((set) => ({
    myProfile: null,
    isAuthenticated: null,
    setMyProfile: (data: UserData | null) =>
      // @ts-ignore
      set({ myProfile: data, isAuthenticated: data ? true : false }),
  }))
)

export default useMyProfileStore
