import { ReactNode, createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { getCopyTradeSettingsListApi } from 'apis/copyTradeApis'
import { checkEmbeddedWalletApi, getAllCopyWalletsApi, getEmbeddedWalletsApi } from 'apis/copyWalletApis'
import { getHlAccountInfo } from 'apis/hyperliquid'
import { getAllVaultCopyWalletsApi } from 'apis/vaultApis'
import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { HlAccountData } from 'entities/hyperliquid'
import { UserData } from 'entities/user'
import { useAuthContext } from 'hooks/web3/useAuth'
import { DCP_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { logEventLite } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

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
  embeddedWallets: CopyWalletData[] | undefined
  embeddedWallet: CopyWalletData | undefined
  reloadEmbeddedWallets: () => void
  loadingEmbeddedWallets: boolean
  reloadCopyWallets: () => void
  reloadVaultCopyWallets: () => void
  loadTotalSmartWallet: () => void
  embeddedWalletInfo: HlAccountData | undefined
  reloadEmbeddedWalletInfo: () => void
  embeddedCopyTrades: CopyTradeData[] | undefined
  reloadEmbeddedCopyTrades: () => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

// const EXCLUDING_PATH = [
//   ROUTES.STATS.path,
//   ROUTES.LEADERBOARD.path_prefix,
//   ROUTES.FAVORITES.path,
//   ROUTES.SUBSCRIPTION.path,
//   ROUTES.USER_SUBSCRIPTION.path,
//   ROUTES.ALERT_LIST.path,
//   ROUTES.REFERRAL.path,
//   ROUTES.COMPARING_TRADERS.path,
//   ROUTES.OPEN_INTEREST.path_prefix,
//   ROUTES.POSITION_DETAILS.path,
// ]

export function CopyWalletProvider({ children }: { children: ReactNode }) {
  const { profile: myProfile, setIsNewUser } = useAuthContext()
  const [loadedTotalSmartWallet, setLoadedTotalSmartWallet] = useState(false)

  const enabledQueryByPaths = true
  // Remove this logic for check new trader
  // const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH, true)
  // const {
  //   data: embeddedWallets,
  //   isLoading: loadingEmbeddedWallets,
  //   refetch: reloadEmbeddedWallets,
  // } = useQuery([QUERY_KEYS.GET_EMBEDDED_COPY_WALLETS, myProfile?.id], () => getEmbeddedWalletsApi(), {
  //   enabled: false,
  //   retry: 0,
  // })

  // const {
  //   data: copyWallets,
  //   isLoading: loadingCopyWallets,
  //   refetch: reloadCopyWallets,
  // } = useQuery(['adsjflkdjsfa'], () => getAllCopyWalletsApi(), {
  //   enabled: !!myProfile?.id && enabledQueryByPaths,
  //   retry: 0,
  // })

  const {
    data: wallets,
    isLoading: loadingWallets,
    refetch: reloadWallets,
  } = useQuery(
    [QUERY_KEYS.GET_COPY_WALLETS_LIST, myProfile?.id],
    () => Promise.all([getEmbeddedWalletsApi(), getAllCopyWalletsApi()]),
    {
      enabled: !!myProfile?.id && enabledQueryByPaths,
      retry: 0,
      keepPreviousData: true,
    }
  )
  const [embeddedWallets, copyWallets] = wallets ?? []

  const { mutate: checkEmbeddedWallet } = useMutation(checkEmbeddedWalletApi, {
    onSuccess: () => {
      reloadWallets()
    },
  })

  useLayoutEffect(() => {
    if (loadingWallets || !myProfile?.id) return
    if (embeddedWallets?.length) return
    checkEmbeddedWallet()
    setIsNewUser(true)
    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_START_ONBOARDING })
  }, [wallets])

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

  const embeddedWalletAddress = embeddedWallets?.[0]?.hyperliquid?.embeddedWallet

  const { data: embeddedWalletInfo, refetch: reloadEmbeddedWalletInfo } = useQuery(
    [QUERY_KEYS.EMBEDDED_WALLET_INFO, embeddedWalletAddress],
    () => getHlAccountInfo({ user: embeddedWalletAddress || '' }),
    {
      enabled: !!embeddedWalletAddress,
      refetchInterval: 10_000,
    }
  )

  const embbededWalletId = embeddedWallets?.[0]?.id
  const queryEmbeddedCopyTradesParams = useMemo(
    () => ({
      copyWalletId: embbededWalletId,
      accounts: undefined,
      status: undefined,
    }),
    [embbededWalletId]
  )
  const { data: embeddedCopyTrades, refetch: reloadEmbeddedCopyTrades } = useQuery(
    [QUERY_KEYS.GET_EMBEDDED_COPY_TRADES, queryEmbeddedCopyTradesParams],

    () => getCopyTradeSettingsListApi(queryEmbeddedCopyTradesParams),
    {
      enabled: !!embbededWalletId,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const contextValue: CopyWalletContextData = useMemo(
    () => ({
      isDA,
      dcpWallets,
      cexWallets,
      myProfile,
      loadingCopyWallets: loadingWallets,
      loadingVaultCopyWallets,
      copyWallets,
      smartWallets,
      bingXWallets,
      vaultWallets,
      hlWallets,
      embeddedWallet: embeddedWallets?.[0],
      embeddedWallets,
      loadingEmbeddedWallets: loadingWallets,
      reloadEmbeddedWallets: reloadWallets,
      embeddedWalletInfo,
      reloadEmbeddedWalletInfo,
      reloadCopyWallets: reloadWallets,
      reloadVaultCopyWallets,
      loadTotalSmartWallet: () => setLoadedTotalSmartWallet(true),
      embeddedCopyTrades,
      reloadEmbeddedCopyTrades,
    }),
    [
      bingXWallets,
      cexWallets,
      copyWallets,
      dcpWallets,
      hlWallets,
      isDA,
      loadingWallets,
      loadingVaultCopyWallets,
      myProfile,
      reloadWallets,
      reloadVaultCopyWallets,
      smartWallets,
      vaultWallets,
      embeddedWallets,
      embeddedWalletInfo,
      reloadEmbeddedWalletInfo,
      embeddedCopyTrades,
      reloadEmbeddedCopyTrades,
    ]
  )

  return <CopyWalletContext.Provider value={contextValue}>{children}</CopyWalletContext.Provider>
}

const useCopyWalletContext = () => useContext(CopyWalletContext)
export default useCopyWalletContext
