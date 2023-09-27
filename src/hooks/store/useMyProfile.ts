import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { UserData } from 'entities/user.d'

interface MyProfileState {
  myProfile: UserData | null
  setMyProfile: (myProfile: UserData | null) => void
}

const useMyProfileStore = create<MyProfileState>()(
  immer((set) => ({
    myProfile: null,
    setMyProfile: (data: UserData | null) => set({ myProfile: data }),
  }))
)

export default useMyProfileStore
