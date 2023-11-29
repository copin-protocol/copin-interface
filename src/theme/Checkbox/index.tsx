import { SystemStyleObject } from '@styled-system/css'
import { ForwardedRef, InputHTMLAttributes, ReactElement, ReactNode, cloneElement, forwardRef, useMemo } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import CheckIcon from 'theme/Icons/CheckIcon'
import { Box } from 'theme/base'

export interface CheckboxProps {
  disabled?: boolean
  children?: ReactElement | ReactElement[] | string
  wrapperSx?: GridProps & SystemStyleObject
  label?: ReactNode
  labelSx?: any
  hasError?: boolean
  size?: number
  layout?: 'square' | 'circle'
}

export const CheckboxWrapper = styled(Box)<{ disabled?: boolean; hasError: boolean; size: number }>`
  ${({ theme, hasError, size }) => `
    flex-shrink: 0;
    display: flex;
    width: fit-content;
    position: relative;
    color: ${theme.colors.neutral1};
    input {
      flex-shrink: 0;
      position: absolute;
      top: calc(50% - ${size / 2}px);
      left: 0;
      width: ${size}px;
      height: ${size}px;
      margin: 0;
      opacity: 0.0001;
      z-index: 2;
      cursor: pointer;
      &:checked + .checkbox {
        background: ${theme.colors.primary1};
        border-color: ${theme.colors.primary1};
        color: ${theme.colors.neutral8};
      }
    }
    .checkbox {
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: ${theme.colors.neutral8};
      color: transparent;
      border: 1px solid ${hasError ? theme.colors.red1 : theme.colors.neutral3};
      border-radius: 4px;
      margin-right: 8px;
    }
    &:hover .checkbox {
      border: 1px solid ${hasError ? theme.colors.red1 : theme.colors.neutral2};
    }

    &[disabled] {
      cursor: not-allowed;
      .checkbox {
        background: ${theme.colors.neutral5};
        color: ${theme.colors.neutral5};
        border: 1px solid ${theme.colors.neutral5};
      }
      input {
        cursor: not-allowed;
        &:checked + .checkbox {
          background: ${theme.colors.primary2};
          border-color: ${theme.colors.primary2};
          color: ${theme.colors.neutral8};
        }
      }
    }
  `}
`
export const CheckboxCircleWrapper = styled(Box)<{ disabled?: boolean; hasError: boolean; size: number }>`
  ${({ theme, hasError, size }) => `
    flex-shrink: 0;
    display: flex;
    width: fit-content;
    position: relative;
    color: ${theme.colors.neutral1};
    input {
      flex-shrink: 0;
      position: absolute;
      top: calc(50% - ${size / 2}px);
      left: 0;
      width: ${size}px;
      height: ${size}px;
      margin: 0;
      opacity: 0.0001;
      z-index: 2;
      cursor: pointer;
      &:checked + .checkbox {
        border-color: ${theme.colors.primary1};
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: calc(50% - ${(size - 6) / 2}px);
          left: 3px;
          width: ${size - 6}px;
          height: ${size - 6}px;
          background-color: ${theme.colors.primary1};
          border-radius: 50%;
        }
      }
    }
    .checkbox {
      width: ${size}px;
      height: ${size}px;
      border: 1px solid;
      border-color: ${theme.colors.neutral2};
      border-radius: 50%;
      color: transparent;
    }
    &:hover .checkbox {
      border: 1px solid ${hasError ? theme.colors.red1 : theme.colors.neutral2};
    }

    &[disabled] {
      cursor: not-allowed;
      .checkbox {
        border-color: ${theme.colors.neutral3} !important;
        &:before {
          background-color: ${theme.colors.neutral3} !important;
        }
      }
      input {
        cursor: not-allowed;
      }
    }
  `}
`

// eslint-disable-next-line react/display-name
const Checkbox = forwardRef(
  (
    {
      defaultChecked = false,
      disabled,
      children,
      hasError = false,
      wrapperSx,
      size = 16,
      ...rest
    }: CheckboxProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const id = useMemo(() => uuid(), [])
    const onClickTitle = () => {
      const input = document.getElementById(id)
      input?.click()
    }
    return (
      <CheckboxWrapper alignItems="center" disabled={disabled} hasError={hasError} sx={wrapperSx} size={size}>
        <input id={id} disabled={disabled} type="checkbox" {...rest} defaultChecked={defaultChecked} ref={ref} />
        <div className="checkbox">
          <CheckIcon size={size} />
        </div>
        {children
          ? cloneElement(
              <Box as="span" sx={{ cursor: 'pointer' }}>
                {children}
              </Box>,
              { onClick: onClickTitle }
            )
          : null}
      </CheckboxWrapper>
    )
  }
)

interface Option {
  label: string
  value: string | number
}

interface CheckboxGroupProps {
  options?: Option[]
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  disabled?: boolean
  onChange?: (value?: (string | number)[]) => void
}

const StyledCheckboxGroup = styled.div`
  & > div {
    &:not(:first-child) {
      margin-top: 12px;
    }
  }
`

export const CheckboxGroup = ({ options = [], value, defaultValue = [], disabled, onChange }: CheckboxGroupProps) => {
  const changeValue = (option: Option, newValue: boolean) => {
    if (!value) value = [...defaultValue]
    if (newValue) {
      if (!value.includes(option.value)) {
        value = [...value, option.value]
        onChange && onChange(value)
      }
    } else {
      value = value.filter((e) => e !== option.value)
      onChange && onChange(value)
    }
  }

  return (
    <StyledCheckboxGroup>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          disabled={disabled}
          defaultChecked={defaultValue?.includes(option.value)}
          onChange={({ target: { checked } }: { target: { checked: boolean } }) => changeValue(option, !!checked)}
        >
          {option.label}
        </Checkbox>
      ))}
    </StyledCheckboxGroup>
  )
}

export default Checkbox
