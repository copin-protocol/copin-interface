import { ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DATE_FORMAT, DAYJS_FULL_DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { formatLocalDate, formatLocalRelativeDate, formatLocalRelativeShortDate } from 'utils/helpers/format'

export const RelativeTimeText = ({
  date,
  tooltipLabel = '',
  hasTooltip = true,
  textStyle,
}: {
  date: string | undefined | number
  tooltipLabel?: ReactNode
  hasTooltip?: boolean
  textStyle?: React.CSSProperties
}) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      <span style={textStyle}>{`${formatLocalRelativeDate(date ?? '')}`}</span>
      {hasTooltip && (
        <Tooltip id={tooltipId} clickable={false}>
          <Type.Caption sx={{ maxWidth: [300, 400] }}>
            {tooltipLabel}
            {formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}
          </Type.Caption>
        </Tooltip>
      )}
    </Box>
  )
}

export const LocalTimeText = ({
  date,
  format,
  hasTooltip = true,
}: {
  date: string | number | undefined
  format?: string
  hasTooltip?: boolean
}) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  if (date == null) return <>--</>
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      {format === DAYJS_FULL_DATE_FORMAT ? (
        <span>
          <span style={{ display: 'inline-block', marginRight: '4px' }}>{`${formatLocalDate(
            date ?? '',
            DATE_FORMAT
          )}`}</span>
          <span style={{ color: themeColors.neutral3 }}>{`${formatLocalDate(date ?? '', TIME_FORMAT)}`}</span>
        </span>
      ) : (
        <span>{`${formatLocalDate(date ?? '', format)}`}</span>
      )}
      {hasTooltip && (
        <Tooltip id={tooltipId} clickable={false}>
          <Type.Caption display="block" mb={1} sx={{ maxWidth: [300, 400] }}>
            {formatLocalRelativeDate(date ?? '')}
          </Type.Caption>
          <Type.Caption sx={{ maxWidth: [300, 400] }}>
            {formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}
          </Type.Caption>
        </Tooltip>
      )}
    </Box>
  )
}

export const RelativeShortTimeText = ({ date, suffix }: { date: string | number | undefined; suffix?: ReactNode }) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      <span>
        {`${formatLocalRelativeShortDate(date ?? '')}`}
        {suffix ? ` ${suffix}` : ''}
      </span>
      <Tooltip id={tooltipId} clickable={false}>
        <Type.Caption sx={{ maxWidth: [300, 400] }}>{formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
      </Tooltip>
    </Box>
  )
}

export const DualTimeText = ({ date, ...props }: { date: string | undefined } & TextProps) => {
  return (
    <Flex flexDirection="column">
      <Type.Caption {...props}>{`${formatLocalDate(date ?? '', DATE_FORMAT)}`}</Type.Caption>
      <Type.Caption color="neutral3">{`${formatLocalDate(date ?? '', TIME_FORMAT)}`}</Type.Caption>
    </Flex>
  )
}
