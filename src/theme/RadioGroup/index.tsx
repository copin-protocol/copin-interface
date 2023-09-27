import { SystemStyleObject } from '@styled-system/css'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import { Box, Flex } from 'theme/base'
import { BoxProps } from 'theme/types'

type RadioProps = {
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (e: any) => void
  children?: ReactElement | ReactElement[] | string
  block?: boolean
} & BoxProps

type RadioWrapperProps = {
  value?: string
  active?: boolean
  disabled?: boolean
  block?: boolean
}

type Option = {
  label: ReactElement | ReactElement[] | string
  value: string | number
}

type RadioGroupProps = {
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
  cursor: pointer;
  transition: border-color 240ms ease-in;
  &:not(:first-child) {
    margin-top: 12px;
  }
  .radio {
    position: relative;
    display: inline-block;
    margin-right: 8px;
    min-width: 24px;
    height: 24px;
    padding: 0;
    background: ${({ theme }) => theme.colors.neutral8};
    line-height: 24px;
    text-align: center;
    border: 2px solid ${({ theme }) => theme.colors.neutral6};
    border-radius: 50%;
  }

  .radio:after {
    content: '';
    position: absolute;
    top: calc(50% - 8px);
    left: calc(50% - 8px);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    /* width: 13px;
    height: 13px; */
    transition: background 240ms ease-in;
    background: ${(props) => (props.active ? props.theme.colors.primary1 : 'transparent')};
  }
  &[disabled] {
    .radio {
      cursor: not-allowed;
      background: ${({ theme }) => theme.colors.neutral6};
      border: 2px solid ${({ theme }) => theme.colors.neutral5};
    }
    .radio:after {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      border-radius: 12px;
      width: 12px;
      height: 12px;
      transition: background 240ms ease-in;
      background: ${(props) => (props.active ? props.theme.colors.neutral5 : 'transparent')};
    }
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
    <Flex flexDirection="column" sx={sx}>
      {options.map((option: Option) => (
        <Radio
          key={option.value}
          checked={currentValue === option.value}
          onChange={() => changeValue(option)}
          disabled={disabled}
          block={block}
          sx={sxChildren}
        >
          {option.label}
        </Radio>
      ))}
    </Flex>
  )
}

export default RadioGroup
