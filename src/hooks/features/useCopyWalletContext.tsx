import { ReactNode, createContext, useContext, useMemo } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useMyProfile from 'hooks/store/useMyProfile'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import useWalletMargin from './useWalletMargin'

export interface CopyWalletContextData {
  myProfile: UserData | null
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  smartWallet: CopyWalletData | undefined
  bingXWallets: CopyWalletData[] | undefined
  reloadCopyWallets: () => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

export function CopyWalletProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useMyProfile()

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
  const { total, available } = useWalletMargin({ address: smartWallet?.smartWalletAddress })
  const normalizedCopyWallets = useMemo(
    () =>
      copyWallets?.map((wallet) => {
        switch (wallet.exchange) {
          case CopyTradePlatformEnum.BINGX:
            return wallet
          case CopyTradePlatformEnum.SYNTHETIX:
            return {
              ...wallet,
              balance: total?.num ?? 0,
              availableBalance: available?.num ?? 0,
            }
          default:
            return wallet
        }
      }),
    [available?.num, copyWallets, total?.num]
  )

  const contextValue: CopyWalletContextData = {
    myProfile,
    loadingCopyWallets,
    copyWallets: normalizedCopyWallets,
    smartWallet,
    bingXWallets,
    reloadCopyWallets,
  }

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
