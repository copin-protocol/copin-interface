import { ReactNode } from 'react'

import DatePicker, { DatePickerProps } from 'theme/DatePicker'
import Label from 'theme/InputField/Label'
import { Box, Type } from 'theme/base'

export default function DateInputField({
  label,
  required,
  error,
  block = true,
  ...props
}: {
  label: ReactNode
  required?: boolean
  error?: string
  block?: boolean
} & DatePickerProps) {
  return (
    <Box sx={{ width: block ? '100%' : 'fit-content' }}>
      <Label label={label} required={required} error={error} />
      <DatePicker block={block} {...props} />
      {!!error && (
        <Type.Caption color="red1" mt={1} display="block">
          {error}
        </Type.Caption>
      )}
    </Box>
  )
}
