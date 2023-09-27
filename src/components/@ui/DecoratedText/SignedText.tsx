import { Box, TextProps, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export function SignedText({
  value,
  maxDigit = 3,
  minDigit,
  sx,
  neg = false,
  pos = false,
  suffix = '',
  prefix = '',
  fontInherit = false,
}: {
  value: number | undefined
  maxDigit?: number
  minDigit?: number
  sx?: TextProps
  neg?: boolean
  pos?: boolean
  suffix?: string
  prefix?: string
  fontInherit?: boolean
}) {
  let color = 'inherit'
  if (!!value) {
    if (!neg && !pos) {
      color = value > 0 ? 'green1' : value < 0 ? 'red2' : 'inherit'
    } else if (neg) {
      color = value < 0 ? 'red2' : 'inherit'
    } else if (pos) {
      color = value > 0 ? 'green1' : 'inherit'
    }
  }
  return (
    <>
      {fontInherit ? (
        <Box as="span" {...sx} color={color}>
          {value && value < 0 ? '-' : ''}
          {!!value && prefix}
          {!!value ? formatNumber(Math.abs(value), maxDigit, minDigit) : '--'}
          {!!value && suffix}
        </Box>
      ) : (
        <Type.Caption color={color} {...sx}>
          {value && value < 0 ? '-' : ''}
          {!!value && prefix}
          {!!value ? formatNumber(Math.abs(value), maxDigit, minDigit) : '--'}
          {!!value && suffix}
        </Type.Caption>
      )}
    </>
  )
}
