import { ProtocolEnum } from 'utils/config/enums'

type FoundTraderData = {
  account?: string | undefined
  protocol?: ProtocolEnum | undefined
}

export function filterFoundData<T extends FoundTraderData>(
  tradersData: T[] | undefined,
  sourceTrader: FoundTraderData
) {
  return !!tradersData?.length && !!sourceTrader.account && !!sourceTrader.protocol
    ? tradersData.filter((data) => data.account !== sourceTrader.account || data.protocol !== sourceTrader.protocol)
    : []
}
