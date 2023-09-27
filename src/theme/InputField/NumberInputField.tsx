import React, { ReactNode } from 'react'

import NumberInput from 'theme/Input/NumberInput'
import { InputProps, NumberInputProps } from 'theme/Input/types'
import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'

import Label from './Label'

const NumberInputField = ({
  label,
  annotation,
  error,
  required,
  block,
  sx,
  ...props
}: {
  label?: ReactNode
  annotation?: ReactNode
} & NumberInputProps &
  SxProps &
  InputProps) => {
  return (
    <Flex flexDirection="column" width={block ? '100%' : 'fit-content'} sx={sx}>
      {label && <Label label={label} annotation={annotation} error={error} required={required} />}
      <NumberInput {...props} block={block} />
      {!!error && (
        <Type.Caption color="red1" mt={1} display="block">
          {error}
        </Type.Caption>
      )}
    </Flex>
  )
}

export default NumberInputField
