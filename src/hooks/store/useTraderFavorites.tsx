import { memo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import {
  deleteFavoriteApi,
  deleteFavoritesApi,
  getAllFavoritesApi,
  postFavoritesApi,
  putFavoritesApi,
} from 'apis/favoriteApis'
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
  bookmarks: { [key: string]: { id?: string; note?: string; customAlertIds?: string[]; lastAddedAt?: number } }
  isEdit: boolean | undefined
  isEditInGroup: boolean | undefined
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setTraderFavorites: (addressesAndProtocol: string[]) => void
  setBookmarks: (data: {
    [key: string]: { id?: string; note?: string; customAlertIds?: string[]; lastAddedAt?: number }
  }) => void
  setTooltip: (
    params:
      | {
          address: string
          protocol: ProtocolEnum
          position?: { top: number; left: number }
          isEdit?: boolean
          isEditInGroup?: boolean
        }
      | undefined
  ) => void
}

const useTraderFavoritesStore = create<TraderFavoritesState>()(
  immer((set) => ({
    tooltipAddress: undefined,
    tooltipProtocol: undefined,
    tooltipPosition: undefined,
    isEdit: undefined,
    isEditInGroup: undefined,
    traderFavorites: [],
    bookmarks: {},
    customAlertIds: {},
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setTraderFavorites: (addresses: string[]) => set({ traderFavorites: addresses }),
    setBookmarks: (bookmarks: {
      [key: string]: { id?: string; note?: string; customAlertIds?: string[]; lastAddedAt?: number }
    }) => set({ bookmarks }),
    setTooltip: (params) =>
      set({
        tooltipAddress: params?.address,
        tooltipProtocol: params?.protocol,
        tooltipPosition: params?.position,
        isEdit: params?.isEdit,
        isEditInGroup: params?.isEditInGroup,
      }),
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
  const { setTraderFavorites, setBookmarks, setLoading } = useTraderFavoritesStore()
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
      setTraderFavorites(Array.from(new Set(data.map((trader) => `${trader.account}-${trader.protocol}`))))
      const _bookmarks = data.reduce((prev, cur) => {
        const key = `${cur.account}-${cur.protocol}`
        if (prev[key]) {
          if (cur.customAlertId) {
            prev[key].customAlertIds = [...(prev[key].customAlertIds || []), cur.customAlertId]
            const createdAt = new Date(cur.createdAt).getTime()
            if ((prev[key].lastAddedAt || 0) < createdAt) {
              prev[key].lastAddedAt = createdAt
            }
          }
        } else {
          prev[key] = {
            id: cur.id,
            note: cur.note || '',
            customAlertIds: cur.customAlertId ? [cur.customAlertId] : [],
            lastAddedAt: new Date(cur.createdAt).getTime(),
          }
        }
        return prev
      }, {} as { [key: string]: { id?: string; note?: string; customAlertIds?: string[]; lastAddedAt?: number } })
      setBookmarks(_bookmarks)
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
    bookmarks,
    isEdit,
    isEditInGroup,
    traderFavorites,
    tooltipProtocol,
    setSubmitting,
    setTraderFavorites,
    setBookmarks,
    tooltipAddress,
    tooltipPosition,
    setTooltip,
  } = useTraderFavoritesStore()

  const setTraderFavorite = async ({
    address,
    protocol,
    note,
    isEdit,
    customAlertIds,
  }: {
    address: string
    protocol: ProtocolEnum
    note?: string
    isEdit?: boolean
    customAlertIds?: string[]
  }) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = bookmarks
    const traderFavorite = getTraderFavoriteValue({ address, protocol })
    setBookmarks({
      ...bookmarks,
      [traderFavorite]: { note, customAlertIds, lastAddedAt: new Date().getTime() },
    })
    if (!isEdit) {
      setTraderFavorites([traderFavorite, ...traderFavorites])
    }
    try {
      if (isEdit) {
        await putFavoritesApi({ protocol, account: address, note, customAlertIds })
      } else {
        await postFavoritesApi({ protocol, account: address, note, customAlertIds })
      }
    } catch (err) {
      setTraderFavorites(oldData)
      setBookmarks(oldDataNotes)
      toast.error(<ToastBody title="Error" message={err?.message || 'Favorite Failed'} />)
    }
    setSubmitting(false)
  }

  const unsetTraderFavorite = async ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => {
    setSubmitting(true)
    const oldData = traderFavorites
    const oldDataNotes = bookmarks
    const traderFavorite = getTraderFavoriteValue({ address, protocol })
    if (traderFavorites.includes(traderFavorite)) {
      setTraderFavorites(traderFavorites.filter((value) => value !== traderFavorite))
      if (bookmarks[traderFavorite]) {
        const { ...rest } = Object.fromEntries(Object.entries(bookmarks).filter(([key]) => key !== traderFavorite))
        setBookmarks(rest)
      }
    }
    try {
      await deleteFavoritesApi({ protocol, account: address })
    } catch (err) {
      setTraderFavorites(oldData)
      setBookmarks(oldDataNotes)
      toast.error(<ToastBody title="Error" message="Unfavorite Failed" />)
    }
    setSubmitting(false)
  }

  const removeBookmark = async ({
    id,
    address,
    protocol,
    groupId,
  }: {
    id: string
    address: string
    protocol: ProtocolEnum
    groupId: string
  }) => {
    setSubmitting(true)
    try {
      await deleteFavoriteApi(id)
      const key = getTraderFavoriteValue({
        address,
        protocol,
      })
      const bookmark = bookmarks[key]
      if (bookmark) {
        setBookmarks({
          ...bookmarks,
          [key]: { id, note: bookmark.note, customAlertIds: bookmark.customAlertIds?.filter((id) => id !== groupId) },
        })
      }
    } catch (err) {
      toast.error(<ToastBody title="Error" message="Remove Bookmark Failed" />)
    }
    setSubmitting(false)
  }

  return {
    traderFavorites,
    bookmarks,
    isEdit,
    isEditInGroup,
    isLoading,
    submitting,
    setTraderFavorite,
    unsetTraderFavorite,
    removeBookmark,
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
