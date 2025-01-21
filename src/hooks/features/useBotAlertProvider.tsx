import dayjs from 'dayjs'
import React, { ReactNode, createContext, useContext, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { generateLinkBotAlertApi, getBotAlertApi, getTraderAlertListApi } from 'apis/alertApis'
import { ApiListResponse } from 'apis/api'
import ToastBody from 'components/@ui/ToastBody'
import LinkBotAlertModal from 'components/@widgets/LinkBotAlertModal'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import useMyProfile from 'hooks/store/useMyProfile'
import { MAX_TRADER_ALERT_BASIC, MAX_TRADER_ALERT_PREMIUM, MAX_TRADER_ALERT_VIP } from 'utils/config/constants'
import { AlertTypeEnum, TelegramTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

import { useIsPremium, useIsVIP } from './useSubscriptionRestrict'

export interface BotAlertContextValues {
  stateExpiredTime?: number
  maxTraderAlert: number
  botAlert: BotAlertData | undefined
  botAlerts: ApiListResponse<BotAlertData> | undefined
  traderAlerts: ApiListResponse<TraderAlertData> | undefined
  loadingAlerts: boolean
  loadingTraders: boolean
  isPremiumUser: boolean | null
  isVIPUser: boolean | null
  isGeneratingLink: boolean
  handleGenerateLinkBot: () => void
  refetchAlerts: () => void
  refetchTraders: () => void
  // isOpenLinkBotModal: boolean
  // currentState?: string
  // setIsOpenLinkBotModal: (data: boolean) => void
}

export const BotAlertContext = createContext({} as BotAlertContextValues)

const LIMIT_TRADERS = 10

export function BotAlertProvider({ children }: { children: ReactNode }) {
  const isPremiumUser = useIsPremium()
  const isVIPUser = useIsVIP()
  const { myProfile } = useMyProfile()
  const [isOpenLinkBotModal, setIsOpenLinkBotModal] = useState(false)
  const [currentState, setCurrentState] = useState<string | undefined>()
  const [stateExpiredTime, setStateExpiredTime] = useState<number | undefined>()

  const maxTraderAlert = isVIPUser
    ? MAX_TRADER_ALERT_VIP
    : isPremiumUser
    ? MAX_TRADER_ALERT_PREMIUM
    : MAX_TRADER_ALERT_BASIC

  function onReset() {
    setIsOpenLinkBotModal(false)
    setCurrentState(undefined)
    setStateExpiredTime(undefined)
  }

  const {
    data: botAlert,
    isLoading: loadingAlerts,
    refetch: refetchAlerts,
  } = useQuery([QUERY_KEYS.GET_BOT_ALERT, myProfile?.id], () => getBotAlertApi(), {
    enabled: !!myProfile?.id,
    retry: 0,
    refetchInterval:
      !!currentState && !!stateExpiredTime && dayjs().utc().isBefore(dayjs.utc(stateExpiredTime)) ? 5000 : undefined,
    onSuccess: (data) => {
      if (data && data.chatId && currentState && stateExpiredTime) {
        onReset()
      }
    },
  })

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

  const botAlerts = {
    data: [
      {
        ...botAlert,
        id: AlertTypeEnum.COPY_TRADE,
        name: 'Copied traders',
        type: AlertTypeEnum.COPY_TRADE,
        telegramType: TelegramTypeEnum.DIRECT,
        isRunning: true,
      },
      {
        ...botAlert,
        id: AlertTypeEnum.TRADERS,
        name: `Watchlist traders`,
        type: AlertTypeEnum.TRADERS,
        telegramType: TelegramTypeEnum.DIRECT,
        isRunning: true,
      },
    ],
    meta: {
      total: 2,
      totalPages: 1,
      offset: 0,
      limit: 10,
    },
  } as ApiListResponse<BotAlertData>

  const { mutate: generateLinkBot, isLoading: isGeneratingLink } = useMutation(generateLinkBotAlertApi, {
    onSuccess: (state?: string) => {
      setIsOpenLinkBotModal(true)
      setCurrentState(state)
      setStateExpiredTime(dayjs().utc().add(20, 'seconds').valueOf())
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const handleGenerateLinkBot = () => {
    generateLinkBot()
  }
  const handleDismiss = () => {
    setIsOpenLinkBotModal(false)
  }

  const contextValue: BotAlertContextValues = {
    stateExpiredTime,
    maxTraderAlert,
    traderAlerts,
    botAlert,
    botAlerts,
    loadingAlerts,
    loadingTraders,
    isPremiumUser,
    isVIPUser,
    isGeneratingLink,
    handleGenerateLinkBot,
    refetchAlerts,
    refetchTraders,
    // isOpenLinkBotModal,
    // setIsOpenLinkBotModal,
    // currentState,
  }

  return (
    <BotAlertContext.Provider value={contextValue}>
      {children}
      {isOpenLinkBotModal && currentState && (
        <LinkBotAlertModal
          state={currentState}
          stateExpiredTime={stateExpiredTime}
          onReset={onReset}
          onDismiss={handleDismiss}
        />
      )}
    </BotAlertContext.Provider>
  )
}

const useBotAlertContext = () => useContext(BotAlertContext)
export default useBotAlertContext
