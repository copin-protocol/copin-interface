import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Button } from 'theme/Buttons'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Flex, Type } from 'theme/base'

export type Values = {
  lte?: number
  gte?: number
}

export default function TableRangeFilter({
  defaultValues,
  onApply,
  onReset,
  unit,
}: {
  defaultValues: Values
  onApply: (values: Values) => void
  onReset: () => void
  unit: string
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Values>()
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const enableReset = Object.values(defaultValues).some((v) => !!v)
  const enableApply = isDirty
  return (
    <form onSubmit={handleSubmit((values) => onApply(values))}>
      <Flex sx={{ width: '100%', gap: 3, '.input_wrapper': { bg: 'neutral6', borderColor: 'neutral4' } }}>
        <NumberInputField control={control} name="gte" label={'From'} suffix={unit} placeholder="No minimum" />
        <NumberInputField control={control} name="lte" label={'To'} suffix={unit} placeholder="No maximum" />
      </Flex>
      <Flex mt={12} sx={{ width: '100%', justifyContent: 'end' }}>
        <Flex sx={{ gap: 24 }}>
          <Type.Caption
            role="button"
            onClick={enableReset ? onReset : undefined}
            color={enableReset ? 'neutral1' : 'neutral3'}
            sx={{ cursor: enableReset ? 'pointer' : 'not-allowed' }}
          >
            Reset
          </Type.Caption>
          <Button
            variant="ghostPrimary"
            color="inherit"
            type="submit"
            sx={{ p: 0, color: 'primary1', '&:hover': { color: 'primary2' }, fontWeight: 'normal' }}
            disabled={!enableApply}
          >
            Apply
          </Button>
        </Flex>
      </Flex>
    </form>
  )
}

const commonSchema = {}

export const schema = yup.object({
  lte: yup.number().nullable(),
  gte: yup.boolean().nullable(),
})
