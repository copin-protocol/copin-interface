import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopyPositionData } from 'entities/copyTrade'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import SkullIcon from 'theme/Icons/SkullIcon'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcLiquidatePrice, calcOpeningPnL, calcRiskPercent } from 'utils/helpers/calculate'
import { addressShorten, compactNumber, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

import AddressAvatar from '../AddressAvatar'
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
      <Type.Caption {...textSx}>
        {data.averagePrice ? PriceTokenText({ value: data.averagePrice, maxDigit: 2, minDigit: 2 }) : '--'}
      </Type.Caption>
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

export function renderSizeShorten(data: PositionData | undefined) {
  if (!data) return <></>
  return (
    <Flex sx={{ gap: 2, alignItems: 'center' }}>
      <Type.Caption>${compactNumber(data.maxSizeNumber ?? data.size, 1)}</Type.Caption>
      <VerticalDivider />
      <Type.Caption>{formatNumber(data.leverage, 1, 1)}x</Type.Caption>
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

export function renderSizeOpeningWithPrices(data: PositionData | undefined, prices: UsdPrices, textProps?: TextProps) {
  return <SizeOpeningComponent data={data} prices={prices} textProps={textProps} />
}
export function renderSizeOpening(data: PositionData | undefined, textProps?: TextProps) {
  return <SizeOpening data={data} textProps={textProps} />
}
type SizeOpeningComponentProps = {
  data: PositionData | undefined
  prices: UsdPrices | undefined
  textProps?: TextProps
}
function SizeOpening(props: Omit<SizeOpeningComponentProps, 'prices'>) {
  const prices = useGetUsdPrices()
  if (!prices) return <>--</>
  return <SizeOpeningComponent {...props} prices={prices} />
}
function SizeOpeningComponent({ data, prices, textProps }: SizeOpeningComponentProps) {
  if (!data || !prices) return <></>
  const marketPrice = prices[data.indexToken] ?? 0
  const liquidatePrice = calcLiquidatePrice(data)
  const riskPercent = calcRiskPercent(data.isLong, data.averagePrice, marketPrice, liquidatePrice ?? 0)
  const { sx, ..._textProps } = textProps ?? {}

  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Flex flex="50%">
          <Type.Caption {..._textProps}>{formatNumber(data.maxSizeNumber ?? data.size, 0)}</Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex
          minWidth={40}
          justifyContent="center"
          // sx={{ borderLeft: 'small', borderRight: 'small', borderColor: 'neutral4' }}
        >
          <Type.Caption {..._textProps} textAlign="center">
            {formatNumber(data.leverage, 1, 1)}x
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex flex="55%" justifyContent="flex-end" sx={{ gap: 1, alignItems: 'center', height: 22 }}>
          <SkullIcon style={{ flexShrink: 0 }} />
          <Type.Caption
            {..._textProps}
            sx={{
              ...sx,
              height: '22px',
              '& > *:first-child': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                maxWidth: 160,
                display: 'inline-block',
              },
            }}
          >
            {liquidatePrice ? PriceTokenText({ value: liquidatePrice, maxDigit: 2, minDigit: 2 }) : '--'}
          </Type.Caption>
        </Flex>
      </Flex>
      <ProgressBar percent={Math.abs(riskPercent)} color={riskPercent < 0 ? 'green2' : 'red2'} sx={{ width: '100%' }} />
    </Flex>
  )
}

type OpeningPnLComponentProps = {
  data: PositionData | undefined
  prices: UsdPrices | undefined
  ignoreFee?: boolean
  sx?: any
}
export function renderOpeningPnL(data: PositionData | undefined, ignoreFee?: boolean, sx?: TextProps) {
  return <OpeningPnL data={data} ignoreFee={ignoreFee} sx={sx} />
}
export function renderOpeningPnLWithPrices(
  data: PositionData | undefined,
  prices: UsdPrices | undefined,
  ignoreFee?: boolean,
  sx?: TextProps
) {
  return <OpeningPnLComponent data={data} prices={prices} ignoreFee={ignoreFee} sx={sx} />
}
function OpeningPnL(props: Omit<OpeningPnLComponentProps, 'prices'>) {
  const prices = useGetUsdPrices()
  if (!prices) return <>--</>
  return <OpeningPnLComponent {...props} prices={prices} />
}
function OpeningPnLComponent({ data, prices, ignoreFee, sx }: OpeningPnLComponentProps) {
  if (!data || !prices) return <></>
  const marketPrice = prices[data.indexToken]
  const openingPnl = calcOpeningPnL(data, marketPrice)
  const pnl = ignoreFee ? openingPnl : openingPnl - data.fee
  return SignedText({ value: pnl, maxDigit: 0, sx: { textAlign: 'right', width: '100%', ...sx } })
}

type OpeningRoiComponentProps = {
  data: PositionData | undefined
  prices: UsdPrices | undefined
  ignoreFee?: boolean
  sx?: any
}
export function renderOpeningRoiWithPrices(
  data: PositionData | undefined,
  prices: UsdPrices | undefined,
  ignoreFee?: boolean,
  sx?: TextProps
) {
  return <OpeningRoiComponent data={data} prices={prices} ignoreFee={ignoreFee} sx={sx} />
}
export function renderOpeningRoi(data: PositionData | undefined, ignoreFee?: boolean, sx?: TextProps) {
  return <OpeningRoi data={data} ignoreFee={ignoreFee} sx={sx} />
}
function OpeningRoi(props: Omit<OpeningRoiComponentProps, 'prices'>) {
  const prices = useGetUsdPrices()
  if (!prices) return <>--</>
  return <OpeningRoiComponent {...props} prices={prices} />
}
function OpeningRoiComponent({ data, prices, ignoreFee, sx }: OpeningRoiComponentProps) {
  if (!data || !prices) return <></>
  const marketPrice = prices[data.indexToken]
  const openingPnl = calcOpeningPnL(data, marketPrice)
  const pnl = ignoreFee ? openingPnl : openingPnl - data.fee
  return SignedText({
    value: (pnl * 100) / data.collateral,
    minDigit: 2,
    maxDigit: 2,
    suffix: '%',
    sx: { textAlign: 'right', width: '100%', ...sx },
  })
}

export function renderTrader(address: string, protocol: ProtocolEnum) {
  return (
    <Link to={generateTraderDetailsRoute(protocol, address)}>
      <Flex sx={{ gap: 2 }} alignItems="center">
        <AddressAvatar address={address} size={24} />
        <Type.Caption color="neutral1" sx={{ ':hover': { textDecoration: 'underline' } }}>
          {addressShorten(address, 3, 5)}
        </Type.Caption>
      </Flex>
    </Link>
  )
}

export const VerticalDivider = styled(Box)`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`

// export function renderPnL(data: CopyPositionData, prices?: UsdPrices) {
// const pnl =
//   data.status === PositionStatusEnum.OPEN
//     ? calcCopyOpeningPnL(data, prices ? prices[data.indexToken] : undefined)
//     : data.pnl
// return (
//   <Flex width="100%" sx={{ flexDirection: 'column', color: 'neutral1' }}>
//     {/* <Type.Caption color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'}>{formatNumber(pnl, 2, 2)}</Type.Caption> */}
//     <Type.Caption color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'}>{formatNumber(pnl, 2, 2)}</Type.Caption>
//     {/* <ProgressBar percent={0} sx={{ width: '100%' }} /> */}
//   </Flex>
// )
// }
