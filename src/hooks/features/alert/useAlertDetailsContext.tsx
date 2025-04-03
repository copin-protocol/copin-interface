import { useResponsive } from 'ahooks'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getCustomAlertDetailsByIdApi, getCustomTraderGroupByIdApi, getTraderAlertListApi } from 'apis/alertApis'
import { ApiListResponse } from 'apis/api'
import { getListActiveCopiedTradersApi } from 'apis/copyTradeApis'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { PlanLimitData } from 'entities/system'
import { UserData } from 'entities/user'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import usePageChange from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { FilterTabEnum } from 'pages/Explorer/ConditionFilter/configs'
import useTradersCount from 'pages/Explorer/ConditionFilter/useTraderCount'
import { convertRangesFromConfigs } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/helpers'
import { TableSortProps } from 'theme/Table/types'
import {
  AlertCategoryEnum,
  AlertCustomType,
  AlertSettingsEnum,
  AlertTypeEnum,
  ProtocolEnum,
  SortTypeEnum,
  TimeFilterByEnum,
} from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

export interface AlertDetailsContextData {
  botAlert?: BotAlertData
  systemAlerts?: BotAlertData[]
  customAlerts?: ApiListResponse<BotAlertData>
  loadingAlerts?: boolean
  traderAlerts?: ApiListResponse<TraderAlertData>
  watchlistTraders?: ApiListResponse<TraderAlertData>
  copiedTraders?: ApiListResponse<TraderAlertData>
  groupTraders?: ApiListResponse<TraderAlertData>
  totalCopiedTraders?: number
  totalMatchingTraders?: number
  maxTraderAlert?: number
  isMobile: boolean
  myProfile?: UserData | null
  userAlertLimit?: PlanLimitData
  isCustomAlert: boolean
  isCreatingCustomAlert: boolean
  openDrawer: boolean
  currentStep?: AlertSettingsEnum
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentSort: TableSortProps<TraderAlertData> | undefined
  changeCurrentSort: (value: TableSortProps<TraderAlertData> | undefined) => void
  onChangeStep: (step: AlertSettingsEnum) => void
  onDismiss: () => void
}

const AlertSettingDetailsContext = createContext<AlertDetailsContextData>({} as AlertDetailsContextData)
export const AlertSettingDetailsProvider = ({ children }: { children: ReactNode }) => {
  const { alertType, alertId } = useParams<{ alertType: string; alertId?: string }>()
  const { searchParams, setSearchParams } = useSearchParams()
  const { myProfile } = useMyProfile()
  const { lg } = useResponsive()
  const isMobile = !lg
  const { traderAlerts, systemAlerts, loadingAlerts, maxTraderAlert } = useBotAlertContext()
  const [openDrawer, setOpenDrawer] = useState(false)
  const isCustomAlert = alertType?.toLowerCase() === AlertTypeEnum.CUSTOM?.toLowerCase()
  const isCreatingCustomAlert = isCustomAlert && alertId === 'new'

  const { data } = useQuery(
    [QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID, myProfile?.id, alertId, isCustomAlert],
    () => getCustomAlertDetailsByIdApi(alertId ?? ''),
    {
      enabled: !!myProfile?.id && isCustomAlert && !!alertId && alertId !== 'new',
      retry: 0,
      select: (data) => {
        return {
          ...data,
          category: AlertCategoryEnum.CUSTOM,
          alertType: AlertTypeEnum.CUSTOM,
        } as BotAlertData
      },
    }
  )

  const botAlert = isCustomAlert
    ? isCreatingCustomAlert
      ? ({
          id: 'new',
          name: 'Custom Alert',
          category: AlertCategoryEnum.CUSTOM,
          alertType: AlertTypeEnum.CUSTOM,
        } as BotAlertData)
      : data
    : systemAlerts?.find((alert) => alert?.id?.toLowerCase() === alertId?.toLowerCase())

  const [currentStep, setCurrentStep] = useState<AlertSettingsEnum | undefined>(() => {
    return (searchParams?.step as AlertSettingsEnum | undefined) ?? AlertSettingsEnum.TRADERS
  })

  const onChangeStep = (step: AlertSettingsEnum) => {
    setCurrentStep(step)
    setSearchParams({ step })
    if (!lg) {
      setOpenDrawer(true)
    }
  }

  const onReset = () => {
    setCurrentStep(undefined)
    setSearchParams({ step: undefined })
  }

  const onDismiss = () => {
    setOpenDrawer(false)
    onReset()
  }

  useEffect(() => {
    if (lg || openDrawer || !currentStep) return
    setOpenDrawer(true)
  }, [currentStep, lg, openDrawer])

  const limit = 10
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'page' })
  const [currentSort, setCurrentSort] = useState<TableSortProps<TraderAlertData> | undefined>(() => {
    const initSortBy = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<TraderAlertData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })

  const { data: watchlistTraders } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, currentPage, currentSort, limit, myProfile?.id],
    () =>
      getTraderAlertListApi({
        limit,
        offset: pageToOffset(currentPage, limit),
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      enabled: !!myProfile?.id && botAlert?.alertType === AlertTypeEnum.TRADERS,
      keepPreviousData: true,
      retry: 0,
    }
  )
  const { data: copiedTraders } = useQuery(
    [QUERY_KEYS.GET_COPIED_TRADER_ALERTS, myProfile?.id],
    () => getListActiveCopiedTradersApi({ limit }),
    {
      enabled: !!myProfile?.id && botAlert?.alertType === AlertTypeEnum.COPY_TRADE,
      retry: 0,
    }
  )
  const totalCopiedTraders = copiedTraders?.meta?.total ?? 0

  const { data: customTraders } = useTradersCount({
    ranges: convertRangesFromConfigs(botAlert?.config),
    type: botAlert?.config?.type ?? TimeFilterByEnum.S30_DAY,
    protocols: botAlert?.config?.protocol?.in as ProtocolEnum[],
    filterTab: FilterTabEnum.DEFAULT,
    enabled: !isCreatingCustomAlert && isCustomAlert,
  })
  const totalMatchingTraders = customTraders?.at?.(-1)?.counter ?? 0

  const { data: groupTraders } = useQuery(
    [QUERY_KEYS.GET_CUSTOM_TRADER_GROUP_BY_ID, myProfile?.id, botAlert?.id],
    () => getCustomTraderGroupByIdApi({ customAlertId: botAlert?.id, limit: 500 }),
    {
      enabled:
        !!myProfile?.id &&
        botAlert?.id !== 'new' &&
        botAlert?.alertType === AlertTypeEnum.CUSTOM &&
        botAlert?.type === AlertCustomType.TRADER_GROUP,
      retry: 0,
    }
  )

  const contextValue: AlertDetailsContextData = {
    myProfile,
    isMobile,
    isCustomAlert,
    botAlert,
    loadingAlerts,
    currentStep,
    openDrawer,
    isCreatingCustomAlert,
    systemAlerts,
    traderAlerts,
    watchlistTraders,
    copiedTraders,
    groupTraders,
    totalCopiedTraders,
    totalMatchingTraders,
    maxTraderAlert,
    currentPage,
    changeCurrentPage,
    currentSort,
    changeCurrentSort: setCurrentSort,
    onChangeStep,
    onDismiss,
  }

  return <AlertSettingDetailsContext.Provider value={contextValue}>{children}</AlertSettingDetailsContext.Provider>
}

export const useAlertSettingDetailsContext = () => {
  return useContext(AlertSettingDetailsContext)
}
