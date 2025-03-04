/* eslint-disable react/display-name */
import { SystemStyleObject } from '@styled-system/css'
import { ForwardedRef, ReactNode, forwardRef, useState } from 'react'
import { GridProps } from 'styled-system'

import Input, { InputPassword, Textarea } from 'theme/Input'
import { InputProps, TextareaProps } from 'theme/Input/types'
import { Flex, Type } from 'theme/base'
import { BoxProps, SxProps } from 'theme/types'

import Label from './Label'

const useCountText = () => {
  const [count, setCount] = useState(0)
  const handleCountText = (e: { target: { value: string | any[] } }, onChange?: (e: any) => void) => {
    setCount(e.target.value?.length)
    if (onChange) onChange(e)
  }
  return { count, handleCountText }
}

const InputField = forwardRef(
  (
    {
      label,
      annotation = false,
      maxLength,
      error,
      required,
      block,
      sx,
      inputSx,
      onChange,
      warning,
      ...props
    }: {
      label?: ReactNode
      annotation?: boolean | ReactNode
      warning?: ReactNode
      inputSx?: SystemStyleObject & GridProps
    } & SxProps &
      BoxProps &
      InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { count, handleCountText } = useCountText()
    return (
      <Flex flexDirection="column" width={block ? '100%' : 'fit-content'} sx={sx}>
        {label && (
          <Label
            label={label}
            annotation={annotation === true && maxLength ? `${count}/${maxLength}` : annotation}
            error={!!error && !warning}
            required={required}
          />
        )}
        <Input
          {...props}
          maxLength={maxLength}
          sx={inputSx}
          block={block}
          ref={ref}
          variant={!!error && !warning ? 'error' : ''}
          onChange={annotation === true && maxLength ? (e) => handleCountText(e, onChange) : onChange}
        />
        {!!warning ? (
          <Type.Caption color="orange1" mt={1} display="block">
            {warning}
          </Type.Caption>
        ) : !!error ? (
          <Type.Caption color="red1" mt={1} display="block">
            {error}
          </Type.Caption>
        ) : null}
      </Flex>
    )
  }
)

export const InputPasswordField = forwardRef(
  (
    {
      label,
      annotation,
      error,
      required,
      block,
      sx,
      ...props
    }: { label?: ReactNode; annotation?: ReactNode } & SxProps & InputProps & { allowShowPassword?: boolean },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <Flex flexDirection="column" width={block ? '100%' : 'fit-content'} sx={sx}>
      {label ? <Label label={label} annotation={annotation} error={error} required={required} /> : null}
      <InputPassword {...props} block={block} ref={ref} variant={error ? 'error' : ''} />
      {!!error && (
        <Type.Caption color="red1" mt={1} display="block">
          {error}
        </Type.Caption>
      )}
    </Flex>
  )
)

export const TextareaField = forwardRef(
  (
    {
      label,
      annotation = false,
      bold = false,
      maxLength,
      error,
      required,
      block,
      sx,
      onChange,
      ...props
    }: { label: ReactNode; annotation?: boolean | ReactNode; bold?: boolean } & SxProps & TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const { count, handleCountText } = useCountText()
    return (
      <Flex flexDirection="column" width={block ? '100%' : 'fit-content'} sx={sx}>
        <Label
          bold={bold}
          label={label}
          annotation={annotation === true && maxLength ? `${count}/${maxLength}` : annotation}
          error={error}
          required={required}
        />
        <Textarea
          {...props}
          maxLength={maxLength}
          block={block}
          ref={ref}
          variant={error ? 'error' : ''}
          onChange={annotation === true && maxLength ? (e) => handleCountText(e, onChange) : onChange}
        />
        {!!error && (
          <Type.Caption color="red1" mt={1} display="block">
            {error}
          </Type.Caption>
        )}
      </Flex>
    )
  }
)

export default InputField
