import { ProtocolEnum } from 'utils/config/enums'

type FoundTraderData = {
  account?: string | undefined
  protocol?: ProtocolEnum | undefined
}

export function filterFoundData<T extends FoundTraderData>(
  tradersData: T[] | undefined,
  ignoreTraders: FoundTraderData[]
) {
  return !!tradersData?.length
    ? tradersData.filter((data) => {
        let accepted = true
        for (const ignoreTrader of ignoreTraders) {
          if (ignoreTrader.account === data.account && ignoreTrader.protocol === data.protocol) accepted = false
        }
        return accepted
      })
    : []
}
