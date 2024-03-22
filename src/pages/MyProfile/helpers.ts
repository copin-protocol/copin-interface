import isEqual from 'lodash/isEqual'

import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
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

export function toggleSelectedItem<T>({
  item,
  selected,
  checkSelected,
}: {
  item: T
  selected: T[] | undefined
  checkSelected: (source: T, target: T) => boolean
}) {
  const isSelected = selected?.some((_item) => checkSelected(_item, item))
  let newSelected = [...(selected ?? [])]
  if (isSelected) {
    newSelected = newSelected.filter((_item) => !checkSelected(_item, item))
  } else {
    newSelected = [...newSelected, item]
  }
  return newSelected
}

export function checkEqualWallets(source: CopyWalletData[] | undefined, target: CopyWalletData[] | undefined) {
  if (!source?.length || !target?.length) return false
  const sourceIds = source.map((wallet) => wallet.id)
  const targetIds = target.map((wallet) => wallet.id)
  return isEqual(sourceIds, targetIds)
}
