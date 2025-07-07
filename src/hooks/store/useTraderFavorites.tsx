import { memo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { deleteFavoritesApi, getAllFavoritesApi, postFavoritesApi } from 'apis/favoriteApis'
import ToastBody from 'components/@ui/ToastBody'
import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { useAuthContext } from 'hooks/web3/useAuth'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

interface TraderFavoritesState {
  tooltipAddress: string | undefined
  tooltipProtocol: ProtocolEnum | undefined
  tooltipPosition: { top: number; left: number } | undefined
  isLoading: boolean
  submitting: boolean
  traderFavorites: string[] // address_protocol
  notes: { [key: string]: string }
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setTraderFavorites: (addressesAndProtocol: string[]) => void
  setNotes: (notes: { [key: string]: string }) => void
  setTooltip: (
    params: { address: string; protocol: ProtocolEnum; position?: { top: number; left: number } } | undefined
  ) => void
}

const useTraderFavoritesStore = create<TraderFavoritesState>()(
  immer((set) => ({
    tooltipAddress: undefined,
    tooltipProtocol: undefined,
    tooltipPosition: undefined,
    traderFavorites: [],
    notes: {},
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setTraderFavorites: (addresses: string[]) => set({ traderFavorites: addresses }),
    setNotes: (notes: { [key: string]: string }) => set({ notes }),
    setTooltip: (params) =>
      set({ tooltipAddress: params?.address, tooltipProtocol: params?.protocol, tooltipPosition: params?.position }),
  }))
)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.LEADERBOARD.path_prefix,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.MY_MANAGEMENT.path,
  ROUTES.MY_HISTORY.path,
  ROUTES.USER_ACTIVITY.path,
  ROUTES.WALLET_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.ALERT_LIST.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
  ROUTES.POSITION_DETAILS.path_prefix,
]
const useInitTraderFavorites = () => {
  const { profile } = useAuthContext()
  const { setTraderFavorites, setNotes, setLoading } = useTraderFavoritesStore()
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH, true)
  const { data, isLoading } = useQuery(['favorites', profile?.username], () => getAllFavoritesApi(), {
    // select(data) {
    //   const result = []
    //   for (const addresses of data) {
    //     if (!addresses?.length) continue
    //     for (const address of addresses) {
    //       result.push(address)
    //     }
    //   }
    //   return result
    // },
    retry: 0,
    enabled: !!profile && enabledQueryByPaths,
    keepPreviousData: true,
  })

  useEffect(() => {
    if (data) {
      setTraderFavorites(data.map((trader) => `${trader.account}-${trader.protocol}`))
      setNotes(
        data.reduce((prev, cur) => {
          prev[`${cur.account}-${cur.protocol}`] = cur.note || ''
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

export const InitTraderFavorites = memo(function InitTraderFavoritesMemo() {
  useInitTraderFavorites()
  return null
})

const useTraderFavorites = () => {
  const {
    isLoading,
    submitting,
    notes,
    traderFavorites,
    tooltipProtocol,
    setSubmitting,
    setTraderFavorites,
    setNotes,
    tooltipAddress,
    tooltipPosition,
    setTooltip,
  } = useTraderFavoritesStore()

  const setTraderFavorite = async ({
    address,
    protocol,
    note,
  }: {
    address: string
    protocol: ProtocolEnum
    note?: string
  }) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = notes
    const traderFavorite = getTraderFavoriteValue({ address, protocol })
    if (!traderFavorites.includes(traderFavorite)) {
      setTraderFavorites([traderFavorite, ...traderFavorites])
      if (note) {
        setNotes({ ...notes, [traderFavorite]: note })
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

  const unsetTraderFavorite = async ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = notes
    const traderFavorite = getTraderFavoriteValue({ address, protocol })
    if (traderFavorites.includes(traderFavorite)) {
      setTraderFavorites(traderFavorites.filter((value) => value !== traderFavorite))
      if (notes[traderFavorite]) {
        const { ...rest } = Object.fromEntries(Object.entries(notes).filter(([key]) => key !== traderFavorite))
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
    tooltipProtocol,
    tooltipPosition,
    setTooltip,
  }
}

export default useTraderFavorites

export function getTraderFavoriteValue({ address, protocol }: { address: string; protocol: ProtocolEnum }) {
  return `${address}-${protocol}`
}
export function parseTraderFavoriteValue(value: string) {
  const chunks = value.split('-')
  return {
    address: chunks[0],
    protocol: chunks[1] as ProtocolEnum,
  }
}
