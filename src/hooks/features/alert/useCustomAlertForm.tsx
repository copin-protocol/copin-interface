import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { normalizeTraderPayload } from 'apis/traderApis'
import { RangeFilter } from 'apis/types'
import { getFiltersFromFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { BotAlertData, CustomAlertRequestData } from 'entities/alert'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import { getDefaultValues } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/helpers'
import { CustomAlertFormValues } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/types'
import { customSchema } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/yupSchemas'
import { AlertCustomType } from 'utils/config/enums'
import { getPairFromSymbol } from 'utils/helpers/transform'

interface CustomAlertFormProps {
  botAlert?: BotAlertData
  onSuccess?: () => void
}

export const useCustomAlertForm = ({ botAlert, onSuccess }: CustomAlertFormProps) => {
  const defaultValues = useMemo(() => getDefaultValues(botAlert), [botAlert])
  const methods = useForm<CustomAlertFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(customSchema),
  })
  const name = methods.watch('name')
  const description = methods.watch('description')
  const type = methods.watch('type')
  const protocols = methods.watch('protocols')
  const pairs = methods.watch('pairs')
  const condition = methods.watch('condition')
  const customType = methods.watch('customType')
  const traderGroupAdd = methods.watch('traderGroupAdd')
  const traderGroupUpdate = methods.watch('traderGroupUpdate')
  const traderGroupRemove = methods.watch('traderGroupRemove')

  const handleApplyTraderFilter = (filters: CustomAlertFormValues) => {
    methods.setValue('name', filters.name)
    methods.setValue('description', filters.description)
    methods.setValue('type', filters.type)
    methods.setValue('protocols', filters.protocols)
    methods.setValue('pairs', filters.pairs)
    methods.setValue('condition', filters.condition)
    methods.setValue('customType', AlertCustomType.TRADER_FILTER)
    methods.clearErrors()
  }

  const handleApplyTraderGroup = (form: CustomAlertFormValues) => {
    methods.setValue('name', form.name)
    methods.setValue('description', form.description)
    methods.setValue('traderGroupAdd', form.traderGroupAdd)
    methods.setValue('traderGroupUpdate', form.traderGroupUpdate)
    methods.setValue('traderGroupRemove', form.traderGroupRemove)
    methods.setValue('customType', form.customType)
    methods.clearErrors()
  }

  const { createCustomAlert, updateCustomAlert, submittingCreate, submittingUpdate } = useCustomAlerts({ onSuccess })

  const onSubmit = (values: CustomAlertFormValues) => {
    const { name, description, customType } = values
    const requestData = {
      name,
      description,
      type: customType,
    } as CustomAlertRequestData

    switch (customType) {
      case AlertCustomType.TRADER_FILTER:
        const { type, protocols, pairs, condition } = values
        if (!type && !protocols?.length && !pairs?.length && !condition?.length) {
          return
        }
        methods.clearErrors?.()
        const parsedCondition = condition ? getFiltersFromFormValues(condition) : []
        const ranges: RangeFilter[] = []
        if (!!protocols?.length) {
          ranges.push({
            fieldName: 'protocol',
            in: protocols,
          })
        }
        if (!!pairs?.length) {
          ranges.push({
            fieldName: 'pairs',
            in: pairs.map((e) => getPairFromSymbol(e)),
          })
        }
        const { ranges: normalizeCondition } = normalizeTraderPayload({ ranges: parsedCondition })
        requestData.queries = [{ fieldName: 'type', value: type }]
        requestData.ranges = [...ranges, ...(normalizeCondition ?? [])]
        break
      case AlertCustomType.TRADER_GROUP:
      case AlertCustomType.TRADER_BOOKMARK:
        const { traderGroupAdd, traderGroupUpdate, traderGroupRemove } = values
        methods.clearErrors?.()
        requestData.traderGroup = {
          upsert: [...(traderGroupAdd ?? []), ...(traderGroupUpdate ?? [])],
          remove: traderGroupRemove,
        }
        break
    }

    if (!botAlert?.id || botAlert?.id === 'new') {
      createCustomAlert(requestData)
    } else {
      updateCustomAlert({ id: botAlert?.id, data: requestData })
    }
  }

  return {
    methods,
    defaultValues,
    name,
    description,
    customType,
    traderFilter: {
      type,
      protocols,
      pairs,
      condition,
    },
    traderGroup: {
      traderGroupAdd,
      traderGroupUpdate,
      traderGroupRemove,
    },
    handleApplyTraderFilter,
    handleApplyTraderGroup,
    onSubmit,
    submitting: submittingCreate || submittingUpdate,
  }
}
