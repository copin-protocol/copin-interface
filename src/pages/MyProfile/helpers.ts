import isEqual from 'lodash/isEqual'

import { CopyWalletData } from 'entities/copyWallet'

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
