import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { STORAGE_KEYS } from 'utils/config/keys'

export type ProfileState = {
  copyWallets: CopyWalletData[] | undefined
  loadingCopyWallets: boolean
  activeWallet: CopyWalletData | null
  setActiveWallet: (wallet: CopyWalletData | null) => void
  myProfile: UserData | null
}

export default function useProfileState(): ProfileState {
  const { state } = useLocation<{ copyWalletId: string }>()
  const { copyWallets, loadingCopyWallets } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)
  useEffect(() => {
    if (!copyWallets?.length || loadingCopyWallets || !!activeWallet) return
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.MY_COPY_WALLET)
    const walletStored = storedKey ? (JSON.parse(storedKey) as CopyWalletData) : null
    setActiveWallet((prev) => {
      if (!!prev) return prev
      const foundWallet = copyWallets.find((data) => (walletStored ? data.id === walletStored.id : false))
      if (foundWallet) return foundWallet
      return copyWallets[0]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCopyWallets])

  useEffect(() => {
    if (!copyWallets?.length || loadingCopyWallets || !state) return
    setActiveWallet((prev) => {
      const foundWallet = copyWallets.find((data) => (state?.copyWalletId ? data.id === state.copyWalletId : false))
      if (foundWallet) return foundWallet
      return prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCopyWallets, state])

  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_WALLET, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])
  const { myProfile } = useMyProfileStore()

  return {
    myProfile,
    copyWallets,
    loadingCopyWallets,
    activeWallet,
    setActiveWallet,
  }
}
