import { ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { formatLocalDate, formatLocalRelativeDate, formatLocalRelativeShortDate } from 'utils/helpers/format'

export const RelativeTimeText = ({ date }: { date: string | undefined }) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      <span>{`${formatLocalRelativeDate(date ?? '')}`}</span>
      <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
        <Type.Caption sx={{ maxWidth: [300, 400] }}>{formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
      </Tooltip>
    </Box>
  )
}

export const LocalTimeText = ({ date }: { date: string | undefined }) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      <span>{`${formatLocalDate(date ?? '')}`}</span>
      <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
        <Type.Caption display="block" mb={1} sx={{ maxWidth: [300, 400] }}>
          {formatLocalRelativeDate(date ?? '')}
        </Type.Caption>
        <Type.Caption sx={{ maxWidth: [300, 400] }}>{formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
      </Tooltip>
    </Box>
  )
}

export const RelativeShortTimeText = ({ date, suffix }: { date: string | undefined; suffix?: ReactNode }) => {
  const uuid = uuidv4()
  const tooltipId = `tt_${uuid}`
  return (
    <Box as="span" sx={{ display: 'block' }} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
      <span>
        {`${formatLocalRelativeShortDate(date ?? '')}`}
        {suffix ? ` ${suffix}` : ''}
      </span>
      <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
        <Type.Caption sx={{ maxWidth: [300, 400] }}>{formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
      </Tooltip>
    </Box>
  )
}

export const DualTimeText = ({ date, ...props }: { date: string | undefined } & TextProps) => {
  return (
    <Flex flexDirection="column">
      <Type.Caption {...props}>{`${formatLocalRelativeDate(date ?? '')}`}</Type.Caption>
      <Type.Caption {...props}>{`${formatLocalDate(date ?? '', DAYJS_FULL_DATE_FORMAT)}`}</Type.Caption>
    </Flex>
  )
}
