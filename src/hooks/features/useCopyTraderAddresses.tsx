import { useMemo } from 'react'

import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

import useGetAllCopyTrades from './useGetAllCopyTrades'

type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

export default function useCopyTraderAddresses(params?: { copyWalletIds: string[] | undefined }) {
  const { copiedTraders } = useGetAllCopyTrades({ copyWalletIds: params?.copyWalletIds })
  const listTraderAddresses = useMemo(
    () =>
      copiedTraders.reduce((result, dataByProtocol) => {
        result = Array.from(
          new Set([...result, ...(dataByProtocol.copyingTraders ?? []), ...(dataByProtocol.deletedTraders ?? [])])
        )
        return result
      }, [] as string[]),
    [copiedTraders]
  )
  const deletedTraderAddresses = useMemo(
    () =>
      copiedTraders.reduce((result, dataByProtocol) => {
        result = Array.from(new Set([...result, ...(dataByProtocol.deletedTraders ?? [])]))
        return result
      }, [] as string[]),
    [copiedTraders]
  )

  const tradersByProtocol = RELEASED_PROTOCOLS.reduce((result, protocol, index) => {
    const newResult = { ...result }
    const dataByProtocol = copiedTraders[index]
    const copyingTradersData: TradersByProtocolValuesData[] =
      dataByProtocol?.copyingTraders?.map((address) => ({ address, status: 'copying' })) ?? []
    const deleteTradersData: TradersByProtocolValuesData[] =
      dataByProtocol?.deletedTraders?.map((address) => ({ address, status: 'deleted' })) ?? []
    newResult[protocol] = [...(newResult[protocol] ?? []), ...copyingTradersData, ...deleteTradersData]
    return newResult
  }, {} as TradersByProtocolData)

  return { listTraderAddresses, deletedTraderAddresses, tradersByProtocol }
}
