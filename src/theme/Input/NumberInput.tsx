import React, { useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { InputWrapper, StyledInput, StyledPrefix, StyledSuffix } from 'theme/Input'
import { SxProps } from 'theme/types'

import { InputProps, NumberInputProps } from './types'

const NumberInput = ({
  affix,
  suffix,
  block,
  sx,
  variant,
  error,
  control,
  isAllowed,
  isInteger,
  rules,
  onInputChange,
  inputHidden = false,
  ...props
}: NumberInputProps & InputProps & SxProps) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (props.maxLength) ref.current.maxLength = props.maxLength
  }, [props.maxLength])
  return (
    <InputWrapper
      disabled={props.disabled}
      variant={error ? 'error' : variant}
      block={block}
      sx={{ ...sx, ...(inputHidden ? { '& input': { opacity: 0 } } : {}) }}
    >
      {!!affix && <StyledPrefix>{affix}</StyledPrefix>}
      <Controller
        name={props.name || ''}
        control={control}
        rules={rules}
        defaultValue={props.defaultValue as string | number | undefined}
        render={({ field: { onChange, value, onBlur } }) => {
          return (
            <NumericFormat
              getInputRef={ref}
              disabled={props.disabled}
              value={value}
              thousandSeparator
              decimalScale={isInteger ? 0 : undefined}
              isNumericString
              isAllowed={isAllowed}
              placeholder={props.placeholder}
              customInput={StyledInput}
              onBlur={onBlur}
              onValueChange={(v: any) => {
                onChange(v.floatValue)
                onInputChange && onInputChange(value)
              }}
            />
          )
        }}
      />

      {!!suffix && <StyledSuffix>{suffix}</StyledSuffix>}
    </InputWrapper>
  )
}

export default NumberInput
