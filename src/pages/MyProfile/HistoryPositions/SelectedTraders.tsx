import isEqual from 'lodash/isEqual'
import { useEffect, useRef } from 'react'

import useCopyTraderAddresses from 'hooks/features/useCopyTraderAddresses'

import SelectTradersDropdown from '../SelectTradersDropdown'
import { DispatchSelectTraders } from './useSelectTraders'

export default function SelectedTraders({
  allTraders,
  selectedTraders,
  dispatch,
  onChangeTraders,
}: {
  allTraders: string[]
  selectedTraders: string[]
  dispatch: DispatchSelectTraders
  onChangeTraders: () => void
}) {
  const { listTraderAddresses, deletedTraderAddresses, tradersByProtocol } = useCopyTraderAddresses()

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

  if (!allTraders.length) return <></>

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
