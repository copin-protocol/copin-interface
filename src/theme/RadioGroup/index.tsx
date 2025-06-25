import { SystemStyleObject } from '@styled-system/css'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import { Box, Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'

type RadioProps = {
  direction?: 'column' | 'row'
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (e: any) => void
  children?: ReactNode | ReactElement | ReactElement[] | string
  block?: boolean
} & BoxProps

type RadioWrapperProps = {
  direction?: 'column' | 'row'
  value?: string
  active?: boolean
  disabled?: boolean
  block?: boolean
}

type Option = {
  label: ReactNode | ReactElement | ReactElement[] | string
  value: string | number
  disabled?: boolean
}

type RadioGroupProps = {
  direction?: 'column' | 'row'
  value?: string | number
  defaultValue?: string | number
  options?: Option[]
  onChange?: (value?: string | number) => void
  disabled?: boolean
  block?: boolean
  sxChildren?: SystemStyleObject & GridProps
} & BoxProps

const RadioWrapper = styled(Box)<RadioWrapperProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${(props) => (props.block ? '100%' : 'fit-content')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: border-color 240ms ease-in;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  &:not(:first-child) {
    margin-top: ${(props) => (props.direction === 'column' ? '12px' : undefined)};
    margin-left: ${(props) => (props.direction === 'row' ? '12px' : undefined)};
  }
  .radio {
    position: relative;
    display: inline-block;
    margin-right: 8px;
    min-width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    line-height: 24px;
    text-align: center;
    border: 1px solid ${(props) => (props.active ? props.theme.colors.primary1 : props.theme.colors.neutral3)};
    border-radius: 50%;
  }
  .radio:hover {
    border: 1px solid ${({ theme, disabled }) => (disabled ? theme.colors.neutral3 : theme.colors.primary1)};
  }
  .radio:after {
    content: '';
    position: absolute;
    top: calc(50% - 4px);
    left: calc(50% - 4px);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: background 240ms ease-in;
    background: ${(props) => (props.active ? props.theme.colors.primary1 : 'transparent')};
  }
`

const Radio = ({ checked, onChange, disabled, children, block = false, sx }: RadioProps) => {
  return (
    <RadioWrapper
      onClick={(e: any) => {
        if (!!disabled || !onChange) return
        onChange(e)
      }}
      active={checked}
      disabled={disabled}
      block={block}
      className={checked ? 'active' : ''}
      sx={sx}
    >
      <span className="radio"></span>
      {children}
    </RadioWrapper>
  )
}

const RadioGroup = ({
  value,
  defaultValue,
  options = [],
  onChange,
  disabled,
  sx,
  sxChildren,
  block = false,
  direction = 'row',
}: RadioGroupProps) => {
  const [currentValue, setCurrentValue] = useState(defaultValue)
  const changeValue = (option: Option) => {
    setCurrentValue(option.value)
    if (!onChange) return
    onChange(option.value)
  }
  useEffect(() => {
    if (value == null || value === currentValue) return
    setCurrentValue(value)
  }, [value, currentValue, setCurrentValue])

  return (
    <Flex flexDirection={direction} sx={{ gap: 3, ...sx }}>
      {options.map((option: Option) => (
        <Radio
          key={option.value}
          direction={direction}
          checked={currentValue === option.value}
          onChange={() => changeValue(option)}
          disabled={disabled || option.disabled}
          block={block}
          sx={sxChildren}
        >
          <Type.Caption>{option.label}</Type.Caption>
        </Radio>
      ))}
    </Flex>
  )
}

export default RadioGroup
