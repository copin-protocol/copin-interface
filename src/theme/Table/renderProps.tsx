import { Trans } from '@lingui/macro'
import { Square } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import Market from 'components/@ui/MarketGroup/Market'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { CopyPositionData } from 'entities/copyTrade'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import CopyButton from 'theme/Buttons/CopyButton'
import SkullIcon from 'theme/Icons/SkullIcon'
import ProgressBar from 'theme/ProgressBar'
import { Flex, TextProps, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOLS_IN_TOKEN } from 'utils/config/protocols'
import { calcClosedPrice, calcLiquidatePrice, calcRiskPercent, getOpeningPnl } from 'utils/helpers/calculate'
import { addressShorten, compactNumber, formatLeverage, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { getSymbolFromPair } from 'utils/helpers/transform'

export function renderEntry(data: PositionData | undefined, textSx?: TextProps, showMarketIcon?: boolean) {
  if (!data || !data.protocol) return <></>
  const symbol = getSymbolFromPair(data.pair)

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
      {showMarketIcon && <Market symbol={symbol} size={24} />}
      <Type.Caption {...textSx}>{getSymbolFromPair(data.protocol)}</Type.Caption>
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
      <Type.Caption>{getSymbolFromPair(data.pair)}</Type.Caption>
      <VerticalDivider />
      <Type.Caption {...textSx}>${PriceTokenText({ value: data.entryPrice, maxDigit: 2, minDigit: 2 })}</Type.Caption>
    </Flex>
  )
}

export function renderSizeShorten(data: PositionData | undefined) {
  if (!data) return <></>
  return (
    <Flex sx={{ gap: 2, alignItems: 'center' }}>
      <Type.Caption>
        {PROTOCOLS_IN_TOKEN.includes(data.protocol) ? (
          <ValueOrToken
            protocol={data.protocol}
            value={data.maxSizeNumber ?? data.size}
            valueInToken={data.sizeInToken}
            indexToken={data.collateralToken}
            hasCompact={true}
            hasPrefix={false}
          />
        ) : (
          `$${compactNumber(data.maxSizeNumber ?? data.size, 1)}`
        )}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption>{formatLeverage(data.marginMode, data.leverage)}</Type.Caption>
    </Flex>
  )
}

