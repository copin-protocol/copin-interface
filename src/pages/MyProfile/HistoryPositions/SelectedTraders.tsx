import isEqual from 'lodash/isEqual'
import { useEffect, useRef } from 'react'

import useCopyTraderAddresses from 'hooks/features/useCopyTraderAddresses'

import SelectTradersDropdown from '../SelectTradersDropdown'
import { DispatchSelectTraders } from './useFilterHistory'

export default function SelectedTraders({
  copyWalletIds,
  allTraders,
  selectedTraders,
  dispatch,
  onChangeTraders,
}: {
  copyWalletIds: string[] | undefined
  allTraders: string[]
  selectedTraders: string[]
  dispatch: DispatchSelectTraders
  onChangeTraders: () => void
}) {
  const _copyWalletIds = copyWalletIds == null ? undefined : copyWalletIds.length ? copyWalletIds : ['']
  const { listTraderAddresses, deletedTraderAddresses, tradersByProtocol } = useCopyTraderAddresses({
    copyWalletIds: _copyWalletIds,
  })

  const handleSelectAllTraders = (isSelectedAll: boolean) => {
    if (!listTraderAddresses.length) return
    if (isSelectedAll) {
      dispatch({ type: 'setTraders', payload: [] })
    } else {
      dispatch({ type: 'setTraders', payload: listTraderAddresses })
    }
    onChangeTraders()
  }

  const handleToggleTrader = (address: string) => {
    dispatch({ type: 'toggleTrader', payload: address })
    onChangeTraders()
  }

  const prevAllTraders = useRef(allTraders)
  useEffect(() => {
    if (isEqual(prevAllTraders.current, listTraderAddresses)) return
    prevAllTraders.current = listTraderAddresses
    dispatch({
      type: 'setState',
      payload: {
        selectedTraders: listTraderAddresses,
        deletedTraders: deletedTraderAddresses,
        allTraders: listTraderAddresses,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTraderAddresses])

  return (
    <SelectTradersDropdown
      allTraders={allTraders}
      selectedTraders={selectedTraders}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      tradersByProtocol={tradersByProtocol}
    />
  )
}
