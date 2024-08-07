import { ReactNode, createContext, useContext, useState } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import useMyProfile from 'hooks/store/useMyProfile'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export interface CopyWalletContextData {
  myProfile: UserData | null
  loadingCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  smartWallets: CopyWalletData[] | undefined
  bingXWallets: CopyWalletData[] | undefined
  reloadCopyWallets: () => void
  loadTotalSmartWallet: () => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.LEADERBOARD.path_prefix,
  ROUTES.FAVORITES.path,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.ALERT_LIST.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
  ROUTES.OPEN_INTEREST.path_prefix,
  ROUTES.POSITION_DETAILS.path,
]
export function CopyWalletProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useMyProfile()
  const [loadedTotalSmartWallet, setLoadedTotalSmartWallet] = useState(false)

  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH, true)
  const {
    data: copyWallets,
    isLoading: loadingCopyWallets,
    refetch: reloadCopyWallets,
  } = useQuery([QUERY_KEYS.GET_COPY_WALLETS_LIST, myProfile?.id], () => getAllCopyWalletsApi(), {
    enabled: !!myProfile?.id && enabledQueryByPaths,
    retry: 0,
  })

  const bingXWallets = copyWallets?.filter((w) => w.exchange === CopyTradePlatformEnum.BINGX)
  const smartWallets = copyWallets?.filter(
    (w) => w.exchange === CopyTradePlatformEnum.SYNTHETIX_V2 || w.exchange === CopyTradePlatformEnum.GNS_V8
  )

  // const normalizedCopyWallets = useMemo(
  //   () =>
  //     copyWallets?.map((wallet) => {
  //       switch (wallet.exchange) {
  //         case CopyTradePlatformEnum.BINGX:
  //           return wallet
  //         case CopyTradePlatformEnum.SYNTHETIX:
  //           return {
  //             ...wallet,
  //             // balance: smartWalletFund.total?.num ?? 0,
  //             // availableBalance: smartWalletFund.available?.num ?? 0,
  //           }
  //         default:
  //           return wallet
  //       }
  //     }),
  //   [copyWallets]
  // )

  const contextValue: CopyWalletContextData = {
    myProfile,
    loadingCopyWallets,
    copyWallets,
    smartWallets,
    bingXWallets,
    reloadCopyWallets,
    loadTotalSmartWallet: () => setLoadedTotalSmartWallet(true),
  }

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
