import { ReactElement } from 'react'

import useTraderBalances from 'hooks/features/useTraderBalances'
import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import formatTokenPrices, { formatNumber } from 'utils/helpers/format'

export const ValueText = ({
  value,
  prefix,
  suffix,
  suffixSx,
  prefixSx,
  sx,
}: {
  value: string | number
  prefix?: string | ReactElement
  suffix?: string | ReactElement
  sx?: any
  suffixSx?: any
  prefixSx?: any
}) => {
  return (
    <Box as="span" sx={sx}>
      {prefix ? (
        <Box as="span" sx={prefixSx}>
          {prefix}
        </Box>
      ) : null}
      {value}
      {suffix ? (
        <Box as="span" sx={{ color: 'neutral3', ...(suffixSx ?? {}) }}>
          {suffix}
        </Box>
      ) : null}
    </Box>
  )
}

export const AmountText = ({
  amount = 0,
  maxDigit,
  minDigit,
  suffix,
  prefix,
  sx,
  suffixSx,
  prefixSx,
}: {
  amount?: number
  maxDigit?: number
  minDigit?: number
  suffix?: string | ReactElement
  prefix?: string | ReactElement
  sx?: any
  suffixSx?: any
  prefixSx?: any
}) => {
  return (
    <ValueText
      value={formatNumber(amount, maxDigit, minDigit)}
      suffix={suffix}
      prefix={prefix}
      sx={sx}
      suffixSx={suffixSx}
      prefixSx={prefixSx}
    />
  )
}

export const PercentText = ({
  percent,
  isInt = false,
  digit,
}: {
  percent: number | undefined
  isInt?: boolean
  digit?: number
}) => <ValueText value={formatNumber(percent, isInt ? 0 : digit, isInt ? 0 : digit)} suffix="%" />

export const BalanceText = ({
  protocol,
  account,
  maxDigit = 2,
  minDigit = 2,
  suffix,
  prefix = '$',
  sx,
  suffixSx,
  prefixSx,
}: {
  protocol: ProtocolEnum
  account?: string
  maxDigit?: number
  minDigit?: number
  suffix?: string | ReactElement
  prefix?: string | ReactElement
  sx?: any
  suffixSx?: any
  prefixSx?: any
}) => {
  const { balance } = useTraderBalances({
    account,
    protocol,
  })
  return balance > 0 ? (
    <ValueText
      value={formatNumber(balance, maxDigit, minDigit)}
      suffix={suffix}
      prefix={prefix}
      sx={sx}
      suffixSx={suffixSx}
      prefixSx={prefixSx}
    />
  ) : (
    <span>--</span>
  )
}

export const PriceTokenText = ({
  value,
  maxDigit = 2,
  minDigit = 2,
  suffix,
  prefix = '',
  sx,
  suffixSx,
  prefixSx,
}: {
  value: number | undefined
  maxDigit?: number
  minDigit?: number
  suffix?: string | ReactElement
  prefix?: string | ReactElement
  sx?: any
  suffixSx?: any
  prefixSx?: any
}) => {
  if (value == null) return '--'
  const { formattedNumber, integerPart, zeroPart, decimalPart } = formatTokenPrices({
    value,
  })
  const tooltipId = `tt_${value}`
  return zeroPart.length > 3 && Number(decimalPart) > 0 ? (
    <>
      <Box as="span" sx={sx} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
        {prefix ? (
          <Box as="span" sx={prefixSx}>
            {prefix}
          </Box>
        ) : null}
        {formatNumber(integerPart, 1, 1)}
        <Box sx={{ position: 'relative', top: '0.2em', fontSize: '0.8em', display: 'inline-flex' }}>
          {zeroPart.length}
        </Box>
        {formatNumber(decimalPart, maxDigit)}
        {suffix ? (
          <Box as="span" sx={{ color: 'neutral3', ...(suffixSx ?? {}) }}>
            {suffix}
          </Box>
        ) : null}
      </Box>
      <Tooltip id={tooltipId} place="top" type="dark" effect="solid">
        <Type.Caption sx={{ maxWidth: 300 }}>
          {value < 0 && '-'}
          {prefix}
          {formatNumber(Math.abs(value), 18)}
          {suffix}
        </Type.Caption>
      </Tooltip>
    </>
  ) : (
    <ValueText
      value={formatNumber(formattedNumber, maxDigit, minDigit)}
      suffix={suffix}
      prefix={prefix}
      sx={sx}
      suffixSx={suffixSx}
      prefixSx={prefixSx}
    />
  )
}
