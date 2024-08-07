import { ReactNode, createContext, useContext } from 'react'

import { EpochHistoryData, FeeRebateData } from 'entities/feeRebate'
import { useAuthContext } from 'hooks/web3/useAuth'
import { DATE_TEXT_FORMAT, TIME_FORMAT } from 'utils/config/constants'

import useFeeRebate from './useFeeRebate'
import useFeeRebateHistories from './useFeeRebateHistories'

export interface FeeRebateContextValues {
  info?: FeeRebateData
  histories?: EpochHistoryData[]
  isLoadingFeeRebate?: boolean
  isLoadingHistories?: boolean
  lastTimeUpdated?: string
  format?: string
  reload?: () => void
}

export const FeeRebateContext = createContext({} as FeeRebateContextValues)

export function FeeRebateProvider({ children }: { children: ReactNode }) {
  const { account } = useAuthContext()
  const { info, isLoading: isLoadingFeeRebate, reloadFeeRebate } = useFeeRebate({ account: account?.address })
  const {
    histories,
    isLoading: isLoadingHistories,
    reloadHistories,
  } = useFeeRebateHistories({ maxEpochs: info?.maxEpochs })

  const format = `${DATE_TEXT_FORMAT} ${TIME_FORMAT} UTC`

  const reload = () => {
    reloadFeeRebate?.()
    reloadHistories?.()
  }

  const contextValue: FeeRebateContextValues = {
    info,
    histories,
    isLoadingFeeRebate,
    isLoadingHistories,
    format,
    reload,
  }

  return <FeeRebateContext.Provider value={contextValue}>{children}</FeeRebateContext.Provider>
}

const useFeeRebateContext = () => useContext(FeeRebateContext)
export default useFeeRebateContext
