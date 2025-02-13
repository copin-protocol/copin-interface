import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { getCopyTradeSettingsListApi, getMyCopyTradersApi } from 'apis/copyTradeApis'
import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useSearchParams from 'hooks/router/useSearchParams'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import useSelectMultiple from '../useSelectMultiple'
import useSelectTradersState from '../useSelectTradersState'

type CEXManagementContextValues = {
  activeWallet: CopyWalletData | null
  isLoadingCopyWallets: boolean
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
  allCopyTrades: CopyTradeData[] | undefined
  copyTrades: CopyTradeData[] | undefined
  cexWallets: CopyWalletData[] | undefined
  handleAddTrader: (address: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  handleToggleProtocol: (option: ProtocolEnum) => void
  handleToggleStatus: (option: CopyTradeStatusEnum) => void
  isLoadingCopyTrades: boolean
  isLoadingTraders: boolean
  isToggleAllProtocol: boolean
  listTraderAddresses: string[]
  selectedProtocol: ProtocolEnum[]
  selectedStatus: CopyTradeStatusEnum[]
  selectedTraders: string[]
  toggleAllProtocol: (isToggledAll: boolean) => void
  handleToggleTrader: (address: string) => void
  handleChangeActiveWallet: (wallet: CopyWalletData) => void
}
const CEXManagementContext = createContext<CEXManagementContextValues>({} as CEXManagementContextValues)

export function CEXManagementProvider({ children }: { children: ReactNode }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const { state: locationState } = useLocation<{ copyWalletId: string }>()
  const { loadingCopyWallets, cexWallets, myProfile } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)
  useEffect(() => {
    if (!cexWallets?.length || loadingCopyWallets || !!activeWallet) return
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.USER_COPY_WALLET_CEX)
    const walletStored = storedKey ? (JSON.parse(storedKey) as CopyWalletData) : null
    setActiveWallet((prev) => {
      if (!!prev) return prev
      const foundWallet = cexWallets.find((data) => (walletStored ? data.id === walletStored.id : false))
      if (foundWallet) return foundWallet
      return cexWallets[0]
    })
  }, [loadingCopyWallets])
  useEffect(() => {
    const paramWalletId = searchParams[URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]
    if (!cexWallets?.length || loadingCopyWallets) return
    const defaultWalletId = locationState?.copyWalletId || paramWalletId
    if (!defaultWalletId) return
    setActiveWallet((prev) => {
      const foundWallet = cexWallets.find((data) => data.id === defaultWalletId)
      if (foundWallet) return foundWallet
      return prev
    })
    setSearchParams({ [URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]: null })
  }, [loadingCopyWallets, locationState])
  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.USER_COPY_WALLET_CEX, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])

  const {
    state: { selectedTraders },
    dispatch,
  } = useSelectTradersState({
    storage: sessionStorage,
    storageKey: STORAGE_KEYS.USER_COPY_TRADERS_CEX,
  })
  const prevResTraderList = useRef<string[]>([])
  const copyWalletId = activeWallet?.id
  const copyExchange = activeWallet?.exchange
  const prevWalletId = useRef(activeWallet?.id)
  const { data: tradersData, isLoading: isLoadingTraders } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_TRADERS, copyExchange, copyWalletId],
    () => getMyCopyTradersApi({ exchange: copyExchange, copyWalletId }),
    {
      enabled: !!copyExchange,
      onSuccess: (data) => {
        const resAddresses = data.map((traderData) => traderData.account)
        if (
          resAddresses.length === prevResTraderList.current.length &&
          resAddresses.every((address) => prevResTraderList.current.includes(address))
        ) {
          return
        }
        prevResTraderList.current = resAddresses
        if (!selectedTraders?.length || prevWalletId.current !== copyWalletId) {
          prevWalletId.current = copyWalletId
          dispatch({ type: 'setTraders', payload: resAddresses })
          return
        }
        dispatch({ type: 'reCheckTraders', payload: resAddresses })
      },
    }
  )

  const listTraderAddresses = useMemo(() => {
    return tradersData?.flatMap((trader) => [trader.account, ...(trader.accounts || [])]) ?? []
  }, [tradersData])

  const getAllCopiesParams = useMemo(
    () => ({
      copyWalletId,
      accounts: listTraderAddresses,
      status: undefined,
    }),
    [listTraderAddresses, copyWalletId]
  )
  const { data: allCopyTrades } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, getAllCopiesParams],

    () => getCopyTradeSettingsListApi(getAllCopiesParams),
    {
      enabled: !!myProfile?.id && !!listTraderAddresses.length,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const {
    selected: selectedStatus,
    checkIsSelected: checkIsStatusChecked,
    handleToggleSelect: handleToggleStatus,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_COPIES_STATUS,
    defaultSelected: [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED],
  })
  const {
    selected: selectedProtocol,
    checkIsSelected: checkIsProtocolChecked,
    handleToggleSelect: handleToggleProtocol,
    toggleAll: toggleAllProtocol,
    isToggledAll: isToggleAllProtocol,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_COPIES_PROTOCOL,
    defaultSelected: ALLOWED_COPYTRADE_PROTOCOLS,
    toggleLastItem: true,
  })
  const queryParams = useMemo(
    () => ({
      copyWalletId,
      accounts: selectedTraders,
      status: selectedStatus.length === 1 ? selectedStatus[0] : undefined,
      protocols: selectedProtocol,
    }),
    [selectedStatus, selectedProtocol, selectedTraders, copyWalletId]
  )
  const prevResCopyTradeList = useRef<string[]>([])
  const { data: copyTrades, isFetching: isLoadingCopyTrades } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, queryParams, selectedStatus, myProfile?.id],

    () => getCopyTradeSettingsListApi(queryParams),
    {
      enabled: !!myProfile?.id && !!selectedTraders.length && !!allCopyTrades,
      retry: 0,
      keepPreviousData: true,
      onSuccess: (data) => {
        const resIds = data.map((copyTrade) => copyTrade.id)
        if (
          resIds.length === prevResCopyTradeList.current.length &&
          resIds.every((address) => prevResCopyTradeList.current.includes(address))
        ) {
          return
        }
        prevResCopyTradeList.current = resIds
      },
    }
  )

  const handleSelectAllTraders = useCallback(
    (isSelectedAll: boolean) => {
      if (!listTraderAddresses.length) return
      if (!isSelectedAll) {
        dispatch({ type: 'setTraders', payload: [] })
      } else {
        dispatch({ type: 'setTraders', payload: listTraderAddresses })
      }
    },
    [listTraderAddresses]
  )
  const handleToggleTrader = useCallback((address: string) => {
    dispatch({ type: 'toggleTrader', payload: address })
  }, [])
  const handleAddTrader = useCallback((address: string) => {
    dispatch({ type: 'addTraders', payload: [address] })
  }, [])

  const contextValues = useMemo(() => {
    const result: CEXManagementContextValues = {
      isLoadingCopyWallets: !!loadingCopyWallets,
      cexWallets,
      allCopyTrades,
      copyTrades,
      isLoadingCopyTrades,
      selectedStatus,
      handleToggleStatus,
      checkIsStatusChecked,
      selectedProtocol,
      handleToggleProtocol,
      toggleAllProtocol,
      isToggleAllProtocol,
      checkIsProtocolChecked,
      selectedTraders,
      handleSelectAllTraders,
      handleAddTrader,
      handleToggleTrader,
      isLoadingTraders,
      listTraderAddresses,
      activeWallet,
      handleChangeActiveWallet: setActiveWallet,
    }
    return result
  }, [
    loadingCopyWallets,
    activeWallet,
    checkIsProtocolChecked,
    checkIsStatusChecked,
    allCopyTrades,
    copyTrades,
    cexWallets,
    handleAddTrader,
    handleToggleTrader,
    handleSelectAllTraders,
    handleToggleProtocol,
    handleToggleStatus,
    isLoadingCopyTrades,
    isLoadingTraders,
    isToggleAllProtocol,
    listTraderAddresses,
    selectedProtocol,
    selectedStatus,
    selectedTraders,
    toggleAllProtocol,
    setActiveWallet,
  ])

  return <CEXManagementContext.Provider value={contextValues}>{children}</CEXManagementContext.Provider>
}
const useCEXManagementContext = () => {
  const values = useContext(CEXManagementContext)
  if (!Object.keys(values).length) throw Error('useCEXManagementContext need to be used in CEXManagementProvider')
  return values
}
export default useCEXManagementContext
