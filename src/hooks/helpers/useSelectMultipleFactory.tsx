import { useCallback, useEffect, useMemo, useRef } from 'react'

import useSelectMultipleState from 'hooks/helpers/useSelectMultipleState'

export interface SelectTraderContextValues {
  selectedSelections: string[] | null
  isSelectedAllSelection: boolean
  handleToggleSelection: (trader: string) => void
  handleToggleAllSelection: (isSelectedAll: boolean) => void
}

/**
 * only use for list string selection, with SelectWithCheckbox
 */
export default function useSelectMultipleFactory({
  storageKey,
  listSelection,
}: {
  listSelection: string[]
  storageKey: string
}) {
  const {
    state: { selectedSelections },
    dispatch,
  } = useSelectMultipleState({
    storage: sessionStorage,
    storageKey,
    allSelection: listSelection,
  })

  const handleToggleAllSelection = useCallback(
    (isSelectedAll: boolean) => {
      dispatch({ type: 'setSelections', payload: isSelectedAll ? null : [] })
    },
    [listSelection]
  )
  const handleToggleSelection = useCallback((trader: string) => {
    dispatch({ type: 'toggleSelection', payload: trader })
  }, [])

  const prevResTraderList = useRef<string[]>(listSelection)
  useEffect(() => {
    if (listSelection.length === prevResTraderList.current.length) return
    prevResTraderList.current = listSelection
    if (listSelection.length) {
      dispatch({ type: 'reCheckSelections', payload: { type: 'addNewer', value: listSelection } })
    }
  }, [listSelection])

  const result: SelectTraderContextValues = useMemo(() => {
    const isSelectedAllSelection = selectedSelections == null || selectedSelections.length === listSelection.length
    return {
      selectedSelections,
      isSelectedAllSelection,
      handleToggleAllSelection,
      handleToggleSelection,
    }
  }, [handleToggleAllSelection, handleToggleSelection, listSelection.length, selectedSelections])

  return result
}
