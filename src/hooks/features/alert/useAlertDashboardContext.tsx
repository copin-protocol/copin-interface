import { useResponsive } from 'ahooks'
import { ReactNode, createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { AlertPermission, AlertPermissionConfig } from 'entities/permission'
import { SubscriptionUsageData } from 'entities/subscription'
import { UserData } from 'entities/user'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useMyProfile from 'hooks/store/useMyProfile'
import { AlertCategoryEnum, AlertSettingsEnum, AlertTypeEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'

export enum TabKeyEnum {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export interface AlertDashboardContextData {
  usage?: SubscriptionUsageData
  systemAlerts?: BotAlertData[]
  customAlerts?: ApiListResponse<BotAlertData>
  loadingAlerts?: boolean
  traderAlerts?: ApiListResponse<TraderAlertData>
  maxTraderAlert?: number
  isEliteUser?: boolean | null
  isMobile: boolean
  myProfile?: UserData | null
  userPermission?: AlertPermissionConfig
  pagePermission?: AlertPermission
  customRequiredPlan: SubscriptionPlanEnum
  userCustomNextPlan?: SubscriptionPlanEnum | null
  isAvailableCustomAlert?: boolean | null
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
  openLimitModal: boolean
  setOpenLimitModal: (data: boolean) => void
}
const AlertDashboardContext = createContext<AlertDashboardContextData>({} as AlertDashboardContextData)
export function AlertDashboardProvider({ children }: { children: ReactNode }) {
  const {
    usage,
    systemAlerts,
    customAlerts,
    loadingAlerts,
    traderAlerts,
    maxTraderAlert,
    isEliteUser,
    currentPage,
    changeCurrentPage,
    keyword,
    setKeyword,
    userPermission,
    pagePermission,
  } = useBotAlertContext()
  const { lg } = useResponsive()
  const isMobile = !lg

  // TODO: SUB 3
  const history = useHistory()
  const { myProfile } = useMyProfile()
  const totalCustoms = usage?.customAlerts ?? 0
  const maxCustoms = userPermission?.customPersonalQuota ?? 0
  const isLimited = totalCustoms >= maxCustoms
  const [tab, setTab] = useState(TabKeyEnum.SYSTEM)
  const [openLimitModal, setOpenLimitModal] = useState(false)

  const { isAvailableCustomAlert, customRequiredPlan, userCustomNextPlan } = useAlertPermission()

  const handleCreateCustomAlert = () => {
    if (isLimited) {
      setOpenLimitModal(true)
    } else {
      history.push(
        generateAlertSettingDetailsRoute({
          id: 'new',
          type: AlertCategoryEnum.CUSTOM,
          params: { step: AlertSettingsEnum.TRADERS, type: AlertTypeEnum.CUSTOM },
        })
      )
    }
  }
  const contextValue: AlertDashboardContextData = {
    systemAlerts,
    customAlerts,
    loadingAlerts,
    traderAlerts,
    maxTraderAlert,
    isEliteUser,
    isMobile,
    myProfile,
    userPermission,
    pagePermission,
    customRequiredPlan,
    userCustomNextPlan,
    isAvailableCustomAlert,
    totalCustoms,
    maxCustoms,
    isLimited,
    usage,
    currentPage,
    changeCurrentPage,
    keyword,
    setKeyword,
    tab,
    setTab,
    handleCreateCustomAlert,
    openLimitModal,
    setOpenLimitModal,
  }

  return <AlertDashboardContext.Provider value={contextValue}>{children}</AlertDashboardContext.Provider>
}

const useAlertDashboardContext = () => useContext(AlertDashboardContext)
export default useAlertDashboardContext
