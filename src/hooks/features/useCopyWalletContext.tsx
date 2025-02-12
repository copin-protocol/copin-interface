import { createContext, memo, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

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
  myProfile?: UserData | null
  loadingCopyWallets?: boolean
  loadingVaultCopyWallets?: boolean
  copyWallets?: CopyWalletData[]
  smartWallets?: CopyWalletData[]
  bingXWallets?: CopyWalletData[]
  dcpWallets?: CopyWalletData[]
  cexWallets?: CopyWalletData[]
  vaultWallets?: CopyWalletData[]
  hlWallets?: CopyWalletData[]
  embeddedWallets?: CopyWalletData[]
  embeddedWallet?: CopyWalletData
  reloadEmbeddedWallets?: () => void
  loadingEmbeddedWallets?: boolean
  reloadCopyWallets?: () => void
  reloadVaultCopyWallets?: () => void
  loadTotalSmartWallet?: () => void
  embeddedWalletInfo?: HlAccountData
  reloadEmbeddedWalletInfo?: () => void
  embeddedCopyTrades?: CopyTradeData[]
  reloadEmbeddedCopyTrades?: () => void
}

interface CopyWalletContextModifier {
  setState: (state: Partial<CopyWalletContextData>) => void
}

const CopyWalletContext = createContext<CopyWalletContextData>({} as CopyWalletContextData)

export const CopyWalletInitializer = memo(function CopyWalletInitializerComponent() {
  const { profile: myProfile, setIsNewUser } = useAuthContext()
  const [loadedTotalSmartWallet, setLoadedTotalSmartWallet] = useState(false)

  const enabledQueryByPaths = true

  // TODO: move to init and store in zustand store
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
      copyWallets,
      loadingWallets,
      loadingVaultCopyWallets,
      myProfile,
      vaultWallets,
      embeddedWallets,
      embeddedWalletInfo,
      embeddedCopyTrades,
    ]
  )

  const { setState } = useCopyWalletContext()
  useEffect(() => {
    setState(contextValue)
  }, [contextValue])

  return null
})

const useCopyWalletContext = create<CopyWalletContextData & CopyWalletContextModifier>()(
  immer((set) => ({
    setState(newState) {
      set((state) => {
        state = { ...state, ...newState }
        return state
      })
    },
  }))
)

export default useCopyWalletContext
