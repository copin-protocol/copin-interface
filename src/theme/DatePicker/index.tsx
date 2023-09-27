import { Calendar } from '@phosphor-icons/react'
import { useRef } from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Controller } from 'react-hook-form'

import Input from 'theme/Input'
import { Box } from 'theme/base'
import { toCurrentOffset, toDateOffset } from 'utils/helpers/transform'

import DatePickerWrapper from './styled'

export type DatePickerProps = {
  name: string
  control: any
  block?: boolean
  rules?: any
  shouldUnregister?: boolean
  error?: any
  isUTC?: boolean
  wrapperSx?: any
  iconOnly?: boolean
} & Partial<ReactDatePickerProps>

export const DatePicker = ({
  control,
  name,
  rules,
  block,
  error,
  showTimeSelect = true,
  shouldUnregister = false,
  dateFormat = 'MMMM d, yyyy h:mm',
  // if isUTC => select date is local time, return value is local time
  //      => need convert to utc
  // if !isUTC => select date is local time, return value is local time
  isUTC = false,
  iconOnly = false,
  wrapperSx,
  ...props
}: DatePickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleClickCalendar = () => {
    if (!containerRef.current) return
    const inputs = containerRef.current.getElementsByTagName('input')
    const input = inputs?.[0]
    if (!input) return
    input.focus()
  }
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, onBlur, value } }) => (
        <DatePickerWrapper
          ref={containerRef}
          sx={{
            '& .react-datepicker__aria-live': {
              position: 'absolute',
              clipPath: 'circle(0)',
              border: 0,
              height: ' 1px',
              margin: '-1px',
              overflow: 'hidden',
              padding: 0,
              width: ' 1px',
              whiteSpace: 'nowrap',
            },
            ...(iconOnly
              ? {
                  width: 'max-content',
                  lineHeight: 0,
                  '&.react-datepicker__input-container': {
                    lineHeight: 0,
                  },
                  '& .react-datepicker__time-container': {
                    lineHeight: '1.5em',
                  },
                  '& .react-datepicker__current-month': {
                    lineHeight: '1.5em',
                  },
                }
              : {}),
            ...wrapperSx,
          }}
        >
          <ReactDatePicker
            onBlur={onBlur}
            onChange={(value: Date) => {
              if (!isUTC || !value) {
                return onChange(value)
              }
              return onChange(toDateOffset(value))
            }}
            // selected={value ? toCurrentOffset(value) : null}
            selected={value ? (isUTC ? toCurrentOffset(value) : value) : null}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            placeholderText={dateFormat as string}
            {...props}
            customInput={
              iconOnly ? (
                <Calendar role="button" size={24} />
              ) : (
                <Input
                  error={error}
                  block={block}
                  suffix={
                    <Box
                      verticalAlign="middle"
                      lineHeight="16px"
                      color={props.disabled ? 'neutral5' : 'primary1'}
                      onClick={handleClickCalendar}
                    >
                      <Calendar size={24} />
                    </Box>
                  }
                />
              )
            }
          />
        </DatePickerWrapper>
      )}
    />
  )
}
export default DatePicker