export function renderSize(data: PositionData | undefined, hasLiquidate?: boolean, dynamicWidth?: boolean) {
  if (!data) return <></>
  const closedPrice = calcClosedPrice(data)
  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex minWidth={190} sx={{ gap: '2px', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Flex flex={dynamicWidth ? undefined : '1.15'} sx={{ flexShrink: 0 }}>
          <Type.Caption>
            {PROTOCOLS_IN_TOKEN.includes(data.protocol) ? (
              <ValueOrToken
                protocol={data.protocol}
                value={data.maxSizeNumber ?? data.size}
                valueInToken={data.sizeInToken}
                indexToken={data.collateralToken}
                hasCompact={data.sizeInToken >= 100000}
                hasPrefix={false}
              />
            ) : (
              `${formatNumber(data.maxSizeNumber ?? data.size, 0)}`
            )}
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex minWidth={50} justifyContent="center" sx={{ flexShrink: 0 }}>
          <Type.Caption textAlign="right">{formatLeverage(data.marginMode, data.leverage)}</Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex
          flex={dynamicWidth ? undefined : '1.15'}
          justifyContent="flex-end"
          sx={{ flexShrink: 0, gap: 1, alignItems: 'center', height: 22 }}
        >
          <Square
            weight={'fill'}
            color={hasLiquidate ? themeColors.red2 : themeColors.neutral1}
            style={{ flexShrink: 0 }}
          />
          <Type.Caption flexShrink={0}>
            {closedPrice ? PriceTokenText({ value: closedPrice, maxDigit: 2, minDigit: 2 }) : '--'}
          </Type.Caption>
        </Flex>
      </Flex>
      <ProgressBar percent={0} sx={{ width: '100%' }} />
    </Flex>
  )
}

export function renderSizeOpeningWithPrices(
  data: PositionData | undefined,
  prices: UsdPrices,
  textProps?: TextProps,
  dynamicWidth?: boolean
) {
  return <SizeOpeningComponent data={data} prices={prices} textProps={textProps} dynamicWidth={dynamicWidth} />
}
export function renderSizeOpening(data: PositionData | undefined, textProps?: TextProps, dynamicWidth?: boolean) {
  return <SizeOpening data={data} textProps={textProps} dynamicWidth={dynamicWidth} />
}
type SizeOpeningComponentProps = {
  data: PositionData | undefined
  prices: UsdPrices | undefined
  textProps?: TextProps
  dynamicWidth?: boolean
}
function SizeOpening(props: Omit<SizeOpeningComponentProps, 'prices'>) {
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: props?.data?.protocol })
  if (!prices) return <>--</>
  return <SizeOpeningComponent {...props} prices={prices} />
}
function SizeOpeningComponent({ data, prices, textProps, dynamicWidth }: SizeOpeningComponentProps) {
  if (!data || !prices) return <></>
  const marketPrice = prices[getSymbolFromPair(data.pair)] ?? 0
  const liquidatePrice = calcLiquidatePrice(data)
  const riskPercent = calcRiskPercent(data.isLong, data.averagePrice, marketPrice, liquidatePrice ?? 0)
  const { sx, ..._textProps } = textProps ?? {}

  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2px' }}>
        <Flex flex={dynamicWidth ? undefined : '1.15'} minWidth={40} sx={{ flexShrink: 0 }}>
          <Type.Caption {..._textProps}>
            {PROTOCOLS_IN_TOKEN.includes(data.protocol) ? (
              <ValueOrToken
                protocol={data.protocol}
                value={data.maxSizeNumber ?? data.size}
                valueInToken={data.sizeInToken}
                indexToken={data.collateralToken}
                hasCompact={!!data.sizeInToken && data.sizeInToken >= 100000}
                hasPrefix={false}
              />
            ) : (
              `${formatNumber(data.maxSizeNumber ?? data.size, 0)}`
            )}
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex minWidth={40} justifyContent="center" flexShrink={0}>
          <Type.Caption {..._textProps} textAlign="center">
            {formatLeverage(data.marginMode, data.leverage)}
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex
          flex={dynamicWidth ? undefined : '1.15'}
          justifyContent="flex-end"
          sx={{ flexShrink: 0, gap: 1, alignItems: 'center', height: 22 }}
        >
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
                width: dynamicWidth ? 'max-content' : '100%',
                maxWidth: 160,
                display: 'inline-block',
              },
            }}
          >
            {liquidatePrice && liquidatePrice > 0
              ? PriceTokenText({ value: liquidatePrice, maxDigit: 2, minDigit: 2 })
              : '--'}
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
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: props?.data?.protocol })
  if (!prices) return <>--</>
  return <OpeningPnLComponent {...props} prices={prices} />
}
function OpeningPnLComponent({ data, prices, ignoreFee, sx }: OpeningPnLComponentProps) {
  if (!data || !prices) return <></>
  // Todo: Check calc for value in rewards
  const marketPrice = prices[getSymbolFromPair(data.pair)]
  const { pnl, pnlInToken } = getOpeningPnl({ data, marketPrice, ignoreFee })
  return (
    <ValueOrToken
      protocol={data.protocol}
      indexToken={pnl == null && pnlInToken != null ? data.collateralToken : undefined}
      value={pnl}
      valueInToken={pnlInToken}
      component={
        <SignedText
          value={pnl ?? pnlInToken}
          maxDigit={2}
          minDigit={2}
          sx={{ textAlign: 'right', width: '100%', ...sx }}
        />
      }
    />
  )
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
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: props?.data?.protocol })
  if (!prices) return <>--</>
  return <OpeningRoiComponent {...props} prices={prices} />
}
function OpeningRoiComponent({ data, prices, ignoreFee, sx }: OpeningRoiComponentProps) {
  if (!data || !prices) return <></>
  const marketPrice = prices[getSymbolFromPair(data.pair)]
  const { pnl, pnlInToken } = getOpeningPnl({ data, marketPrice, ignoreFee })
  return SignedText({
    value: ((pnl ?? 0) * 100) / data.collateral,
    minDigit: 2,
    maxDigit: 2,
    suffix: '%',
    sx: { textAlign: 'right', width: '100%', ...sx },
  })
}

export function renderTrader(address: string, protocol: ProtocolEnum, hasCopy?: boolean) {
  return (
    <Link to={generateTraderMultiExchangeRoute({ protocol, address })} onClick={(e) => e.stopPropagation()}>
      <Flex sx={{ gap: 2 }} alignItems="center">
        <AddressAvatar address={address} size={24} />
        <Type.Caption color="neutral1" sx={{ ':hover': { textDecoration: 'underline' } }}>
          {addressShorten(address, 3, 5)}
        </Type.Caption>
        {hasCopy && (
          <CopyButton
            type="button"
            variant="ghost"
            value={address}
            size="sm"
            sx={{ color: 'neutral3', p: 0 }}
            iconSize={14}
          ></CopyButton>
        )}
      </Flex>
    </Link>
  )
}
