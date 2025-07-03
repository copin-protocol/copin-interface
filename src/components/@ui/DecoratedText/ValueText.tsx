import { ReactElement } from 'react'

import useTraderBalances from 'hooks/features/trader/useTraderBalances'
import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import formatTokenPrices, { formatNumber, formatPrice } from 'utils/helpers/format'

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
      {suffix ? <Box as="span">{suffix}</Box> : null}
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
  const isNegative = amount < 0
  const modifiedPrefix = isNegative ? <>-{prefix}</> : prefix
  return (
    <ValueText
      value={formatNumber(Math.abs(amount), maxDigit, minDigit)}
      suffix={suffix}
      prefix={modifiedPrefix}
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
  smartAccount,
  maxDigit = 2,
  minDigit = 2,
  suffix,
  prefix = '$',
  sx,
  suffixSx,
  prefixSx,
}: {
  protocol: ProtocolEnum
  account: string | undefined
  smartAccount?: string
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
  const { balance: smartAccountBalance } = useTraderBalances({ account: smartAccount, protocol })

  const totalBalance = balance + smartAccountBalance

  return totalBalance > 0 ? (
    <ValueText
      value={formatNumber(totalBalance, maxDigit, minDigit)}
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
  if (value == null) return <>--</>
  const { formattedNumber, integerPart, zeroPart, decimalPart } = formatTokenPrices({
    value,
  })
  const tooltipId = `tt_${value}`
  return value < 1 && zeroPart.length >= 3 && Number(decimalPart) > 0 ? (
    <>
      <Box as="span" sx={sx} data-tip="React-tooltip" data-tooltip-id={tooltipId}>
        {prefix ? (
          <Box as="span" sx={prefixSx}>
            {prefix}
          </Box>
        ) : null}
        {Number(integerPart).toFixed(1)}
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
      <Tooltip id={tooltipId}>
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
      value={formatPrice(formattedNumber, maxDigit, minDigit)}
      suffix={suffix}
      prefix={prefix}
      sx={sx}
      suffixSx={suffixSx}
      prefixSx={prefixSx}
    />
  )
}
