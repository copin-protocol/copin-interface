import { useMemo } from 'react'
import { useQueries } from 'react-query'

import { getAllMyCopyTradersApi } from 'apis/copyTradeApis'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
export type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

const PROTOCOL_ORDERS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA]
const queryConfigsFactory = (myProfileId: string | undefined) =>
  PROTOCOL_ORDERS.map((protocol) => {
    return {
      queryKey: [QUERY_KEYS.GET_ALL_MY_COPY_TRADERS, protocol, myProfileId],
      queryFn: () => getAllMyCopyTradersApi({ protocol }),
      enabled: !!myProfileId,
    }
  })

export default function useCopyTraderAddresses() {
  const { myProfile } = useMyProfileStore()
  const copiedTraders = useQueries(queryConfigsFactory(myProfile?.id))
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
  const deletedTraderAddresses = useMemo(
    () =>
      copiedTraders.reduce((result, dataByProtocol) => {
        result = Array.from(new Set([...result, ...(dataByProtocol.data?.deletedTraders ?? [])]))
        return result
      }, [] as string[]),
    [copiedTraders]
  )

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

  return { listTraderAddresses, deletedTraderAddresses, tradersByProtocol }
}
