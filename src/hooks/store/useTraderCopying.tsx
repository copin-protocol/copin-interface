import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getTradersCopyingApi } from 'apis/copyTradeApis'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

interface TraderCopyingState {
  isLoading: boolean
  submitting: boolean
  traderCopying: string[]
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setTraderCopying: (addresses: string[]) => void
}

const useTraderCopyingStore = create<TraderCopyingState>()(
  immer((set) => ({
    traderCopying: [],
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setTraderCopying: (addresses: string[]) => set({ traderCopying: addresses }),
  }))
)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.WALLET_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
  ROUTES.POSITION_DETAILS.path,
]
export const useInitTraderCopying = () => {
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH)
  const { profile } = useAuthContext()
  const { setTraderCopying, setLoading } = useTraderCopyingStore()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_TRADERS_COPYING, profile?.username],
    () => getTradersCopyingApi(),
    {
      retry: 0,
      enabled: !!profile && enabledQueryByPaths,
    }
  )
  useEffect(() => {
    if (data) setTraderCopying(data)
  }, [data, setTraderCopying])
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])
}

const useTraderCopying = (account?: string) => {
  const { isLoading, traderCopying, setTraderCopying } = useTraderCopyingStore()
  const isCopying = useMemo(() => (account ? traderCopying.includes(account) : false), [account, traderCopying])

  const saveTraderCopying = (address: string) => {
    if (!traderCopying.includes(address)) {
      setTraderCopying([address, ...traderCopying])
    }
  }
  const removeTraderCopying = (address: string) => {
    if (traderCopying.includes(address)) {
      setTraderCopying(traderCopying.filter((account) => account !== address))
    }
  }
  return {
    isCopying,
    traderCopying,
    isLoading,
    saveTraderCopying,
    removeTraderCopying,
  }
}

export default useTraderCopying
