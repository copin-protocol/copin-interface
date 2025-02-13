import { ReactNode, createContext, useContext, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getOpeningPositionsApi } from 'apis/positionApis'
import useQueryClosedPositions from 'components/@position/TraderHistoryPositions/useQueryClosedPositions'
import { PositionData } from 'entities/trader'
import usePageChange from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import useVaultDetailsContext from './useVaultDetailsProvider'

export interface VaultPositionContextValues {
  openingPositions: PositionData[] | undefined
  isLoadingOpening: boolean
  closedPositions: ApiListResponse<PositionData> | undefined
  isLoadingClosed: boolean
  handleFetchClosedPositions: () => void
  hasNextClosedPositions: boolean | undefined
  currentSort: TableSortProps<PositionData> | undefined
  currentSortOpening: TableSortProps<PositionData> | undefined
  currentPage: number
  changeCurrentPage: (page: number) => void
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
  changeCurrentSortOpening: (sort: TableSortProps<PositionData> | undefined) => void
  resetSort: () => void
  resetSortOpening: () => void
}

export const VaultPositionContext = createContext({} as VaultPositionContextValues)

export function VaultPositionProvider({ children }: { children: ReactNode }) {
  const { vaultCopyWallet } = useVaultDetailsContext()

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })

  const [currentSortOpening, setCurrentSortOpening] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'openBlockTime',
    sortType: SortTypeEnum.DESC,
  })

  const resetSortOpening = () =>
    setCurrentSortOpening({
      sortBy: 'openBlockTime',
      sortType: SortTypeEnum.DESC,
    })

  const changeCurrentSortOpening = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSortOpening(sort)
  }

  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, vaultCopyWallet, currentSortOpening],
    () =>
      getOpeningPositionsApi({
        protocol: ProtocolEnum.GNS,
        account: vaultCopyWallet,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      enabled: !!vaultCopyWallet,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )

  const {
    currentSort,
    changeCurrentSort,
    resetSort,
    closedPositions,
    isLoadingClosed,
    hasNextClosedPositions,
    handleFetchClosedPositions,
  } = useQueryClosedPositions({ address: vaultCopyWallet, protocol: ProtocolEnum.GNS, isExpanded: true })

  const contextValue: VaultPositionContextValues = {
    openingPositions,
    isLoadingOpening,
    closedPositions,
    isLoadingClosed,
    handleFetchClosedPositions,
    hasNextClosedPositions,
    currentSort,
    currentSortOpening,
    currentPage,
    changeCurrentPage,
    changeCurrentSort,
    changeCurrentSortOpening,
    resetSort,
    resetSortOpening,
  }

  return <VaultPositionContext.Provider value={contextValue}>{children}</VaultPositionContext.Provider>
}

const useVaultPositionContext = () => useContext(VaultPositionContext)
export default useVaultPositionContext
