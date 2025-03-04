import { useResponsive } from 'ahooks'
import { ReactNode, createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { PlanLimitData } from 'entities/system'
import { UserData } from 'entities/user'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useMyProfile from 'hooks/store/useMyProfile'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { AlertCategoryEnum, AlertSettingsEnum, AlertTypeEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'

export enum TabKeyEnum {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export interface AlertDashboardContextData {
  systemAlerts?: BotAlertData[]
  customAlerts?: ApiListResponse<BotAlertData>
  loadingAlerts?: boolean
  traderAlerts?: ApiListResponse<TraderAlertData>
  maxTraderAlert?: number
  isVIPUser?: boolean | null
  isMobile: boolean
  myProfile?: UserData | null
  userAlertLimit?: PlanLimitData
  totalCustoms: number
  maxCustoms: number
  isLimited: boolean
  currentPage?: number
  changeCurrentPage?: (page: number) => void
  keyword?: string
  setKeyword?: (keyword: string) => void
  tab: TabKeyEnum
  setTab: (tab: TabKeyEnum) => void
  handleCreateCustomAlert: () => void
}
const AlertDashboardContext = createContext<AlertDashboardContextData>({} as AlertDashboardContextData)
export function AlertDashboardProvider({ children }: { children: ReactNode }) {
  const {
    totalCustomAlerts,
    systemAlerts,
    customAlerts,
    loadingAlerts,
    traderAlerts,
    maxTraderAlert,
    isVIPUser,
    currentPage,
    changeCurrentPage,
    keyword,
    setKeyword,
  } = useBotAlertContext()
  const { lg } = useResponsive()
  const isMobile = !lg

  const history = useHistory()
  const { myProfile } = useMyProfile()
  const { subscriptionLimit } = useSystemConfigStore()
  const userAlertLimit = subscriptionLimit?.[myProfile?.plan ?? SubscriptionPlanEnum.BASIC]
  const totalCustoms = totalCustomAlerts ?? 0
  const maxCustoms = userAlertLimit?.customAlerts ?? 0
  const isLimited = totalCustoms >= maxCustoms
  const [tab, setTab] = useState(TabKeyEnum.SYSTEM)

  const handleCreateCustomAlert = () => {
    history.push(
      generateAlertSettingDetailsRoute({
        id: 'new',
        type: AlertCategoryEnum.CUSTOM,
        params: { step: AlertSettingsEnum.TRADERS, type: AlertTypeEnum.CUSTOM },
      })
    )
  }
  const contextValue: AlertDashboardContextData = {
    systemAlerts,
    customAlerts,
    loadingAlerts,
    traderAlerts,
    maxTraderAlert,
    isVIPUser,
    isMobile,
    myProfile,
    userAlertLimit,
    totalCustoms,
    maxCustoms,
    isLimited,
    currentPage,
    changeCurrentPage,
    keyword,
    setKeyword,
    tab,
    setTab,
    handleCreateCustomAlert,
  }

  return <AlertDashboardContext.Provider value={contextValue}>{children}</AlertDashboardContext.Provider>
}

const useAlertDashboardContext = () => useContext(AlertDashboardContext)
export default useAlertDashboardContext
