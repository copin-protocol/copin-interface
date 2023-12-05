import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi, getMyCopyTradersApi } from 'apis/copyTradeApis'
import { CopyWalletData } from 'entities/copyWallet'
import { UserData } from 'entities/user'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import MyCopies from './MyCopies'
import useSelectMultiple from './useSelectMultiple'

export interface MainSectionState {
  selectedTraders: string[]
}
export default function MainSection({
  myProfile,
  exchange,
  copyWallet,
}: {
  myProfile: UserData
  exchange: CopyTradePlatformEnum
  copyWallet: CopyWalletData | null
}) {
  const storageData = sessionStorage.getItem(STORAGE_KEYS.MY_COPY_DATA)
  const [state, dispatch] = useSelectTraders(storageData)
  const refetchQueries = useRefetchQueries()

  const [sessionNum, setNewSession] = useReducer((prev) => prev + 1, 1)
  const hasCopyPermission = useCopyTradePermission()
  const prevResTraderList = useRef<string[]>([])
  const copyWalletId = copyWallet?.id
  const prevWalletId = useRef(copyWallet?.id)
  const { data: tradersData, isLoading: isLoadingTraders } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_TRADERS, exchange, copyWalletId, sessionNum],
    () => getMyCopyTradersApi({ exchange, copyWalletId }),
    {
      enabled: !!exchange && hasCopyPermission,
      onSuccess: (data) => {
        const resAddresses = data.map((traderData) => traderData.account)
        if (
          resAddresses.length === prevResTraderList.current.length &&
          resAddresses.every((address) => prevResTraderList.current.includes(address))
        ) {
          return
        }
        prevResTraderList.current = resAddresses
        if (!storageData || prevWalletId.current !== copyWalletId) {
          prevWalletId.current = copyWalletId
          dispatch({ type: 'setTraders', payload: resAddresses })
          return
        }
        dispatch({ type: 'reCheckTraders', payload: resAddresses })
      },
    }
  )

  const listTraderAddresses = useMemo(() => tradersData?.map((trader) => trader.account) ?? [], [tradersData])

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
      enabled: !!myProfile.id && hasCopyPermission && !!listTraderAddresses.length,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const {
    selected: copyStatus,
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
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_COPIES_PROTOCOL,
    defaultSelected: [ProtocolEnum.GMX, ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL],
  })
  const queryParams = useMemo(
    () => ({
      copyWalletId,
      accounts: state.selectedTraders,
      status: copyStatus.length === 1 ? copyStatus[0] : undefined,
      protocol: selectedProtocol.length === 1 ? selectedProtocol[0] : undefined,
    }),
    [copyStatus, selectedProtocol, state.selectedTraders, copyWalletId]
  )
  const prevResCopyTradeList = useRef<string[]>([])
  const { data: copyTrades, isFetching: isLoadingCopyTrades } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, queryParams, sessionNum, copyStatus],

    () => getCopyTradeSettingsListApi(queryParams),
    {
      enabled: !!myProfile.id && hasCopyPermission && !!state.selectedTraders.length && !!allCopyTrades,
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

  const handleSelectAllTraders = (isSelectedAll: boolean) => {
    if (!listTraderAddresses.length) return
    if (isSelectedAll) {
      dispatch({ type: 'setTraders', payload: [] })
    } else {
      dispatch({ type: 'setTraders', payload: listTraderAddresses })
    }
  }
  const handleToggleTrader = (address: string) => {
    dispatch({ type: 'toggleTrader', payload: address })
  }
  const handleAddTrader = (address: string) => {
    dispatch({ type: 'addTraders', payload: [address] })
  }

  const handleRefresh = () => {
    refetchQueries([QUERY_KEYS.USE_GET_ALL_COPY_TRADES])
    setNewSession()
  }

  useEffect(() => {
    const dataStorage = JSON.stringify(state)
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_DATA, dataStorage)
  }, [state])

  return (
    <>
      <MyCopies
        selectedTraders={state.selectedTraders}
        data={copyTrades}
        isLoading={isLoadingCopyTrades}
        onRefresh={handleRefresh}
        handleToggleStatus={handleToggleStatus}
        checkIsStatusChecked={checkIsStatusChecked}
        handleToggleProtocol={handleToggleProtocol}
        checkIsProtocolChecked={checkIsProtocolChecked}
        handleSelectAllTraders={handleSelectAllTraders}
        isLoadingTraders={isLoadingTraders}
        handleToggleTrader={handleToggleTrader}
        traders={listTraderAddresses}
        allCopyTrades={allCopyTrades}
        handleAddTrader={handleAddTrader}
        copyWallet={copyWallet}
        copyStatus={copyStatus}
        selectedProtocol={selectedProtocol}
      />
    </>
  )
}

function useSelectTraders(storageData: string | null) {
  return useReducer(
    (
      state: MainSectionState,
      action:
        | { type: 'setTraders'; payload: string[] }
        | { type: 'addTraders'; payload: string[] }
        | { type: 'removeTraders'; payload: string[] }
        | { type: 'reCheckTraders'; payload: string[] }
        | { type: 'toggleTrader'; payload: string }
    ) => {
      const newState = { ...state }
      switch (action.type) {
        case 'setTraders':
          newState.selectedTraders = action.payload
          break
        case 'addTraders':
          newState.selectedTraders = Array.from(new Set([...newState.selectedTraders, ...action.payload]))
          break
        case 'removeTraders':
          newState.selectedTraders = newState.selectedTraders.filter((address) => !action.payload.includes(address))
          break
        case 'reCheckTraders':
          newState.selectedTraders = newState.selectedTraders.filter((address) => action.payload.includes(address))
          break
        case 'toggleTrader':
          const isSelected = state.selectedTraders.includes(action.payload)
          if (isSelected) {
            newState.selectedTraders = newState.selectedTraders.filter((address) => action.payload !== address)
          } else {
            newState.selectedTraders = Array.from(new Set([...newState.selectedTraders, action.payload]))
          }
          break
        default:
          break
      }
      return newState
    },
    {},
    () => {
      if (!!storageData) {
        try {
          const _storageData = JSON.parse(storageData) as MainSectionState
          return _storageData
        } catch {}
      }
      return {
        selectedTraders: [],
      }
    }
  )
}
