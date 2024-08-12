import { ReactNode, createContext, useContext, useMemo } from 'react'

import { EpochHistoryData, FeeRebateData } from 'entities/feeRebate'
import { useAuthContext } from 'hooks/web3/useAuth'
import { DATE_TEXT_FORMAT, TIME_FORMAT } from 'utils/config/constants'

import useFeeRebate from './useFeeRebate'
import useFeeRebateHistories from './useFeeRebateHistories'

export interface FeeRebateContextValues {
  totalOngoingRewards?: number
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

  const totalOngoingRewards: number = useMemo(() => {
    if (!histories) return 0
    return histories.reduce((sum, epoch) => {
      const epochFee = epoch.rebateData.reduce((epochSum, rebate) => {
        if (epoch.status === 1) return epochSum + (rebate.fee ?? 0)
        return epochSum
      }, 0)
      return sum + epochFee
    }, 0)
  }, [histories])

  const reload = () => {
    reloadFeeRebate?.()
    reloadHistories?.()
  }

  const contextValue: FeeRebateContextValues = {
    totalOngoingRewards,
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
