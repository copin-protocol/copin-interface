import isEqual from 'lodash/isEqual'
import { useEffect, useRef } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useAllCopyTrades from 'hooks/features/useAllCopyTrades'

import SelectCopyTradesDropdown from '../SelectCopyTradesDropdown'
import { DispatchFilterActivities } from './useFilterActivities'

export default function SelectedCopyTrades({
  selectedWallets,
  allCopyTrades,
  selectedCopyTrades,
  dispatch,
  onChangeCopyTrades,
}: {
  selectedWallets: CopyWalletData[]
  allCopyTrades: CopyTradeData[]
  selectedCopyTrades: CopyTradeData[]
  dispatch: DispatchFilterActivities
  onChangeCopyTrades: () => void
}) {
  const { allCopyTrades: data } = useAllCopyTrades()
  const availableAllCopyTrades = data?.filter(
    (copyTrade) => selectedWallets?.findIndex((e) => e.id === copyTrade.copyWalletId) !== -1
  )

  const handleSelectAllCopyTrades = (isSelectedAll: boolean) => {
    if (!availableAllCopyTrades?.length) return
    if (isSelectedAll) {
      dispatch({ type: 'setAllCopyTrades' })
    } else {
      dispatch({ type: 'setCopyTrades', payload: [] })
    }
    onChangeCopyTrades()
  }

  const handleToggleCopyTrade = (copyTrade: CopyTradeData) => {
    dispatch({ type: 'toggleCopyTrade', payload: copyTrade })
    onChangeCopyTrades()
  }

  const prevAllCopyTrades = useRef(allCopyTrades)
  useEffect(() => {
    if (isEqual(prevAllCopyTrades.current, availableAllCopyTrades)) return
    prevAllCopyTrades.current = availableAllCopyTrades ?? []
    dispatch({
      type: 'setState',
      payload: {
        selectedCopyTrades: availableAllCopyTrades,
        allCopyTrades: availableAllCopyTrades,
      },
    })
  }, [availableAllCopyTrades])

  if (!allCopyTrades?.length) return <></>

  return (
    <SelectCopyTradesDropdown
      allCopyTrades={allCopyTrades}
      selectedCopyTrades={selectedCopyTrades ?? []}
      handleSelectAllCopyTrades={handleSelectAllCopyTrades}
      handleToggleCopyTrade={handleToggleCopyTrade}
    />
  )
}
