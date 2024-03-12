import { createGlobalStyle } from 'styled-components/macro'

import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import { VOLUME_LIMIT } from 'utils/config/constants'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_IDS } from 'utils/config/keys'

export default function WarningLimitVolume() {
  const { listWarning } = useLimitVolume()
  const key = listWarning?.length
    ? listWarning
        .map((data) => {
          return `[${DATA_ATTRIBUTES.TRADER_COPY_VOLUME_WARNING}="${data.account}-${data.protocol}"]`
        })
        .join(',')
    : ''
  const GlobalStyle = createGlobalStyle`
    ${key ? `${key} { display: block }` : ''} 
  `
  if (!listWarning?.length) return null

  return <GlobalStyle />
}

function useLimitVolume() {
  const { allCopyTrades } = useAllCopyTrades()
  if (!allCopyTrades?.length) {
    // const bingXInfoWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
    // if (!!bingXInfoWrapper) {
    //   bingXInfoWrapper.style.cssText = ''
    // }
    return { listWarning: null }
  }
  const copyTradeVolumeMapping = allCopyTrades.reduce<
    Record<string, { key: string; totalVolume: number; account: string; copyWalletId: string; protocol: ProtocolEnum }>
  >((result, copyTrade) => {
    if (copyTrade.status !== CopyTradeStatusEnum.RUNNING) return result
    const key = copyTrade.account + copyTrade.protocol
    return {
      ...result,
      [key]: {
        key,
        totalVolume: (result?.[key]?.totalVolume ?? 0) + copyTrade.volume * copyTrade.leverage,
        account: copyTrade.account,
        copyWalletId: copyTrade.copyWalletId,
        protocol: copyTrade.protocol,
      },
    }
  }, {})
  const listWarning = Object.values(copyTradeVolumeMapping)
    .filter((data) => {
      return data.totalVolume > VOLUME_LIMIT
    })
    .sort((a, b) => a.totalVolume - b.totalVolume)

  // if (!!listWarning?.[0]) {
  //   const bingXInfoWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
  //   if (!!bingXInfoWrapper) {
  //     bingXInfoWrapper.style.cssText = 'max-height: 0px !important; min-height: 0px !important; padding: 0px !important'
  //   }
  // }

  return { listWarning }
}
