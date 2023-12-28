import { useMemo } from 'react'

import { ProtocolEnum } from 'utils/config/enums'

import useGetAllCopyTrades from './useGetAllCopyTrades'

type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
export type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

export default function useCopyTraderAddresses() {
  const { copiedTraders } = useGetAllCopyTrades()
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

  const tradersByProtocol = Object.values(ProtocolEnum).reduce((result, protocol, index) => {
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
