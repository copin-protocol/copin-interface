import { Calendar } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode } from 'react'
import ReactDatePicker, { CalendarContainer, ReactDatePickerProps } from 'react-datepicker'
import { Controller } from 'react-hook-form'

import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex } from 'theme/base'

import DatePickerWrapper from './styled'

export type DatePickerProps = {
  isUTC?: boolean
  name: string
  control: any
  block?: boolean
  rules?: any
  shouldUnregister?: boolean
  error?: any
  wrapperSx?: any
  iconOnly?: boolean
  onClickClear?: () => void
  onClickApply?: () => void
} & Partial<Omit<ReactDatePickerProps, 'onChange'>>

export const DateRangePicker = ({
  isUTC = false,
  control,
  name,
  rules,
  block,
  error,
  showTimeSelect = false,
  shouldUnregister = false,
  onClickApply,
  onClickClear,
  dateFormat = 'MMMM d, yyyy h:mm',
  // if isUTC => select date is local time, return value is local time
  //      => need convert to utc
  // if !isUTC => select date is local time, return value is local time
  iconOnly = false,
  wrapperSx,
  ...props
}: DatePickerProps) => {
  const Container = ({ children, className }: { className: any; children: ReactNode }) => {
    return (
      <Box
        sx={{
          bg: 'neutral1',
          borderRadius: '4px',
          overflow: 'hidden',
          border: 'small',
          borderColor: 'neutral3',
          boxShadow: '0px 5.30739px 5.30739px rgba(0, 0, 0, 0.25)',
        }}
      >
        <CalendarContainer className={className}>
          <Box sx={{ position: 'relative' }}>{children}</Box>
        </CalendarContainer>
        <Flex sx={{ justifyContent: 'end', bg: 'neutral2' }}>
          <Button variant="ghost" onClick={onClickClear}>
            Clear
          </Button>
          <Button variant="ghostPrimary" onClick={onClickApply}>
            Apply
          </Button>
        </Flex>
      </Box>
    )
  }
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, onBlur, value } }) => (
        <DatePickerWrapper
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
            calendarContainer={Container}
            shouldCloseOnSelect={false}
            onBlur={onBlur}
            onChange={(values) => {
              if (isUTC) {
                return onChange({
                  from: values?.[1] ? values?.[0] : values?.[0] ? toDateOffset(values[0]) : null,
                  to: values[1] ? toDateOffset(values[1]) : null,
                })
              }
              return onChange({ from: values[0], to: values[1] })
            }}
            selected={value?.from ? value.from : null}
            startDate={value?.from ? value.from : null}
            endDate={value?.to ? value.to : null}
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            placeholderText={dateFormat as string}
            selectsRange
            monthsShown={2}
            {...props}
            customInput={
              iconOnly ? (
                <Calendar role="button" size={24} />
              ) : (
                <Input
                  error={error}
                  block={block}
                  suffix={
                    <Box verticalAlign="middle" lineHeight="16px" color={props.disabled ? 'neutral5' : 'primary1'}>
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

export default DateRangePicker

function toDateOffset(time: Date) {
  const offset = dayjs().utcOffset()
  const result = dayjs(time)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .add(offset, 'minute')
  return result.toDate()
}
