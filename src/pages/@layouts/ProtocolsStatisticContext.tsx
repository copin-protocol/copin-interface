import { ReactNode, createContext, useContext } from 'react'
import { useQuery } from 'react-query'

import { getProtocolsStatistic } from 'apis/positionApis'
import { ProtocolsStatisticData } from 'entities/statistic'
import { QUERY_KEYS } from 'utils/config/keys'

export interface ProtocolsStatisticContextData {
  data: ProtocolsStatisticData | undefined
}

const ProtocolsStatisticContext = createContext<ProtocolsStatisticContextData>({} as ProtocolsStatisticContextData)

export function ProtocolsStatisticProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery([QUERY_KEYS.GET_PROTOCOLS_STATISTIC], getProtocolsStatistic)

  const contextValue: ProtocolsStatisticContextData = {
    data,
  }

  return <ProtocolsStatisticContext.Provider value={contextValue}>{children}</ProtocolsStatisticContext.Provider>
}

export const useProtocolsStatisticContext = () => useContext(ProtocolsStatisticContext)
