import { formatUnits } from 'ethers/lib/utils'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { getMyCopyOrdersApi } from 'apis/copyPositionApis'
import { getMyCopyTradersApi } from 'apis/copyTradeApis'
import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import { getVaultCopyTradeSettingsListApi } from 'apis/vaultApis'
import { CopyOrderData, CopyPositionData, CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useSearchParams from 'hooks/router/useSearchParams'
import { useContract } from 'hooks/web3/useContract'
import useContractQuery from 'hooks/web3/useContractQuery'
import { DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS, QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

import { OnchainPositionData } from '../OpeningPositions/schema'
import useSelectMultiple from '../useSelectMultiple'
import useSelectTradersState from '../useSelectTradersState'

export type VaultManagementContextValues = {
  activeWallet: CopyWalletData | null
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
  allCopyTrades: CopyTradeData[] | undefined
  copyTrades: CopyTradeData[] | undefined
  vaultWallets: CopyWalletData[] | undefined
  handleAddTrader: (address: string) => void
  handleRefresh: () => void
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
  onchainPositions: OnchainPositionData[] | undefined
  positionsMapping: { [key: string]: CopyPositionData } | undefined
  currentOnchainPosition: OnchainPositionData | undefined
  setCurrentOnchainPosition: (data: OnchainPositionData | undefined) => void
  currentOnchainOrders: CopyOrderData[] | undefined
  loadingOnchainPositions: boolean
  loadingCurrentOnchainOrders: boolean
  reloadOnchainPositions: () => void
  reloadCurrentOnchainOrders: () => void
}
const VaultManagementContext = createContext<VaultManagementContextValues>({} as VaultManagementContextValues)

export function VaultManagementProvider({ children }: { children: ReactNode }) {
  const refetchQueries = useRefetchQueries()
  const { searchParams, setSearchParams } = useSearchParams()
  const { state: locationState } = useLocation<{ copyWalletId: string }>()
  const { loadingVaultCopyWallets, vaultWallets, myProfile } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)

  useEffect(() => {
    if (!vaultWallets?.length || loadingVaultCopyWallets) return
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.USER_COPY_WALLET_DCP)
    const walletStored = storedKey ? (JSON.parse(storedKey) as CopyWalletData) : null
    const foundWallet = vaultWallets.find((data) => (walletStored ? data.id === walletStored.id : false))
    if (!!activeWallet) {
      if (foundWallet) return
      setActiveWallet(vaultWallets[0])
    } else {
      setActiveWallet((prev) => {
        if (!!prev) return prev
        if (foundWallet) return foundWallet
        return vaultWallets[0]
      })
    }
  }, [loadingVaultCopyWallets, vaultWallets])
  useEffect(() => {
    const paramWalletId = searchParams[URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]
    if (!vaultWallets?.length || loadingVaultCopyWallets) return
    const defaultWalletId = locationState?.copyWalletId || paramWalletId
    if (!defaultWalletId) return
    setActiveWallet((prev) => {
      const foundWallet = vaultWallets.find((data) => data.id === defaultWalletId)
      if (foundWallet) return foundWallet
      return prev
    })
    setSearchParams({ [URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID]: null })
  }, [loadingVaultCopyWallets, locationState, vaultWallets])
  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.USER_COPY_WALLET_VAULT, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])

  const {
    state: { selectedTraders },
    dispatch,
  } = useSelectTradersState({
    storage: sessionStorage,
    storageKey: STORAGE_KEYS.USER_COPY_TRADERS_VAULT,
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
    [QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS, getAllCopiesParams, myProfile?.id],

    () => getVaultCopyTradeSettingsListApi(getAllCopiesParams),
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
    paramKey: URL_PARAM_KEYS.MY_VAULT_STATUS,
    defaultSelected: [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED],
  })
  const {
    selected: selectedProtocol,
    checkIsSelected: checkIsProtocolChecked,
    handleToggleSelect: handleToggleProtocol,
    toggleAll: toggleAllProtocol,
    isToggledAll: isToggleAllProtocol,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_VAULT_PROTOCOL,
    defaultSelected: DCP_SUPPORTED_PROTOCOLS,
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
    [QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS, queryParams, selectedStatus, myProfile?.id],

    () => getVaultCopyTradeSettingsListApi(queryParams),
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
      if (isSelectedAll) {
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

  const handleRefresh = useCallback(() => {
    refetchQueries([
      QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS,
      QUERY_KEYS.USE_GET_ALL_COPY_TRADES,
      QUERY_KEYS.GET_TRADER_VOLUME_COPY,
    ])
  }, [refetchQueries])

  const gainsContract = useContract({
    contract: {
      address: CONTRACT_ADDRESSES[ARBITRUM_CHAIN][CONTRACT_QUERY_KEYS.GAINS_TRADING_V8],
      abi: [
        {
          inputs: [{ internalType: 'address', name: '_trader', type: 'address' }],
          name: 'getTrades',
          outputs: [
            {
              components: [
                { internalType: 'address', name: 'user', type: 'address' },
                { internalType: 'uint32', name: 'index', type: 'uint32' },
                { internalType: 'uint16', name: 'pairIndex', type: 'uint16' },
                { internalType: 'uint24', name: 'leverage', type: 'uint24' },
                { internalType: 'bool', name: 'long', type: 'bool' },
                { internalType: 'bool', name: 'isOpen', type: 'bool' },
                { internalType: 'uint8', name: 'collateralIndex', type: 'uint8' },
                { internalType: 'enum ITradingStorage.TradeType', name: 'tradeType', type: 'uint8' },
                { internalType: 'uint120', name: 'collateralAmount', type: 'uint120' },
                { internalType: 'uint64', name: 'openPrice', type: 'uint64' },
                { internalType: 'uint64', name: 'tp', type: 'uint64' },
                { internalType: 'uint64', name: 'sl', type: 'uint64' },
                { internalType: 'uint192', name: '__placeholder', type: 'uint192' },
              ],
              internalType: 'struct ITradingStorage.Trade[]',
              name: '',
              type: 'tuple[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
  })
  const [currentOnchainPosition, setCurrentOnchainPosition] = useState<OnchainPositionData | undefined>()

  const {
    data: onchainPositions,
    isLoading: loadingOnchainPositions,
    refetch: reloadOnchainPositions,
  } = useContractQuery<OnchainPositionData[]>(
    gainsContract,
    'getTrades',
    [activeWallet?.smartWalletAddress as string],
    {
      queryKey: [myProfile?.id],
      refetchInterval: 5000,
      select: (data: any[]) => {
        return data.map((item) => {
          const collateral = Number(formatUnits(item[8], 6))
          const leverage = item[3] / 1000
          const position = {
            address: item[0],
            index: item[1],
            indexToken: `GNS-${item[2]}`,
            leverage,
            collateral,
            size: collateral * leverage,
            averagePrice: Number(formatUnits(item[9], 10)),
            fee: undefined,
            isLong: item[4],
            tp: Number(formatUnits(item[10], 10)),
            sl: Number(formatUnits(item[11], 10)),
            protocol: activeWallet?.exchange === CopyTradePlatformEnum.GNS_V8 ? ProtocolEnum.GNS : ProtocolEnum.COPIN,
            status: PositionStatusEnum.OPEN,
          }

          if (
            currentOnchainPosition &&
            currentOnchainPosition?.index === position.index &&
            (currentOnchainPosition.sl !== position.sl || currentOnchainPosition.tp !== position.tp)
          ) {
            setCurrentOnchainPosition({ ...currentOnchainPosition, sl: position.sl, tp: position.tp })
          }

          return position
        })
      },
    }
  )

  const _queryParams: GetMyPositionsParams = {
    limit: 500,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
    copyWalletId: activeWallet?.id,
  }
  const _queryBody: GetMyPositionRequestBody = {
    copyWalletIds: activeWallet?.id ? [activeWallet?.id] : undefined,
  }

  const { data: positionsMapping } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, myProfile?.id],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      select: (data) => {
        const positionsMapping: { [key: string]: CopyPositionData } = {}
        data.data.forEach((pos) => {
          if (pos.positionIndex != null) {
            positionsMapping[pos.positionIndex] = pos
          }
        })
        return positionsMapping
      },
      refetchInterval: 5000,
    }
  )

  const {
    data: currentOnchainOrders,
    isLoading: loadingCurrentOnchainOrders,
    refetch: reloadCurrentOnchainOrders,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_ORDERS, currentOnchainPosition?.copyPositionId],
    () => getMyCopyOrdersApi({ copyId: currentOnchainPosition?.copyPositionId ?? '' }),
    {
      enabled: !!currentOnchainPosition?.copyPositionId,
      retry: 0,
    }
  )

  useEffect(() => {
    if (!onchainPositions || onchainPositions.length === 0) {
      setCurrentOnchainPosition(undefined)
      return
    }
    if (currentOnchainPosition) {
      const index = onchainPositions.findIndex((pos) => pos.index === currentOnchainPosition.index)
      if (index < 0) {
        setCurrentOnchainPosition(onchainPositions[0])
      }
      return
    }
    setCurrentOnchainPosition(onchainPositions[0])
  }, [currentOnchainPosition, onchainPositions])

  const contextValues = useMemo(() => {
    const result: VaultManagementContextValues = {
      vaultWallets,
      allCopyTrades,
      copyTrades,
      isLoadingCopyTrades,
      handleRefresh,
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
      onchainPositions,
      positionsMapping,
      currentOnchainPosition,
      setCurrentOnchainPosition,
      currentOnchainOrders,
      loadingOnchainPositions,
      reloadOnchainPositions,
      loadingCurrentOnchainOrders,
      reloadCurrentOnchainOrders,
    }
    return result
  }, [
    vaultWallets,
    allCopyTrades,
    copyTrades,
    isLoadingCopyTrades,
    handleRefresh,
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
    onchainPositions,
    positionsMapping,
    currentOnchainPosition,
    currentOnchainOrders,
    loadingOnchainPositions,
    reloadOnchainPositions,
    loadingCurrentOnchainOrders,
    reloadCurrentOnchainOrders,
  ])

  return <VaultManagementContext.Provider value={contextValues}>{children}</VaultManagementContext.Provider>
}
const useVaultManagementContext = () => {
  const values = useContext(VaultManagementContext)
  if (!Object.keys(values).length) throw Error('useVaultManagementContext need to be used in VaultManagementProvider')
  return values
}
export default useVaultManagementContext
