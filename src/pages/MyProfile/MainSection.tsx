import { useEffect, useReducer, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi, getMyCopyTradersApi } from 'apis/copyTradeApis'
import { CopyTradeData } from 'entities/copyTrade'
import { UserData } from 'entities/user'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import { CopyTradePlatformEnum, CopyTradeStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import MyCopies from './MyCopies'
import useSelectMultiple from './useSelectMultiple'

export interface MainSectionState {
  selectedTraders: string[]
  selectedCopies: string[]
  selectedCopyMapping: Record<string, CopyTradeData>
}
export default function MainSection({
  myProfile,
  exchange,
  uniqueKey,
}: {
  myProfile: UserData
  exchange: CopyTradePlatformEnum
  uniqueKey: string | null
}) {
  const [sessionNum, setNewSession] = useReducer((prev) => prev + 1, 1)
  const prevUniqueKey = useRef(uniqueKey)
  useEffect(() => {
    if (prevUniqueKey.current === uniqueKey) return
    prevUniqueKey.current = uniqueKey
    setNewSession()
  }, [uniqueKey])
  const refData = useRef({
    storageData: sessionStorage.getItem(STORAGE_KEYS.MY_COPY_DATA),
    hadLoadTraders: false,
    hadLoadCopyTrades: false,
    hadSelectedTrader: false,
  })
  const [state, dispatch] = useReducer(
    (
      state: MainSectionState,
      action:
        | { type: 'setTraders'; payload: string[] }
        | { type: 'addTraders'; payload: string[] }
        | { type: 'removeTraders'; payload: string[] }
        | { type: 'reCheckTraders'; payload: string[] }
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
        default:
          break
      }
      return newState
    },
    {},
    () => {
      if (!!refData.current.storageData) {
        try {
          const storageData = JSON.parse(refData.current.storageData) as MainSectionState
          return storageData
        } catch {}
      }
      return {
        selectedTraders: [],
        selectedCopies: [],
        selectedCopyMapping: {},
      }
    }
  )

  const [forceLoadCopies, setForceLoadCopies] = useState(false)
  const hasCopyPermission = useCopyTradePermission()
  const prevResTraderList = useRef<string[]>([])
  const { data: tradersData, isLoading: isLoadingTraders } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_TRADERS, exchange, uniqueKey, sessionNum],
    () => getMyCopyTradersApi({ exchange, uniqueKey }),
    {
      enabled: !!exchange && hasCopyPermission && (forceLoadCopies || sessionNum !== 1),
      onSuccess: (data) => {
        const resAddresses = data.map((traderData) => traderData.account)
        if (
          resAddresses.length === prevResTraderList.current.length &&
          resAddresses.every((address) => prevResTraderList.current.includes(address))
        ) {
          return
        }
        prevResTraderList.current = resAddresses
        if ((!refData.current.storageData && !refData.current.hadLoadTraders) || forceLoadCopies) {
          refData.current.hadLoadTraders = true
          dispatch({ type: 'setTraders', payload: resAddresses })
          return
        }
        dispatch({ type: 'reCheckTraders', payload: resAddresses })
      },
    }
  )

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_DATA, JSON.stringify(state))
  }, [state])

  const handleSelectAllTraders = (isSelectedAll: boolean) => {
    if (!tradersData) return
    if (isSelectedAll) {
      dispatch({ type: 'setTraders', payload: [] })
      refData.current.hadSelectedTrader = true
    } else {
      dispatch({ type: 'setTraders', payload: tradersData.map((data) => data.account) })
      refData.current.hadSelectedTrader = true
    }
  }

  const {
    selected: copyStatus,
    checkIsSelected: checkIsStatusChecked,
    handleToggleSelect: handleToggleStatus,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_COPIES_STATUS,
    defaultSelected: [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED],
  })
  const queryParams = {
    apiKey: uniqueKey ?? undefined,
    accounts: state.selectedTraders,
    status: copyStatus.length === 1 ? copyStatus[0] : undefined,
  }
  const prevResCopyTradeList = useRef<string[]>([])
  const { data: copyTrades, isLoading: isLoadingCopyTrades } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, queryParams, sessionNum, copyStatus],
    () => getCopyTradeSettingsListApi(queryParams),
    {
      enabled:
        !!myProfile.id &&
        hasCopyPermission &&
        !!state.selectedTraders.length &&
        (forceLoadCopies || refData.current.hadSelectedTrader),
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
  const onDeleteTagTrader = (id: string) => {
    dispatch({ type: 'removeTraders', payload: [id] })
  }

  return (
    <>
      <MyCopies
        selectedTraders={state.selectedTraders}
        data={copyTrades}
        isLoading={isLoadingCopyTrades}
        onDeleteTag={onDeleteTagTrader}
        onRefresh={setNewSession}
        handleToggleStatus={handleToggleStatus}
        checkIsStatusChecked={checkIsStatusChecked}
        handleSelectAllTraders={() => {
          handleSelectAllTraders(false)
          setForceLoadCopies(true)
        }}
        isLoadingOutsource={isLoadingTraders}
        handleSelectTrader={(traderAddress) => {
          traderAddress && dispatch({ type: 'addTraders', payload: [traderAddress] })
        }}
      />
    </>
  )
}
