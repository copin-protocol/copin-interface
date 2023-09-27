import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import CheckIcon from 'theme/Icons/CheckIcon'
import { Flex, Type } from 'theme/base'

import { CheckboxProps, CheckboxWrapper } from '.'

// eslint-disable-next-line react/display-name
export const ControlledCheckbox = forwardRef(
  (
    {
      disabled,
      children,
      hasError = false,
      label,
      labelSx,
      wrapperSx,
      size = 16,
      ...rest
    }: CheckboxProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const uuid = uuidv4()
    return (
      <Flex sx={wrapperSx} alignItems="center" justifyContent="start">
        <CheckboxWrapper disabled={disabled} hasError={hasError} size={size}>
          <input disabled={disabled} type="checkbox" {...rest} ref={ref} id={`checkbox_${uuid}`} />
          <div className="checkbox">
            <CheckIcon size={size} />
          </div>
          {children}
        </CheckboxWrapper>
        {label && (
          <Type.Caption sx={{ cursor: disabled ? 'not-allowed' : 'pointer', ...labelSx }}>
            <label style={{ cursor: 'inherit' }} htmlFor={`checkbox_${uuid}`}>
              {label}
            </label>
          </Type.Caption>
        )}
      </Flex>
    )
  }
)
