import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components/macro'

import { Box, Flex, Type } from 'theme/base'

const InputContainer = styled(Box)<{ disabled?: boolean; hasError?: boolean }>`
  ${({ theme }) => `
    line-height: 0;
    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 2px;
      background: ${theme.colors.neutral5};
      outline: none;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
    }
    .slider:hover {
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: ${theme.colors.primary1};
      cursor: pointer;
    }
    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: ${theme.colors.primary1};
      cursor: pointer;
    }

    .slider::-moz-range-progress {
      background: ${theme.colors.primary1};
    }

  `}
`

const InputRange = forwardRef(
  (
    {
      disabled,
      hasError = false,
      currentNumber,
      maxRange,
      numberSx,
      wrapperSx,
      ...rest
    }: {
      disabled?: boolean
      hasError?: boolean
      maxRange: number
      currentNumber: number
      numberSx?: any
      wrapperSx?: any
    } & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <Flex sx={{ alignItems: 'center', gap: 10, ...wrapperSx }}>
        <InputContainer alignItems="center" disabled={disabled} hasError={hasError}>
          <input
            type="range"
            min="1"
            max={maxRange}
            value={currentNumber}
            className="slider"
            id="myRange"
            ref={ref}
            {...rest}
          ></input>
        </InputContainer>
        {maxRange && <Type.BodyBold sx={numberSx}>{maxRange}</Type.BodyBold>}
      </Flex>
    )
  }
)

InputRange.displayName = 'InputRange'

export default InputRange
