import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { parseStorageData } from 'utils/helpers/transform'

export type ProfileState = {
  copyWallets: CopyWalletData[] | undefined
  loadingCopyWallets: boolean
  activeWallet: CopyWalletData | null
  setActiveWallet: (wallet: CopyWalletData | null) => void
  myProfile: UserData | null
  vaultWallets: CopyWalletData[] | undefined
  dcpWallets: CopyWalletData[] | undefined
  cexWallets: CopyWalletData[] | undefined
  activeWalletMapping: {
    cex: undefined | CopyWalletData
    dex: undefined | CopyWalletData
    vault: undefined | CopyWalletData
  }
  changeActiveWallet: (props: {
    cex: undefined | CopyWalletData
    dex: undefined | CopyWalletData
    vault: undefined | CopyWalletData
  }) => void
}

// TODO: Check if this hook can change to context for all child page
export default function useProfileState(): ProfileState {
  const { searchParams, setSearchParams } = useSearchParams()
  const { state } = useLocation<{ copyWalletId: string }>()
  const { copyWallets, loadingCopyWallets, dcpWallets, cexWallets, vaultWallets } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)
  const [activeWalletMapping, setActiveWalletMapping] = useState<ProfileState['activeWalletMapping']>({
    cex: undefined,
    dex: undefined,
    vault: undefined,
  })

  // TODO: need to check these two useEffect
  // First when load wallet, parse storage data and pass to active wallet
  useEffect(() => {
    if (!copyWallets?.length || loadingCopyWallets || Object.values(activeWalletMapping).some((v) => !!v)) return
    const walletStored = parseStorageData<ProfileState['activeWalletMapping']>({
      storage: sessionStorage,
      storageKey: STORAGE_KEYS.USER_COPY_WALLET,
    })
    if (walletStored == null) return
    setActiveWalletMapping((prev) => {
      const newData = { ...prev }
      const foundWalletCex = cexWallets?.find((data) => (walletStored ? data.id === walletStored.cex?.id : false))
      const foundWalletDex = dcpWallets?.find((data) => (walletStored ? data.id === walletStored.dex?.id : false))
      const foundWalletVault = vaultWallets?.find((data) => (walletStored ? data.id === walletStored.vault?.id : false))
      if (foundWalletCex) newData.cex = foundWalletCex
      if (foundWalletDex) newData.dex = foundWalletDex
      if (foundWalletDex) newData.vault = foundWalletVault
      return newData
    })
  }, [loadingCopyWallets])

  useEffect(() => {
    const paramWalletId = searchParams[URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]
    if (!copyWallets?.length || loadingCopyWallets) return
    const defaultWalletId = state?.copyWalletId || paramWalletId
    if (!defaultWalletId) return
    setActiveWalletMapping((prev) => {
      const newData = { ...prev }
      const foundWalletCex = cexWallets?.find((data) => data.id === defaultWalletId)
      const foundWalletDex = dcpWallets?.find((data) => data.id === defaultWalletId)
      const foundWalletVault = vaultWallets?.find((data) => data.id === defaultWalletId)
      if (foundWalletCex) newData.cex = foundWalletCex
      if (foundWalletDex) newData.dex = foundWalletDex
      if (foundWalletVault) newData.vault = foundWalletVault
      return newData
    })
  }, [loadingCopyWallets, state])
  const changeActiveWallet = useCallback((props: ProfileState['activeWalletMapping']) => {
    setActiveWalletMapping((prev) => {
      return { ...prev, ...props }
    })
  }, [])

  // Old logic ================>
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
  }, [loadingCopyWallets])

  useEffect(() => {
    const paramWalletId = searchParams[URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]
    if (!copyWallets?.length || loadingCopyWallets) return
    const defaultWalletId = state?.copyWalletId || paramWalletId
    if (!defaultWalletId) return
    setActiveWallet((prev) => {
      const foundWallet = copyWallets.find((data) => data.id === defaultWalletId)
      if (foundWallet) return foundWallet
      return prev
    })
    setSearchParams({ [URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]: null })
  }, [loadingCopyWallets, state])

  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_WALLET, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])
  const { myProfile } = useMyProfileStore()
  // Old logic <================

  return {
    vaultWallets,
    dcpWallets,
    cexWallets,
    activeWalletMapping,
    changeActiveWallet,
    myProfile,
    copyWallets,
    loadingCopyWallets,
    activeWallet,
    setActiveWallet,
  }
}
