import { SystemStyleObject } from '@styled-system/css'
import { ForwardedRef, InputHTMLAttributes, ReactNode, forwardRef, useRef } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import { Box } from 'theme/base'

export interface RatioProps {
  disabled?: boolean
  wrapperSx?: GridProps & SystemStyleObject
  label?: ReactNode
  labelSx?: any
  size?: number
}

export const Radio = forwardRef(
  (
    { disabled, label, labelSx, wrapperSx, size = 20, ...rest }: RatioProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const id = useRef(uuid())
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ...(wrapperSx || {}) }}>
        <Wrapper disabled={disabled} size={size} htmlFor={`checkbox_${id.current}`}>
          <input disabled={disabled} type="radio" {...rest} ref={ref} id={`checkbox_${id.current}`} />
          <div className="checkmark" />
        </Wrapper>
        {label && (
          <Box
            as="label"
            sx={{ cursor: disabled ? 'not-allowed' : 'pointer', ...labelSx }}
            htmlFor={`checkbox_${id.current}`}
          >
            {label}
          </Box>
        )}
      </Box>
    )
  }
)

Radio.displayName = 'Radio'
export default Radio

const Wrapper = styled.label<{ disabled?: boolean; size: number }>`
  ${({ theme, size }) => `
    /* The container */
    display: block;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    /* Hide the browser's default radio button */
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    /* Create a custom radio button */
    .checkmark {
      position: relative;
      height: ${size}px;
      width: ${size}px;
      border: 0.5px solid ${theme.colors.neutral2};
      border-radius: 50%;
    }

    /* On mouse-over, add a grey background color */
    &:hover .checkmark {
      border: 0.5px solid ${theme.colors.neutral1};
    }

    /* When the radio button is checked, add a blue background */
    input:checked ~ .checkmark {
      border: 1px solid ${theme.colors.primary1};
    }

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    /* Show the indicator (dot/circle) when checked */
    input:checked ~ .checkmark:after {
      display: block;
    }

    /* Style the indicator (dot/circle) */
    .checkmark:after {
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: ${size - 8}px;
      height: ${size - 8}px;
      border-radius: 50%;
      background: ${theme.colors.primary1};
    }
  `}
`
