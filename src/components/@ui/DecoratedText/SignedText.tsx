import { Box, TextProps, Type } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'

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
  isCompactNumber = false,
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
  isCompactNumber?: boolean
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
  const formatedValue =
    typeof value !== 'number'
      ? '--'
      : isCompactNumber
      ? compactNumber(Math.abs(value), maxDigit)
      : formatNumber(Math.abs(value), maxDigit, minDigit)
  return (
    <>
      {fontInherit ? (
        <Box as="span" color={color} {...sx}>
          {value && value < 0 ? '-' : ''}
          {!!value && prefix}
          {formatedValue}
          {!!value && suffix}
        </Box>
      ) : (
        <Type.Caption color={color} {...sx}>
          {value && value < 0 ? '-' : ''}
          {!!value && prefix}
          {formatedValue}
          {!!value && suffix}
        </Type.Caption>
      )}
    </>
  )
}
