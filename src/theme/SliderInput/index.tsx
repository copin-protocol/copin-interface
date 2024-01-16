import RcSlider from 'rc-slider'
import createSliderWithTooltip from 'rc-slider/lib/createSliderWithTooltip'
import { Controller } from 'react-hook-form'
import styled from 'styled-components/macro'

import { Box } from 'theme/base'

const Slider = createSliderWithTooltip(RcSlider)

export default function SliderInput({
  name,
  control,
  error,
  minValue,
  maxValue,
  stepValue,
  marksStep,
  marksUnit,
  disabled,
}: {
  name: string
  control: any
  error: any
  minValue: number
  maxValue: number
  stepValue: number
  marksStep: number
  marksUnit: string
  disabled?: boolean
}) {
  return (
    <Controller
      name={name || ''}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => {
        return (
          <SliderWrapper>
            <Slider
              value={value}
              onChange={onChange}
              min={minValue}
              max={maxValue}
              step={stepValue}
              marks={createMarks({ maxValue, marksStep, marksUnit })}
              tipFormatter={(v) => `${v}${marksUnit}`}
              disabled={disabled}
              draggableTrack={false}
            />
          </SliderWrapper>
        )
      }}
    />
  )
}

const SliderWrapper = styled(Box)`
  ${({ theme }) => `
    .rc-slider {
      height: 12px;
    }
    .rc-slider-rail {
      background-color: ${theme.colors.neutral4};
      height: 2px;
    }
    .rc-slider-track {
      background-color: ${theme.colors.primary1};
      height: 2px;
    }
    .rc-slider-dot {
      background-color: ${theme.colors.neutral4};
      border: none;
      top: -1px;
      border-radius: 0;
      width: 2px;
      height: 4px;
      margin-left: -1px;
    }
    .rc-slider-handle {
      width: 16px;
      height: 16px;
      margin-top: -7px;
      border: none;
      background-color: ${theme.colors.primary1};
      &:active, &:hover {
        border: none;
        box-shadow: none;
      }
    }
    .rc-slider-dot-active {
      background-color: ${theme.colors.primary1}
    }
    .rc-slider-disabled {
      background-color: transparent;
    }
  `}
`

const createMarks = ({ maxValue, marksStep, marksUnit }: { maxValue: number; marksStep: number; marksUnit: string }) =>
  Array.from({ length: maxValue }, (_, v) => v + 1).reduce<Record<number, string>>(
    (result, curr) => {
      if (curr % marksStep !== 0) return result
      return { ...result, [curr]: `${curr}${marksUnit}` }
    },
    {
      // 1: `1${marksUnit}`
    }
  )
