import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { getHlAccountInfo, getHlOpenOrders } from 'apis/hyperliquid'
import { parseHLOrderData, parseHLPositionData } from 'components/@position/helpers/hyperliquid'
import { CopyWalletData } from 'entities/copyWallet'
import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useSearchParams from 'hooks/router/useSearchParams'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

export type IFManagementContextValues = {
  account: string
  activeWallet: CopyWalletData | null
  hlWallets: CopyWalletData[] | undefined
  handleChangeActiveWallet: (wallet: CopyWalletData) => void
  hlPositions: PositionData[] | undefined
  hlOpenOrders: HlOrderData[] | undefined
  currentHlPosition: PositionData | undefined
  setCurrentHlPosition: (data: PositionData | undefined) => void
  loadingHlPositions: boolean
  reloadHlPositions: () => void
}
const IFManagementContext = createContext<IFManagementContextValues>({} as IFManagementContextValues)

export function IFManagementProvider({ children }: { children: ReactNode }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const { state: locationState } = useLocation<{ copyWalletId: string }>()
  const { loadingCopyWallets, hlWallets } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)
  const [currentHlPosition, setCurrentHlPosition] = useState<PositionData | undefined>()

  const account = useMemo(() => activeWallet?.hyperliquid?.apiKey ?? '', [activeWallet])

  useEffect(() => {
    if (!hlWallets?.length || loadingCopyWallets) return
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.USER_COPY_WALLET_IF)
    const walletStored = storedKey ? (JSON.parse(storedKey) as CopyWalletData) : null
    const foundWallet = hlWallets.find((data) => (walletStored ? data.id === walletStored.id : false))
    if (!!activeWallet) {
      if (foundWallet) return
      setActiveWallet(hlWallets[0])
    } else {
      setActiveWallet((prev) => {
        if (!!prev) return prev
        if (foundWallet) return foundWallet
        return hlWallets[0]
      })
    }
  }, [loadingCopyWallets, hlWallets])

  useEffect(() => {
    const paramWalletId = searchParams[URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]
    if (!hlWallets?.length || loadingCopyWallets) return
    const defaultWalletId = locationState?.copyWalletId || paramWalletId
    if (!defaultWalletId) return
    setActiveWallet((prev) => {
      const foundWallet = hlWallets.find((data) => data.id === defaultWalletId)
      if (foundWallet) return foundWallet
      return prev
    })
    setSearchParams({ [URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]: null })
  }, [loadingCopyWallets, locationState, hlWallets, searchParams, setSearchParams])
  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.USER_COPY_WALLET_IF, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])

  const {
    data,
    isLoading: loadingHlPositions,
    refetch: reloadHlPositions,
  } = useQuery([QUERY_KEYS.GET_IF_HYPERLIQUID_INFO, account], () => getHlAccountInfo({ user: account }), {
    enabled: !!account,
    retry: 0,
    refetchInterval: 30_000,
  })

  const { data: hlOpenOrders } = useQuery(
    [QUERY_KEYS.GET_IF_HYPERLIQUID_OPEN_ORDERS, account],
    () =>
      getHlOpenOrders({
        user: account,
      }),
    {
      enabled: !!account,
      retry: 0,
      refetchInterval: 30_000,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account, data })
      },
    }
  )

  const hlPositions = useMemo(() => {
    return parseHLPositionData({
      account,
      data: data?.assetPositions ?? [],
    }) as PositionData[]
  }, [account, data?.assetPositions])

  useEffect(() => {
    if (!hlPositions || hlPositions.length === 0) {
      setCurrentHlPosition(undefined)
      return
    }
    if (currentHlPosition) {
      const index = hlPositions.findIndex((pos) => pos.id === currentHlPosition.id)
      if (index < 0) {
        setCurrentHlPosition(hlPositions[0])
      }
      return
    }
    setCurrentHlPosition(hlPositions[0])
  }, [currentHlPosition, hlPositions])

  const contextValues = useMemo(() => {
    const result: IFManagementContextValues = {
      account,
      hlWallets,
      hlPositions,
      hlOpenOrders,
      activeWallet,
      handleChangeActiveWallet: setActiveWallet,
      currentHlPosition,
      setCurrentHlPosition,
      loadingHlPositions,
      reloadHlPositions,
    }
    return result
  }, [
    account,
    activeWallet,
    currentHlPosition,
    hlPositions,
    hlOpenOrders,
    hlWallets,
    loadingHlPositions,
    reloadHlPositions,
  ])

  return <IFManagementContext.Provider value={contextValues}>{children}</IFManagementContext.Provider>
}
const useIFManagementContext = () => {
  const values = useContext(IFManagementContext)
  if (!Object.keys(values).length) throw Error('useIFManagementContext need to be used in IFManagementProvider')
  return values
}
export default useIFManagementContext
