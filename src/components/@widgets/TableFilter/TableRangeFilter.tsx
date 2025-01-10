import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex } from 'theme/base'

import { generateRangeFilterKey } from './helpers'
import { TableRangeFilterValues } from './types'

export default function TableRangeFilter({
  defaultValues,
  onApply,
  urlKeys,
  labels,
  onReset,
  units,
}: {
  defaultValues: TableRangeFilterValues
  urlKeys: string[]
  labels?: ReactNode[]
  onApply: (filter: TableRangeFilterValues) => void
  onReset: () => void
  units: string[]
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TableRangeFilterValues>()
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const enableReset = [...Object.values(defaultValues).flat(Infinity)].some((v) => !!v)
  const enableApply = isDirty
  return (
    <form onSubmit={handleSubmit((values) => onApply(values))}>
      <Flex sx={{ flexDirection: 'column', gap: 3, width: '100%' }}>
        {urlKeys.map((key, index) => {
          const { gteKey, lteKey } = generateRangeFilterKey({ key })
          const label = labels?.[index]
          const unit = units?.[index]
          return (
            <Box key={key}>
              {!!label && <Label label={label} labelColor="neutral1" />}
              <Flex sx={{ width: '100%', gap: 3, '.input_wrapper': { bg: 'neutral6', borderColor: 'neutral4' } }}>
                <NumberInputField
                  control={control}
                  name={gteKey}
                  label={'From'}
                  suffix={unit}
                  placeholder="No minimum"
                />
                <NumberInputField control={control} name={lteKey} label={'To'} suffix={unit} placeholder="No maximum" />
              </Flex>
            </Box>
          )
        })}
      </Flex>
      <Flex mt={12} sx={{ width: '100%', justifyContent: 'end' }}>
        <Flex sx={{ gap: 24 }}>
          <Button
            variant="ghost"
            type="button"
            onClick={enableReset ? onReset : undefined}
            disabled={!enableReset}
            sx={{ p: 0, fontWeight: 'normal' }}
          >
            Reset
          </Button>
          <Button
            variant="ghostPrimary"
            color="inherit"
            type="submit"
            sx={{ p: 0, fontWeight: 'normal' }}
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
