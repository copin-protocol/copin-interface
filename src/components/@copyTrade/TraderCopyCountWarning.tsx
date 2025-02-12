import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getTraderCopyCount } from 'apis/copyTradeApis'
import { generateTraderCountWarningStyle } from 'components/@copyTrade/TraderCopyCountWarningIcon'
import { CopyTradeData } from 'entities/copyTrade'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import { Box } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { getTradersByProtocolFromCopyTrade } from './helpers'

// Place this component right before the wrapper that contains TraderCopyCountWarningIcon
const COPY_COUNT_LIMIT = 10
export function TraderCopyCountWarning({
  allCopyTrades,
  traderAddresses,
}: {
  allCopyTrades: CopyTradeData[] | undefined
  traderAddresses: string[] | undefined
}) {
  const traderAddressesByProtocol = useMemo(() => {
    const tradersByProtocol = getTradersByProtocolFromCopyTrade(allCopyTrades, traderAddresses)
    if (!tradersByProtocol) return undefined
    return Object.entries(tradersByProtocol).reduce<Record<ProtocolEnum, string[]>>((result, [protocol, data]) => {
      return { ...result, [protocol]: data.map((_data) => _data.address) }
    }, {} as Record<ProtocolEnum, string[]>)
  }, [allCopyTrades, traderAddresses])
  const { data: traderCopyCount } = useQuery(
    [QUERY_KEYS.GET_TRADER_COPY_COUNT, traderAddressesByProtocol],
    () => {
      async function getData() {
        if (!traderAddressesByProtocol) return undefined
        const objects = Object.entries(traderAddressesByProtocol)
        const result = {} as Record<ProtocolEnum, string[]>
        for (const object of objects) {
          const _key = object[0] as ProtocolEnum
          const _value = object[1] as string[]
          const data = await getTraderCopyCount({
            protocol: _key,
            accounts: _value,
          })
          result[_key] = data.filter((_data) => _data.count >= COPY_COUNT_LIMIT).map((_data) => _data.account)
        }
        return result
      }
      return getData()
    },
    {
      retry: 0,
      enabled: !!traderAddressesByProtocol,
    }
  )

  const isPremium = useIsPremium()

  if (!traderCopyCount || isPremium == null) return null
  const styles = Object.entries(traderCopyCount).reduce((result, [protocol, addresses]) => {
    return { ...result, ...generateTraderCountWarningStyle(addresses, protocol as ProtocolEnum, isPremium) }
  }, {})
  return (
    <Box
      sx={{
        '&+*': styles,
      }}
    />
  )
}
