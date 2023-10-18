import isEqual from 'lodash/isEqual'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ConditionFilterForm from 'components/ConditionFilterForm'
import { getDefaultFormValues } from 'components/ConditionFilterForm/helpers'
import { ConditionFilterFormProps } from 'components/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { Button } from 'theme/Buttons'
import { Box, Flex } from 'theme/base'

type ConditionFilterFormValues = ConditionFilterFormProps<TraderData>['formValues']
type FieldOption = ConditionFilterFormProps<TraderData>['fieldOptions']
type OnValuesChange = ConditionFilterFormProps<TraderData>['onValuesChange']
type FormType = ConditionFilterFormProps<TraderData>['type']

export type FilterFormProps = {
  initialFormValues: ConditionFilterFormValues
  fieldOptions: FieldOption
  onApply: (values: ConditionFilterFormValues) => void
  onReset: (formValueFactory?: (defaultResetFields: (keyof TraderData)[]) => ConditionFilterFormValues) => void
  onValuesChange?: OnValuesChange
  enabledApply: boolean
  formType?: FormType
}

export default function FilterForm({
  initialFormValues,
  fieldOptions,
  onApply,
  onReset,
  onValuesChange,
  enabledApply,
  formType,
}: FilterFormProps) {
  const [formValues, setFormValues] = useState(initialFormValues)

  const handleApply = () => {
    onApply(formValues)
    toast.success('Save filter success')
  }
  const handleReset = () => {
    onReset((defaultResetFields) => {
      const _formValues = getDefaultFormValues(defaultResetFields, fieldOptions)
      setFormValues(_formValues)
      return _formValues
    })
    toast.success('Reset filter success')
  }

  const hasChanged = enabledApply || !isEqual(initialFormValues, formValues)

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
        <ConditionFilterForm
          type={formType}
          formValues={formValues}
          setFormValues={setFormValues}
          fieldOptions={fieldOptions}
          onValuesChange={onValuesChange}
        />
      </Box>

      <Box
        sx={{
          width: '100%',
          px: 3,
        }}
      >
        <Flex
          sx={{
            justifyContent: 'right',
            alignItems: 'center',
            height: 40,
            width: '100%',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            gap: 12,
          }}
        >
          <Button px={0} variant="ghost" mr={3} onClick={handleReset} sx={{ fontWeight: 'normal' }}>
            Reset Default
          </Button>
          <Button
            px={0}
            variant="ghostPrimary"
            onClick={handleApply}
            disabled={!hasChanged}
            sx={{ fontWeight: 'normal' }}
          >
            Apply & Save
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}
