import { Trans } from '@lingui/macro'
import isEqual from 'lodash/isEqual'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { protocolOptions } from 'components/@copyTrade/configs'
import ToastBody from 'components/@ui/ToastBody'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { AlertCustomType, TimeFilterByEnum } from 'utils/config/enums'

import { normalizeCondition } from '../helpers'
import { CustomAlertFormValues } from '../types'
import { TraderFilterState } from './types'

interface UseTraderFilterStateProps {
  defaultValues?: CustomAlertFormValues
  onApply: (filters: CustomAlertFormValues) => void
}

/**
 * Custom hook for TraderFilter state management
 */
export const useTraderFilterState = ({ defaultValues, onApply }: UseTraderFilterStateProps) => {
  // Form state
  const [name, setName] = useState<string | undefined>(defaultValues?.name)
  const [description, setDescription] = useState<string | undefined>(defaultValues?.description)
  const [timeFrame, setTimeFrame] = useState<TimeFilterByEnum>(defaultValues?.type ?? TimeFilterByEnum.S30_DAY)
  const [protocols, setProtocols] = useState<string[] | 'all'>(
    !!defaultValues?.protocols?.length ? defaultValues?.protocols : 'all'
  )
  const [pairs, setPairs] = useState<string[] | 'all'>(!!defaultValues?.pairs?.length ? defaultValues?.pairs : 'all')
  const [conditionFormValues, setConditionFormValues] = useState<ConditionFormValues<TraderData>>(
    defaultValues?.condition ?? []
  )

  // Market options
  const { getListSymbolOptions } = useMarketsConfig()
  const pairOptions = useMemo(() => {
    const allOptions = getListSymbolOptions?.()
    if (!allOptions?.length) return []
    allOptions.unshift({ id: 'all', value: 'all', label: 'All Pairs' })
    return allOptions
  }, [getListSymbolOptions])

  // Protocol options
  const _protocolOptions = useMemo(() => {
    const allOptions = [...protocolOptions]
    if (!allOptions?.length) return []
    allOptions.unshift({ value: 'all', label: <Trans>All Protocols</Trans> })
    return allOptions
  }, [])

  // Check for changes in form state
  const hasChange = useMemo(() => {
    const defaultState: TraderFilterState = {
      name: defaultValues?.name,
      description: defaultValues?.description,
      timeFrame: defaultValues?.type ?? TimeFilterByEnum.S30_DAY,
      protocols: !!defaultValues?.protocols?.length ? defaultValues?.protocols : 'all',
      pairs: !!defaultValues?.pairs?.length ? defaultValues?.pairs : 'all',
      condition: normalizeCondition(defaultValues?.condition),
    }

    const currentState: TraderFilterState = {
      name,
      description,
      timeFrame,
      protocols,
      pairs,
      condition: normalizeCondition(conditionFormValues),
    }

    return !isEqual(defaultState, currentState)
  }, [
    conditionFormValues,
    defaultValues?.condition,
    defaultValues?.description,
    defaultValues?.name,
    defaultValues?.pairs,
    defaultValues?.protocols,
    defaultValues?.type,
    description,
    name,
    pairs,
    protocols,
    timeFrame,
  ])

  // Apply filter handler
  const handleApplyFilter = useCallback(
    (form?: CustomAlertFormValues) => {
      // Validation
      if (
        (!protocols || protocols.length === 0) &&
        (!pairs || pairs.length === 0) &&
        (!conditionFormValues || conditionFormValues.length === 0)
      ) {
        toast.error(<ToastBody title="Failed" message="Please select at least one filter condition" />)
        return
      }

      // Apply filters
      onApply({
        name: form?.name ?? name,
        description: form?.description ?? description,
        type: timeFrame,
        protocols: protocols === 'all' ? [] : protocols,
        pairs: pairs === 'all' ? [] : pairs,
        condition: conditionFormValues,
        customType: AlertCustomType.TRADER_FILTER,
      })
    },
    [conditionFormValues, description, name, onApply, pairs, protocols, timeFrame]
  )

  // Reset filter handler
  const handleResetFilter = useCallback(() => {
    setName(defaultValues?.name)
    setDescription(defaultValues?.description)
    setTimeFrame(defaultValues?.type ?? TimeFilterByEnum.S30_DAY)
    setProtocols(!!defaultValues?.protocols?.length ? defaultValues?.protocols : 'all')
    setPairs(!!defaultValues?.pairs?.length ? defaultValues?.pairs : 'all')
    setConditionFormValues(defaultValues?.condition ?? [])
  }, [
    defaultValues?.condition,
    defaultValues?.description,
    defaultValues?.name,
    defaultValues?.pairs,
    defaultValues?.protocols,
    defaultValues?.type,
  ])

  return {
    // State
    name,
    setName,
    description,
    setDescription,
    timeFrame,
    setTimeFrame,
    protocols,
    setProtocols,
    pairs,
    setPairs,
    conditionFormValues,
    setConditionFormValues,

    // Derived state
    hasChange,
    protocolOptions: _protocolOptions,
    pairOptions,

    // Actions
    handleApplyFilter,
    handleResetFilter,
  }
}
