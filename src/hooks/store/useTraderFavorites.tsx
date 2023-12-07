import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { deleteFavoritesApi, getFavoritesApi, postFavoritesApi } from 'apis/favoriteApis'
import ToastBody from 'components/@ui/ToastBody'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { useAuthContext } from 'hooks/web3/useAuth'
import ROUTES from 'utils/config/routes'

interface TraderFavoritesState {
  tooltipAddress?: string
  tooltipPosition?: { top: number; left: number }
  isLoading: boolean
  submitting: boolean
  traderFavorites: string[]
  notes: { [key: string]: string }
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setTraderFavorites: (addresses: string[]) => void
  setNotes: (notes: { [key: string]: string }) => void
  setTooltip: (address?: string, position?: { top: number; left: number }) => void
}

const useTraderFavoritesStore = create<TraderFavoritesState>()(
  immer((set) => ({
    tooltipAddress: undefined,
    tooltipPosition: undefined,
    traderFavorites: [],
    notes: {},
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setTraderFavorites: (addresses: string[]) => set({ traderFavorites: addresses }),
    setNotes: (notes: { [key: string]: string }) => set({ notes }),
    setTooltip: (address?: string, position?: { top: number; left: number }) =>
      set({ tooltipAddress: address, tooltipPosition: position }),
  }))
)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.HOME_LEADERBOARD.path,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.MY_MANAGEMENT.path,
  ROUTES.MY_HISTORY.path,
  ROUTES.USER_ACTIVITY.path,
  ROUTES.WALLET_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.ALERT_LIST.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
  ROUTES.POSITION_DETAILS.path,
]
export const useInitTraderFavorites = () => {
  const { protocol } = useProtocolStore()
  const { profile } = useAuthContext()
  const { setTraderFavorites, setNotes, setLoading } = useTraderFavoritesStore()
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH)
  const { data, isLoading } = useQuery(['favorites', profile?.username, protocol], () => getFavoritesApi(protocol), {
    retry: 0,
    enabled: !!profile && enabledQueryByPaths,
  })
  useEffect(() => {
    if (data) {
      setTraderFavorites(data.map((trader) => trader.account))
      setNotes(
        data.reduce((prev, cur) => {
          prev[cur.account] = cur.note || ''
          return prev
        }, {} as { [key: string]: string })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])
}

const useTraderFavorites = () => {
  const { protocol } = useProtocolStore()
  const {
    isLoading,
    submitting,
    notes,
    traderFavorites,
    setSubmitting,
    setTraderFavorites,
    setNotes,
    tooltipAddress,
    tooltipPosition,
    setTooltip,
  } = useTraderFavoritesStore()

  const setTraderFavorite = async (address: string, note?: string) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = notes
    if (!traderFavorites.includes(address)) {
      setTraderFavorites([address, ...traderFavorites])
      if (note) {
        setNotes({ ...notes, [address]: note })
      }
    }
    try {
      await postFavoritesApi({ protocol, account: address, note })
    } catch (err) {
      setTraderFavorites(oldData)
      setNotes(oldDataNotes)
      toast.error(<ToastBody title="Error" message="Favorite Failed" />)
    }
    setSubmitting(false)
  }
  const unsetTraderFavorite = async (address: string) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = notes
    if (traderFavorites.includes(address)) {
      setTraderFavorites(traderFavorites.filter((account) => account !== address))
      if (notes[address]) {
        const { ...rest } = Object.fromEntries(Object.entries(notes).filter(([key]) => key !== address))
        setNotes(rest)
      }
    }
    try {
      await deleteFavoritesApi({ protocol, account: address })
    } catch (err) {
      setTraderFavorites(oldData)
      setNotes(oldDataNotes)
      toast.error(<ToastBody title="Error" message="Unfavorite Failed" />)
    }
    setSubmitting(false)
  }
  return {
    traderFavorites,
    notes,
    isLoading,
    submitting,
    setTraderFavorite,
    unsetTraderFavorite,
    tooltipAddress,
    tooltipPosition,
    setTooltip,
  }
}

export default useTraderFavorites
