import { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useMyProfile from 'hooks/store/useMyProfile'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import useWalletMargin, { SmartWalletMargin } from './useWalletMargin'

export interface CopyWalletContextData {
  myProfile: UserData | null
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  smartWallet: CopyWalletData | undefined
  smartWalletMargin: SmartWalletMargin
  bingXWallets: CopyWalletData[] | undefined
  reloadCopyWallets: () => void
  loadTotalSmartWallet: () => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

export function CopyWalletProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useMyProfile()
  const [loadedTotalSmartWallet, setLoadedTotalSmartWallet] = useState(false)

  const {
    data: copyWallets,
    isLoading: loadingCopyWallets,
    refetch: reloadCopyWallets,
  } = useQuery([QUERY_KEYS.GET_COPY_WALLETS_LIST, myProfile?.id], () => getAllCopyWalletsApi(), {
    enabled: !!myProfile?.id,
    retry: 0,
  })

  const bingXWallets = copyWallets?.filter((w) => w.exchange === CopyTradePlatformEnum.BINGX)
  const smartWallet = copyWallets?.find((w) => w.exchange === CopyTradePlatformEnum.SYNTHETIX)
  const smartWalletMargin = useWalletMargin({
    address: smartWallet?.smartWalletAddress,
    totalIncluded: loadedTotalSmartWallet,
  })
  const normalizedCopyWallets = useMemo(
    () =>
      copyWallets?.map((wallet) => {
        switch (wallet.exchange) {
          case CopyTradePlatformEnum.BINGX:
            return wallet
          case CopyTradePlatformEnum.SYNTHETIX:
            return {
              ...wallet,
              balance: smartWalletMargin.total?.num ?? 0,
              availableBalance: smartWalletMargin.available?.num ?? 0,
            }
          default:
            return wallet
        }
      }),
    [smartWalletMargin.available, copyWallets, smartWalletMargin.total]
  )

  const contextValue: CopyWalletContextData = {
    myProfile,
    loadingCopyWallets,
    copyWallets: normalizedCopyWallets,
    smartWallet,
    bingXWallets,
    reloadCopyWallets,
    smartWalletMargin,
    loadTotalSmartWallet: () => setLoadedTotalSmartWallet(true),
  }

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
