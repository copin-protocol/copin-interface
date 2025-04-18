import { useCallback, useMemo } from 'react'

import { SystemStatusData } from 'entities/system'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { ProtocolEnum, SystemStatusSectionEnum, SystemStatusTypeEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export default function useGetProtocolStatus() {
  const systemAlert = useSystemConfigStore((s) => s.systemAlert)
  const listProtocolStatus = useMemo(() => {
    return systemAlert.find((alert) => alert.isActive && alert.section === SystemStatusSectionEnum.PROTOCOL_STATUS)
      ?.sectionData?.data as SystemStatusData[] | undefined
  }, [systemAlert])
  const listProtocolUnstable = useMemo(
    () =>
      listProtocolStatus
        ?.filter((p) => p.dataStatus === SystemStatusTypeEnum.UNSTABLE)
        ?.map((p) => p.feature as ProtocolEnum) ?? [],
    [listProtocolStatus]
  )
  const listProtocolClosed = useMemo(
    () =>
      listProtocolStatus
        ?.filter((p) => p.dataStatus === SystemStatusTypeEnum.CLOSED)
        ?.map((p) => p.feature as ProtocolEnum) ?? [],
    [listProtocolStatus]
  )
  const protocolDataStatusMapping = useMemo(() => {
    return (listProtocolStatus?.reduce((result, data) => {
      return { ...result, [data.feature]: data.dataStatus }
    }, {}) ?? {}) as Record<ProtocolEnum, SystemStatusTypeEnum>
  }, [listProtocolStatus])
  const listProtocolMaintenance = useMemo(
    () => [...listProtocolUnstable, ...listProtocolClosed],
    [listProtocolClosed, listProtocolUnstable]
  )
  const getProtocolMaintenanceMessage = useCallback(
    (protocols: ProtocolEnum[]) => {
      const getListProtocolText = (protocolsMaintenance: ProtocolEnum[]) => {
        const listProtocolText = protocolsMaintenance
          .filter((p) => protocols.includes(p))
          .map((p) => {
            const config = PROTOCOL_OPTIONS_MAPPING[p]
            if (!config) return ''
            return config.text
          })
          .filter((v) => !!v)
        return listProtocolText
      }
      const result: string[] = []
      if (listProtocolUnstable.length) {
        const listProtocolText = getListProtocolText(listProtocolUnstable)
        if (listProtocolText.length) {
          const parsedUnstableMsg =
            listProtocolText.join(', ') + (listProtocolText.length > 1 ? ' are unstable' : ' is unstable')
          result.push(parsedUnstableMsg)
        }
      }
      if (listProtocolClosed.length) {
        const listProtocolText = getListProtocolText(listProtocolClosed)
        if (listProtocolText) {
          const parsedClosedMsg =
            listProtocolText.join(', ') + (listProtocolText.length > 1 ? ' have stopped operating' : ' is closed')
          result.push(parsedClosedMsg)
        }
      }
      return result
    },
    [listProtocolClosed, listProtocolUnstable]
  )
  const getProtocolMessage = useCallback(
    (protocol: ProtocolEnum) => {
      const status = protocolDataStatusMapping[protocol]
      const config = PROTOCOL_OPTIONS_MAPPING[protocol]
      if (status === SystemStatusTypeEnum.CLOSED) return `${config.text} has stopped operating`
      if (status === SystemStatusTypeEnum.UNSTABLE) return `The data of ${config.text} is unstable`
      return `${config.text} is working normally`
    },
    [protocolDataStatusMapping]
  )
  return {
    listProtocolStatus,
    listProtocolMaintenance,
    getProtocolMaintenanceMessage,
    protocolDataStatusMapping,
    getProtocolMessage,
  }
}
