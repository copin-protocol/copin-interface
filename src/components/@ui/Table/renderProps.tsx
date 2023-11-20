import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopyPositionData } from 'entities/copyTrade'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import SkullIcon from 'theme/Icons/SkullIcon'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcCopyOpeningPnL, calcLiquidatePrice, calcOpeningPnL, calcRiskPercent } from 'utils/helpers/calculate'
import { formatNumber } from 'utils/helpers/format'

import { PriceTokenText } from '../DecoratedText/ValueText'

export function renderEntry(data: PositionData | undefined, textSx?: TextProps) {
  if (!data || !data.protocol) return <></>
  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        color: 'neutral1',
      }}
    >
      <Type.Caption {...textSx} width={8} color={data.isLong ? 'green1' : 'red2'}>
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption {...textSx}>{TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken]?.symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption {...textSx}>{PriceTokenText({ value: data.averagePrice, maxDigit: 2, minDigit: 2 })}</Type.Caption>
    </Flex>
  )
}

export function renderCopyEntry(data: CopyPositionData | undefined, textSx?: TextProps) {
  if (!data) return <></>
  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        color: 'neutral1',
      }}
    >
      <Type.Caption {...textSx} width={8} color={data.isLong ? 'green1' : 'red2'}>
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption>{TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken]?.symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption {...textSx}>${PriceTokenText({ value: data.entryPrice, maxDigit: 2, minDigit: 2 })}</Type.Caption>
    </Flex>
  )
}
export function renderSize(data: PositionData | undefined) {
  if (!data) return <></>
  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex minWidth={190} sx={{ gap: '1px', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Type.Caption>{formatNumber(data.maxSizeNumber ?? data.size, 0)}</Type.Caption>
        <Type.Caption textAlign="right">{formatNumber(data.leverage, 1, 1)}x</Type.Caption>
      </Flex>
      <ProgressBar percent={0} sx={{ width: '100%' }} />
    </Flex>
  )
}

export function renderSizeOpening(data: PositionData | undefined, prices: UsdPrices, textSx?: TextProps) {
  if (!data) return <></>
  const gmxPrice = prices[data.indexToken] ?? 0
  const liquidatePrice = calcLiquidatePrice(data, prices)
  const riskPercent = calcRiskPercent(data.isLong, data.averagePrice, gmxPrice, liquidatePrice ?? 0)

  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Flex flex="50%">
          <Type.Caption {...textSx}>{formatNumber(data.maxSizeNumber ?? data.size, 0)}</Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex
          minWidth={40}
          justifyContent="center"
          // sx={{ borderLeft: 'small', borderRight: 'small', borderColor: 'neutral4' }}
        >
          <Type.Caption {...textSx} textAlign="center">
            {formatNumber(data.leverage, 1, 1)}x
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex flex="55%" justifyContent="flex-end" sx={{ gap: 1, alignItems: 'center' }}>
          <SkullIcon />
          <Type.Caption {...textSx}>
            {liquidatePrice ? PriceTokenText({ value: liquidatePrice, maxDigit: 2, minDigit: 2 }) : '--'}
          </Type.Caption>
        </Flex>
      </Flex>
      <ProgressBar percent={Math.abs(riskPercent)} color={riskPercent < 0 ? 'green2' : 'red2'} sx={{ width: '100%' }} />
    </Flex>
  )
}

export function renderOpeningPnL(
  data: PositionData | undefined,
  prices: UsdPrices,
  ignoreFee?: boolean,
  sx?: TextProps
) {
  if (!data) return <></>
  const marketPrice = prices[data.indexToken]
  const pnl = calcOpeningPnL(data, marketPrice)
  const realisedPnl = ignoreFee ? pnl : pnl - data.fee
  return SignedText({ value: realisedPnl, maxDigit: 0, sx: { textAlign: 'right', width: '100%', ...sx } })
}

export function renderPnL(data: CopyPositionData, prices?: UsdPrices) {
  const pnl =
    data.status === PositionStatusEnum.OPEN
      ? calcCopyOpeningPnL(data, prices ? prices[data.indexToken] : undefined)
      : data.pnl
  return (
    <Flex width="100%" sx={{ flexDirection: 'column', color: 'neutral1' }}>
      <Type.Caption color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'}>{formatNumber(pnl, 2, 2)}</Type.Caption>
      {/* <ProgressBar percent={0} sx={{ width: '100%' }} /> */}
    </Flex>
  )
}

export const VerticalDivider = styled(Box)`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`
