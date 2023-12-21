import { ForwardedRef, InputHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import Label from 'theme/InputField/Label'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { Colors } from 'theme/types'

interface StyledSwitchProps {
  active?: boolean
  disabled?: boolean
}

const WIDTH = 28
const HEIGHT = 16
const GAP = 2
const LOADING_SIZE = HEIGHT - GAP

const SwitchWrapper = styled.div<StyledSwitchProps>`
  line-height: 0;
  .switch {
    position: relative;
    display: inline-block;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.theme.colors.neutral3};
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .slider:before {
    position: absolute;
    content: '';
    top: ${GAP}px;
    width: ${HEIGHT - 2 * GAP}px;
    height: ${HEIGHT - 2 * GAP}px;
    left: 2px;
    background: ${(props) => props.theme.colors.neutral1};
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  input:checked + .slider {
    background: ${(props) => props.theme.colors.primary1};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(${WIDTH - HEIGHT}px);
    -ms-transform: translateX(${WIDTH - HEIGHT}px);
    transform: translateX(${WIDTH - HEIGHT}px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: ${HEIGHT / 2}px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`
export const SwitchInput = forwardRef(function SwitchInput(
  props: InputHTMLAttributes<HTMLInputElement> & { isLoading?: boolean },
  ref?: ForwardedRef<HTMLInputElement>
) {
  return (
    <SwitchWrapper>
      <label className="switch">
        <input ref={ref} type="checkbox" {...props} />
        <span className="slider round"></span>
        {props.isLoading && (
          <Box
            sx={{
              width: LOADING_SIZE,
              height: LOADING_SIZE,
              position: 'absolute',
              top: `-${LOADING_SIZE / 2 + GAP}px`,
              ...(props.checked ? { right: `-${GAP}px` } : { left: `${GAP}px` }),
            }}
          >
            <Loading size={14} />
          </Box>
        )}
      </label>
    </SwitchWrapper>
  )
})
const SwitchInputField = forwardRef(function SwitchInputField(
  {
    wrapperSx,
    required,
    switchLabel,
    error,
    labelColor = 'neutral2',
    tooltipContent,
    ...props
  }: {
    wrapperSx?: any
    required?: boolean
    switchLabel: ReactNode
    error?: string
    labelColor?: keyof Colors
    tooltipContent?: ReactNode
  } & InputHTMLAttributes<HTMLInputElement>,
  ref?: ForwardedRef<HTMLInputElement>
) {
  const id = useMemo(() => uuid(), [])
  return (
    <>
      <Flex sx={{ alignItems: 'center', gap: 2, ...wrapperSx }}>
        <Label
          label={switchLabel}
          error={error}
          required={required}
          columnGap={0}
          labelColor={labelColor}
          wrapperProps={
            tooltipContent
              ? {
                  ['data-tooltip-id']: id,
                  ['data-tooltip-offset']: 0,
                  sx: { borderBottom: '1px dashed', mb: '-1px', borderBottomColor: labelColor },
                }
              : {}
          }
        />
        {tooltipContent && <Tooltip id={id}>{tooltipContent}</Tooltip>}
        <SwitchInput ref={ref} {...props} />
      </Flex>
      {!!error && (
        <Type.Caption color="red1" display="block">
          {error}
        </Type.Caption>
      )}
    </>
  )
})

export default SwitchInputField
