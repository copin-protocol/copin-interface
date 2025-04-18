import { SystemStatusData } from 'entities/system'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { SystemStatusPageEnum, SystemStatusSectionEnum, SystemStatusTypeEnum } from 'utils/config/enums'

export default function useGetPageStatus() {
  const systemAlert = useSystemConfigStore((s) => s.systemAlert)
  const listPageStatus = systemAlert.find(
    (alert) => alert.isActive && alert.section === SystemStatusSectionEnum.PAGE_STATUS
  )?.sectionData?.data as SystemStatusData[] | undefined
  const listMaintenancePage = listPageStatus
    ?.filter((v) => v.status !== SystemStatusTypeEnum.STABLE)
    ?.map((v) => v.feature as SystemStatusPageEnum)
  return { listPageStatus, listMaintenancePage }
}
