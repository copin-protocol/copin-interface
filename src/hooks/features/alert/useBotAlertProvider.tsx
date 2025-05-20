import dayjs from 'dayjs'
import { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { checkLinkedBotAlertApi, getBotAlertApi, getCustomAlertsApi, getTraderAlertListApi } from 'apis/alertApis'
import { ApiListResponse } from 'apis/api'
import { AlertSettingData, BotAlertData, TraderAlertData } from 'entities/alert'
import { AlertPermission, AlertPermissionConfig } from 'entities/permission'
import { SubscriptionUsageData } from 'entities/subscription'
import useGetSubscriptionPermission from 'hooks/features/subscription/useGetSubscriptionPermission'
import { useIsElite, useIsPro } from 'hooks/features/subscription/useSubscriptionRestrict'
import useUserUsage from 'hooks/features/subscription/useUserUsage'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import usePageChange from 'hooks/helpers/usePageChange'
import { AlertCategoryEnum, AlertTypeEnum, SubscriptionPermission } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import useSettingChannels from './useSettingChannels'

export interface BotAlertContextValues {
  usage?: SubscriptionUsageData
  maxTraderAlert?: number
  systemAlerts?: BotAlertData[]
  customAlerts?: ApiListResponse<BotAlertData>
  traderAlerts?: ApiListResponse<TraderAlertData>
  loadingAlerts?: boolean
  loadingTraders?: boolean
  isPremiumUser?: boolean | null
  isEliteUser?: boolean | null
  hasCopiedChannel?: boolean
  hasWatchlistChannel?: boolean
  isGeneratingLink?: boolean
  handleGenerateLinkBot?: (type: AlertTypeEnum, customAlertId?: string) => void
  refetchAlerts?: () => void
  refetchTraders?: () => void
  currentPage?: number
  changeCurrentPage?: (page: number) => void
  botAlertState?: string
  currentAlert?: { type: AlertTypeEnum; customAlertId?: string }
  stateExpiredTime?: number
  handleResetState?: () => void
  openingModal?: boolean
  handleOpenModal?: () => void
  handleDismissModal?: () => void
  keyword?: string
  setKeyword?: (keyword: string) => void
  userPermission?: AlertPermissionConfig
  pagePermission?: AlertPermission
}

interface BotAlertContextModifier {
  setState: (state: BotAlertContextValues) => void
}

export const BotAlertContext = createContext({} as BotAlertContextValues)

const LIMIT_TRADERS = 10

export const BotAlertInitializer = memo(function BotAlertProvider() {
  const isProUser = useIsPro()
  const isEliteUser = useIsElite()
  const { pagePermission, userPermission, myProfile } = useGetSubscriptionPermission<
    AlertPermission,
    AlertPermissionConfig
  >({
    section: SubscriptionPermission.TRADER_ALERT,
  })
  const refetchQueries = useRefetchQueries()
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'page' })
  const [isOpenLinkBotModal, setIsOpenLinkBotModal] = useState(false)
  const [currentState, setCurrentState] = useState<string | undefined>()
  const [currentAlert, setCurrentAlert] = useState<{ type: AlertTypeEnum; customAlertId?: string } | undefined>()
  const [stateExpiredTime, setStateExpiredTime] = useState<number | undefined>()
  const [searchText, setSearchText] = useState('')

  const { usage } = useUserUsage()

  const maxTraderAlert = userPermission?.watchedListQuota ?? 0

  const handleResetState = useCallback(() => {
    setIsOpenLinkBotModal(false)
    setCurrentState(undefined)
    setCurrentAlert(undefined)
    setStateExpiredTime(undefined)
    refetchQueries([QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE])
  }, [refetchQueries])

  const {
    data: systemAlertSettings,
    isLoading: loadingAlerts,
    refetch: refetchAlerts,
  } = useQuery([QUERY_KEYS.GET_BOT_ALERT, myProfile?.id], () => getBotAlertApi(), {
    enabled: !!myProfile?.id,
    retry: 0,
    select: (data) => {
      return data?.map((e) => {
        return {
          ...e,
          name: e.name ?? e.chatId,
        } as AlertSettingData
      })
    },
  })

  const {
    data: customAlerts,
    isLoading: loadingCustomAlerts,
    refetch: refetchCustomAlerts,
  } = useQuery(
    [QUERY_KEYS.GET_CUSTOM_ALERTS, myProfile?.id, currentPage, searchText],
    () => getCustomAlertsApi({ name: searchText, limit: 20, offset: pageToOffset(currentPage, 20) }),
    {
      keepPreviousData: true,
      enabled: !!myProfile?.id,
      retry: 0,
      select: (data) => {
        return {
          data: data?.data?.map((e) => {
            return {
              ...e,
              category: AlertCategoryEnum.CUSTOM,
            } as BotAlertData
          }),
          meta: data.meta,
        }
      },
    }
  )

  useQuery(
    [QUERY_KEYS.CHECK_LINKED_BOT_ALERT, myProfile?.id, currentState, isOpenLinkBotModal],
    () => checkLinkedBotAlertApi(currentState ?? ''),
    {
      enabled: !!myProfile?.id && !!currentState && isOpenLinkBotModal,
      retry: 0,
      refetchInterval:
        !!currentState && !!stateExpiredTime && dayjs().utc().isBefore(dayjs.utc(stateExpiredTime)) ? 5000 : undefined,
      onSuccess: (data) => {
        if (data && currentState && stateExpiredTime) {
          handleResetState()
          refetchAlerts()
          refetchCustomAlerts()
          refetchQueries([QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID, QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE])
        }
      },
    }
  )

  const {
    data: traderAlerts,
    isLoading: loadingTraders,
    refetch: refetchTraders,
  } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, myProfile?.id],
    () => getTraderAlertListApi({ limit: LIMIT_TRADERS, offset: 0 }),
    {
      enabled: !!myProfile?.id,
      retry: 0,
    }
  )

  const systemAlerts = useMemo(() => {
    return groupSystemAlertSettings(systemAlertSettings)
  }, [systemAlertSettings])

  const hasCopiedChannel = systemAlertSettings?.some((e) => e.type === AlertTypeEnum.COPY_TRADE && !!e.chatId)
  const hasWatchlistChannel = systemAlertSettings?.some((e) => e.type === AlertTypeEnum.TRADERS && !!e.chatId)

  const onGenerateSuccess = (state?: string) => {
    setIsOpenLinkBotModal(true)
    setCurrentState(state)
    setStateExpiredTime(dayjs().utc().add(5, 'minutes').valueOf())
  }
  const { generateLinkBot, isGeneratingLink } = useSettingChannels({ onGenerateSuccess })

  const handleGenerateLinkBot = useCallback(
    (type: AlertTypeEnum, customAlertId?: string) => {
      generateLinkBot({ type, customAlertId })
      setCurrentAlert({ type, customAlertId })
    },
    [generateLinkBot]
  )

  const handleDismiss = useCallback(() => {
    setIsOpenLinkBotModal(false)
  }, [])

  const contextValue: BotAlertContextValues = useMemo(
    () => ({
      stateExpiredTime,
      maxTraderAlert,
      traderAlerts,
      systemAlerts,
      customAlerts,
      loadingAlerts,
      loadingTraders,
      isProUser,
      isEliteUser,
      hasCopiedChannel,
      hasWatchlistChannel,
      isGeneratingLink,
      handleGenerateLinkBot,
      refetchAlerts,
      refetchTraders,
      currentPage,
      changeCurrentPage,
      openingModal: isOpenLinkBotModal,
      handleDismissModal: handleDismiss,
      handleResetState,
      botAlertState: currentState,
      currentAlert,
      keyword: searchText,
      setKeyword: setSearchText,
      userPermission,
      pagePermission,
      usage,
    }),
    [
      stateExpiredTime,
      maxTraderAlert,
      traderAlerts,
      systemAlerts,
      customAlerts,
      loadingAlerts,
      loadingTraders,
      isProUser,
      isEliteUser,
      hasCopiedChannel,
      hasWatchlistChannel,
      isGeneratingLink,
      handleGenerateLinkBot,
      refetchAlerts,
      refetchTraders,
      currentPage,
      isOpenLinkBotModal,
      handleDismiss,
      handleResetState,
      currentState,
      currentAlert,
      searchText,
      userPermission,
      pagePermission,
      usage,
    ]
  )

  const { setState } = useBotAlertContext()
  useEffect(() => {
    setState(contextValue)
  }, [contextValue])

  return null
})

