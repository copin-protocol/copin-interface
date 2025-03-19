import { useMemo } from 'react'

import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { CopyTradePlatformEnum } from 'utils/config/enums'

export default function useCheckCopyTradeExchange() {
  const { systemAlert } = useSystemConfigStore()
  const disabledExchanges = useMemo(() => {
    const result: CopyTradePlatformEnum[] = []
    const isDisabledGNS = systemAlert.find((v) => {
      return (
        v.type === 'copy_exchange' && v.data.exchange === CopyTradePlatformEnum.GNS_V8 && v.data.action === 'disabled'
      )
    })
    if (isDisabledGNS) result.push(CopyTradePlatformEnum.GNS_V8)
    return result
  }, [systemAlert])
  return { disabledExchanges }
}
