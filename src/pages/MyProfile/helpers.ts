import { CopyTradeData } from 'entities/copyTrade'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'

export type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
export type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

export function getTradersByProtocolFromCopyTrade(
  copyTrades: CopyTradeData[] | undefined,
  allTraders: string[] | undefined
) {
  if (!copyTrades?.length || !allTraders?.length) return undefined
  const checkerMapping: Record<string, { [protocol: string]: boolean }> = {}
  const tradersByProtocol = copyTrades?.reduce((result, copyTrade) => {
    if (checkerMapping[copyTrade.account]?.[copyTrade.protocol] || !allTraders.includes(copyTrade.account))
      return result
    checkerMapping[copyTrade.account] = { [copyTrade.protocol]: true }
    result[copyTrade.protocol] = [
      ...(result[copyTrade.protocol] ?? []),
      { address: copyTrade.account, status: copyTrade.status === CopyTradeStatusEnum.RUNNING ? 'copying' : 'deleted' },
    ]
    return result
  }, {} as TradersByProtocolData)
  return tradersByProtocol
}
