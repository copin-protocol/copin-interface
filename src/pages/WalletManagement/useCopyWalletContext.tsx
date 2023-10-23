import { ReactNode, createContext, useContext } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useMyProfile from 'hooks/store/useMyProfile'
import { QUERY_KEYS } from 'utils/config/keys'

export interface CopyWalletContextData {
  myProfile: UserData | null
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  reloadCopyWallets: () => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

export function CopyWalletProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useMyProfile()

  const {
    data: copyWallets,
    isLoading: loadingCopyWallets,
    refetch: reloadCopyWallets,
  } = useQuery([QUERY_KEYS.GET_COPY_WALLETS_LIST], () => getAllCopyWalletsApi(), {
    enabled: !!myProfile,
    retry: 0,
  })

  const contextValue: CopyWalletContextData = {
    myProfile,
    loadingCopyWallets,
    copyWallets,
    reloadCopyWallets,
  }

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
