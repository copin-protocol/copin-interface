import { useCallback } from 'react'

import { SystemStatusData } from 'entities/system'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { CopyTradePlatformEnum, SystemStatusSectionEnum, SystemStatusTypeEnum } from 'utils/config/enums'
import { PLATFORM_TEXT_TRANS } from 'utils/config/translations'

export default function useGetCopyExchangeStatus() {
  const systemAlert = useSystemConfigStore((s) => s.systemAlert)
  const listCopyExchangeStatus = systemAlert.find(
    (alert) => alert.isActive && alert.section === SystemStatusSectionEnum.COPY_EXCHANGE_STATUS
  )?.sectionData?.data as SystemStatusData[] | undefined
  const listExchangeDisabled = listCopyExchangeStatus
    ?.filter((e) => e.status !== SystemStatusTypeEnum.STABLE)
    ?.map((e) => e.feature as CopyTradePlatformEnum)
  const getExchangeMaintenanceMessage = useCallback(
    (exchanges?: CopyTradePlatformEnum[]) => {
      if (!listExchangeDisabled?.length) return ''
      const filterExchanges = listExchangeDisabled.filter((e) => (exchanges ? exchanges.includes(e) : true))
      if (!filterExchanges.length) return ''
      const exchangeStr = filterExchanges
        .map((p) => {
          const config = PLATFORM_TEXT_TRANS[p]
          if (!config) return ''
          return config
        })
        .filter((v) => !!v)
        .join(', ')

      const parsedMsg =
        'Copy trade via ' + exchangeStr + (filterExchanges.length > 1 ? ' are disabled' : ' is disabled')
      return parsedMsg
    },
    [listExchangeDisabled]
  )
  return { listCopyExchangeStatus, listExchangeDisabled, getExchangeMaintenanceMessage }
}
