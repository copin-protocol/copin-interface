import { useEffect, useMemo, useRef } from 'react'
import { useQueries } from 'react-query'

import { getAllMyCopyTradersApi } from 'apis/copyTradeApis'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import SelectTradersDropdown, { TradersByProtocolData, TradersByProtocolValuesData } from '../SelectTradersDropdown'
import { DispatchSelectTraders } from './useSelectTraders'

export default function SelectedTraders({
  allTraders,
  selectedTraders,
  dispatch,
  storageData,
  onChangeTraders,
}: {
  allTraders: string[]
  selectedTraders: string[]
  dispatch: DispatchSelectTraders
  storageData: string | null
  onChangeTraders: () => void
}) {
  const copiedTraders = useQueries(QUERY_CONFIGS)

  const listTraderAddresses = useMemo(
    () =>
      copiedTraders.reduce((result, dataByProtocol) => {
        result = Array.from(
          new Set([
            ...result,
            ...(dataByProtocol.data?.copyingTraders ?? []),
            ...(dataByProtocol.data?.deletedTraders ?? []),
          ])
        )
        return result
      }, [] as string[]),
    [copiedTraders]
  )

  const handleSelectAllTraders = (isSelectedAll: boolean) => {
    if (!listTraderAddresses.length) return
    if (isSelectedAll) {
      dispatch({ type: 'setTraders', payload: [] })
    } else {
      dispatch({ type: 'setTraders', payload: listTraderAddresses })
    }
    onChangeTraders()
  }

  const handleToggleTrader = (address: string) => {
    dispatch({ type: 'toggleTrader', payload: address })
    onChangeTraders()
  }

  const tradersByProtocol = PROTOCOL_ORDERS.reduce((result, protocol, index) => {
    const newResult = { ...result }
    const dataByProtocol = copiedTraders[index].data
    const copyingTradersData: TradersByProtocolValuesData[] =
      dataByProtocol?.copyingTraders.map((address) => ({ address, status: 'copying' })) ?? []
    const deleteTradersData: TradersByProtocolValuesData[] =
      dataByProtocol?.deletedTraders.map((address) => ({ address, status: 'deleted' })) ?? []
    newResult[protocol] = [...(newResult[protocol] ?? []), ...copyingTradersData, ...deleteTradersData]
    return newResult
  }, {} as TradersByProtocolData)

  const deletedTraderAddresses = useMemo(
    () =>
      copiedTraders.reduce((result, dataByProtocol) => {
        result = Array.from(new Set([...result, ...(dataByProtocol.data?.deletedTraders ?? [])]))
        return result
      }, [] as string[]),
    [copiedTraders]
  )

  const updateOne = useRef(false)
  useEffect(() => {
    if (!listTraderAddresses.length || updateOne.current || !!storageData) return
    updateOne.current = true
    dispatch({
      type: 'setState',
      payload: {
        selectedTraders: listTraderAddresses,
        deletedTraders: deletedTraderAddresses,
        allTraders: listTraderAddresses,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTraderAddresses])

  if (!tradersByProtocol) return <></>

  return (
    <SelectTradersDropdown
      allTraders={allTraders}
      selectedTraders={selectedTraders}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      tradersByProtocol={tradersByProtocol}
    />
  )
}

const PROTOCOL_ORDERS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA]
const QUERY_CONFIGS = PROTOCOL_ORDERS.map((protocol) => {
  return {
    queryKey: [QUERY_KEYS.GET_ALL_MY_COPY_TRADERS, protocol],
    queryFn: () => getAllMyCopyTradersApi({ protocol }),
  }
})