const useBotAlertContext = create<BotAlertContextValues & BotAlertContextModifier>()(
  immer((set) => ({
    setState(newState) {
      set((state) => {
        state = { ...state, ...newState }
        return state
      })
    },
  }))
)

export default useBotAlertContext

const groupSystemAlertSettings = (settings: AlertSettingData[] = []): BotAlertData[] => {
  const copyTradeChannels = settings.filter((setting) => setting.type === AlertTypeEnum.COPY_TRADE)
  const traderAlertChannels = settings.filter((setting) => setting.type === AlertTypeEnum.TRADERS)
  const isCopyTradeStopped = copyTradeChannels.every((e) => e.isPause)
  const isTraderStopped = traderAlertChannels.every((e) => e.isPause)

  return [
    {
      id: 'copy',
      name: 'Copied traders',
      category: AlertCategoryEnum.SYSTEM,
      alertType: AlertTypeEnum.COPY_TRADE,
      enableAlert: !isCopyTradeStopped,
      channels: copyTradeChannels,
      createdAt: copyTradeChannels[0]?.createdAt ?? '',
      userId: copyTradeChannels[0]?.userId ?? '',
    },
    {
      id: 'trader',
      name: 'Watchlist traders',
      category: AlertCategoryEnum.SYSTEM,
      alertType: AlertTypeEnum.TRADERS,
      enableAlert: !isTraderStopped,
      channels: traderAlertChannels,
      createdAt: traderAlertChannels[0]?.createdAt ?? '',
      userId: traderAlertChannels[0]?.userId ?? '',
    },
  ]
}
