import { Calendar } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { DateRange, Range, RangeKeyDict } from 'react-date-range'
import OutsideClickHandler from 'react-outside-click-handler'

import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { TimeRange } from 'utils/types'

import DateRangeWrapper from './styled'

const START_DATE = '2022-10-01T00:00:00.000Z'

const RANGE_KEY = 'selection'
const RangeFilter = ({
  isRangeSelection,
  from,
  to,
  changeTimeRange,
  anchor = 'left',
  anchorPos = 0,
  posDefine,
  forceDisplaySelectedDate = false,
  iconColor,
  iconHoverColor,
}: {
  isRangeSelection: boolean
  from: Date | undefined
  to: Date | undefined
  changeTimeRange: (range: TimeRange) => void
  anchor?: 'left' | 'right'
  anchorPos?: number
  posDefine?: any
  forceDisplaySelectedDate?: boolean
  iconColor?: string
  iconHoverColor?: string
}) => {
  const lastRangeRef = useRef<number[]>()
  const [selecting, setSelecting] = useState(false)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [state, setState] = useState<Range>({
    startDate: from ?? today,
    endDate: to ?? today,
    key: RANGE_KEY,
  })
  useEffect(() => {
    if (!lastRangeRef.current) return
    const startDate = from ?? today
    const endDate = to ?? today
    if (startDate.getTime() === lastRangeRef.current[0]) return
    if (endDate.getTime() === lastRangeRef.current[1]) return
    lastRangeRef.current = [startDate.getTime(), endDate.getTime()]
    setState({
      startDate,
      endDate,
      key: RANGE_KEY,
    })
  }, [from, to])
  const hasDisabledApply = (state.endDate?.getTime() ?? 0) - (state.startDate?.getTime() ?? 0) < 24 * 3600 * 1000
  return (
    <OutsideClickHandler onOutsideClick={() => setSelecting(false)}>
      <Box style={{ position: 'relative' }}>
        <ButtonWithIcon
          icon={<Calendar size={20} />}
          variant="ghost"
          onClick={() => setSelecting(true)}
          sx={{
            px: [0, 1, 1, 1],
            color: isRangeSelection ? 'neutral1' : 'neutral3',
            '&:hover:not([disabled])': {
              color: isRangeSelection ? 'neutral2' : 'neutral1',
              '& svg': {
                color: isRangeSelection ? (iconHoverColor ? iconHoverColor : 'neutral2') : 'neutral3',
              },
            },
            '& svg': {
              color: isRangeSelection ? (iconColor ? iconColor : 'neutral1') : 'neutral3',
            },
          }}
        >
          {isRangeSelection && (
            <Type.Caption
              flex="1 1 100%"
              sx={{
                color: 'neutral1',
                '&:hover': {
                  color: 'neutral2',
                },
              }}
              // sx={{ borderBottom: 'small', pb: '2px', borderColor: 'primary1' }}
              display={forceDisplaySelectedDate ? 'block' : ['none', 'block']}
            >
              {dayjs(from).format(DATE_FORMAT)} - {dayjs(to).format(DATE_FORMAT)}
            </Type.Caption>
          )}
        </ButtonWithIcon>
        <Box
          sx={{
            position: 'absolute',
            top: 48,
            [anchor]: anchorPos,
            zIndex: 100,
            bg: 'neutral7',
            pb: 2,
            overflow: 'hidden',
            border: 'small',
            borderColor: 'neutral4',
            borderRadius: 'sm',
            textAlign: 'center',
            ...(posDefine ?? {}),
          }}
          display={selecting ? 'block' : 'none'}
        >
          <DateRangeWrapper>
            <DateRange
              // moveRangeOnFirstSelection
              retainEndDateOnFirstSelection
              dateDisplayFormat="yyyy/MM/dd"
              minDate={new Date(START_DATE)}
              maxDate={new Date()}
              editableDateInputs={true}
              onChange={(item: RangeKeyDict) => {
                const startTime = item[RANGE_KEY].startDate?.getTime()
                const endTime = item[RANGE_KEY].endDate?.getTime()
                // if (startTime === endTime && endTime && state.endDate && endTime < state.endDate.getTime()) {
                //   item[RANGE_KEY].endDate = state.endDate
                // }
                if (startTime && startTime < new Date(START_DATE).getTime()) {
                  item[RANGE_KEY].startDate = new Date(START_DATE)
                }
                if (endTime && endTime > Date.now()) {
                  const now = new Date()
                  now.setUTCHours(0, 0, 0, 0)
                  item[RANGE_KEY].endDate = now
                }
                setState(item[RANGE_KEY])
              }}
              ranges={[state]}
            />
          </DateRangeWrapper>
          <Button
            size="sm"
            variant="outline"
            mt={2}
            ml="auto"
            mr={1}
            onClick={() =>
              setState({
                startDate: from ?? today,
                endDate: to ?? today,
                key: 'selection',
              })
            }
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="primary"
            mt={2}
            mr="auto"
            ml={1}
            disabled={hasDisabledApply}
            onClick={() => {
              changeTimeRange({
                from: state.startDate,
                to: state.endDate,
              })
              setSelecting(false)
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </OutsideClickHandler>
  )
}

export default RangeFilter
