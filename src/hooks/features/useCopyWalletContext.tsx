import { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import { getAllVaultCopyWalletsApi } from 'apis/vaultApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import useMyProfile from 'hooks/store/useMyProfile'
import { DCP_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export interface CopyWalletContextData {
  isDA?: boolean
  myProfile: UserData | null
  loadingCopyWallets: boolean
  loadingVaultCopyWallets: boolean
  copyWallets: CopyWalletData[] | undefined
  smartWallets: CopyWalletData[] | undefined
  bingXWallets: CopyWalletData[] | undefined
  dcpWallets: CopyWalletData[] | undefined
  cexWallets: CopyWalletData[] | undefined
  vaultWallets: CopyWalletData[] | undefined
  hlWallets: CopyWalletData[] | undefined
  reloadCopyWallets: () => void
  reloadVaultCopyWallets: () => void
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

  const {
    data: vaultWallets,
    isLoading: loadingVaultCopyWallets,
    refetch: reloadVaultCopyWallets,
  } = useQuery([QUERY_KEYS.GET_VAULT_COPY_WALLETS_LIST, myProfile?.id], () => getAllVaultCopyWalletsApi(), {
    enabled: !!myProfile?.id && enabledQueryByPaths,
    retry: 0,
  })
  const isDA = !!vaultWallets?.length

  const bingXWallets = useMemo(
    () => copyWallets?.filter((w) => w.exchange === CopyTradePlatformEnum.BINGX),
    [copyWallets]
  )
  const smartWallets = useMemo(
    () =>
      copyWallets?.filter(
        (w) => w.exchange === CopyTradePlatformEnum.SYNTHETIX_V2 || w.exchange === CopyTradePlatformEnum.GNS_V8
      ),
    [copyWallets]
  )
  const dcpWallets = useMemo(() => copyWallets?.filter((w) => DCP_EXCHANGES.includes(w.exchange)), [copyWallets])
  const cexWallets = useMemo(() => copyWallets?.filter((w) => !DCP_EXCHANGES.includes(w.exchange)), [copyWallets])
  const hlWallets = useMemo(
    () => copyWallets?.filter((w) => w.exchange === CopyTradePlatformEnum.HYPERLIQUID),
    [copyWallets]
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

  const contextValue: CopyWalletContextData = useMemo(
    () => ({
      isDA,
      dcpWallets,
      cexWallets,
      myProfile,
      loadingCopyWallets,
      loadingVaultCopyWallets,
      copyWallets,
      smartWallets,
      bingXWallets,
      vaultWallets,
      hlWallets,
      reloadCopyWallets,
      reloadVaultCopyWallets,
      loadTotalSmartWallet: () => setLoadedTotalSmartWallet(true),
    }),
    [
      bingXWallets,
      cexWallets,
      copyWallets,
      dcpWallets,
      hlWallets,
      isDA,
      loadingCopyWallets,
      loadingVaultCopyWallets,
      myProfile,
      reloadCopyWallets,
      reloadVaultCopyWallets,
      smartWallets,
      vaultWallets,
    ]
  )

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
