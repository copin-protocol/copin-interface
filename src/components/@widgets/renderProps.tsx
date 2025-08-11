import { Trans } from '@lingui/macro'
import { Square } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import AddressText from 'components/@ui/AddressText'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import Market from 'components/@ui/MarketGroup/Market'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { CopyPositionData } from 'entities/copyTrade'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import CopyButton from 'theme/Buttons/CopyButton'
import SkullIcon from 'theme/Icons/SkullIcon'
import ProgressBar from 'theme/ProgressBar'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { PROTOCOLS_IN_TOKEN } from 'utils/config/protocols'
import { calcClosedPrice, calcLiquidatePrice, calcRiskPercent, getOpeningPnl } from 'utils/helpers/calculate'
import { overflowEllipsis } from 'utils/helpers/css'
import { compactNumber, formatLeverage, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { formatSymbol, getSymbolFromPair } from 'utils/helpers/transform'
import { UsdPrices } from 'utils/types'

export function renderEntry(data: PositionData | undefined, textSx?: TextProps, showMarketIcon?: boolean) {
  return <EntryComponent data={data} textSx={textSx} showMarketIcon={showMarketIcon} />
}

function EntryComponent({
  data,
  textSx,
  showMarketIcon,
}: {
  data: PositionData | undefined
  textSx?: TextProps
  showMarketIcon?: boolean
}) {
  const { getSymbolByIndexToken, getHlSzDecimalsByPair } = useMarketsConfig()
  if (!data || !data.protocol) return <></>
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
  const hlDecimals = getHlSzDecimalsByPair?.(data.pair)

  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        color: 'neutral1',
        pr: 1,
      }}
    >
      <Type.Caption {...textSx} width={8} color={data.isLong ? 'green1' : 'red2'} data-key="isLong">
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      {showMarketIcon && <Market symbol={symbol} size={20} />}
      <Type.Caption sx={{ ...textSx } as any} data-key="pair">
        <Box as="span" sx={{ display: 'block', width: '100%', ...overflowEllipsis() }}>
          {formatSymbol(symbol)}
        </Box>
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption sx={{ ...textSx, flexShrink: 0 } as any} data-key="averagePrice">
        {data.averagePrice ? PriceTokenText({ value: data.averagePrice, maxDigit: 2, minDigit: 2, hlDecimals }) : '--'}
      </Type.Caption>
    </Flex>
  )
}

export function renderCopyEntry(data: CopyPositionData | undefined, textSx?: TextProps) {
  return <CopyEntryComponent data={data} textSx={textSx} />
}
function CopyEntryComponent({ data, textSx }: { data: CopyPositionData | undefined; textSx?: TextProps }) {
  const { getSymbolByIndexToken, getHlSzDecimalsByPair } = useMarketsConfig()
  if (!data || !data.protocol) return <></>
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
  const hlDecimals = getHlSzDecimalsByPair?.(data.pair)
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
      <Type.Caption>{symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption {...textSx}>
        {PriceTokenText({ value: data.entryPrice, maxDigit: 2, minDigit: 2, hlDecimals })}
      </Type.Caption>
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
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(data.pair)
  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex minWidth={190} sx={{ gap: '2px', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Flex flex={dynamicWidth ? undefined : '1'} sx={{ flexShrink: 0 }}>
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
              `$${formatNumber(data.maxSizeNumber ?? data.size, 0)}`
            )}
          </Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex minWidth={50} justifyContent="center" sx={{ flexShrink: 0 }}>
          <Type.Caption textAlign="right">{formatLeverage(data.marginMode, data.leverage)}</Type.Caption>
        </Flex>
        <VerticalDivider />
        <Flex
          flex={dynamicWidth ? undefined : '1.5'}
          justifyContent="flex-end"
          sx={{ flexShrink: 0, gap: 1, alignItems: 'center', height: 22 }}
        >
          <Square
            weight={'fill'}
            color={hasLiquidate ? themeColors.red2 : themeColors.neutral1}
            style={{ flexShrink: 0 }}
          />
          <Type.Caption flexShrink={0}>
            {closedPrice ? PriceTokenText({ value: closedPrice, maxDigit: 2, minDigit: 2, hlDecimals }) : '--'}
          </Type.Caption>
        </Flex>
      </Flex>
      <ProgressBar height={2} bg="neutral2" percent={0} sx={{ width: '100%' }} />
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
  const { getSymbolByIndexToken, getHlSzDecimalsByPair } = useMarketsConfig()
  if (!data || !prices) return <></>
  // Todo: Check calc for value in rewards
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : data.indexToken
    ? getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
    : ''
  const marketPrice = prices[symbol] ?? 0
  const liquidatePrice = data?.liquidationPrice ?? calcLiquidatePrice(data)
  const riskPercent = marketPrice
    ? calcRiskPercent(data.isLong, data.averagePrice, marketPrice, liquidatePrice ?? 0)
    : 0
  const { sx, ..._textProps } = textProps ?? {}

  const sizeNumber = data.maxSizeNumber ?? data.size
  const hlDecimals = getHlSzDecimalsByPair?.(data.pair)

  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2px' }}>
        <Flex flex={dynamicWidth ? undefined : '1'} minWidth={40} sx={{ flexShrink: 0 }}>
          <Type.Caption {..._textProps}>
            {PROTOCOLS_IN_TOKEN.includes(data.protocol) ? (
              <ValueOrToken
                protocol={data.protocol}
                value={sizeNumber}
                valueInToken={data.sizeInToken}
                indexToken={data.collateralToken}
                hasCompact={sizeNumber >= 100_100 || (data.sizeInToken ?? 0) >= 100_000}
                hasPrefix={false}
              />
            ) : (
              // `${sizeNumber >= 100_000 ? compactNumber(sizeNumber, 2) : formatNumber(sizeNumber, 0)}`
              <Type.Caption>${compactNumber(sizeNumber, 2)}</Type.Caption>
            )}
          </Type.Caption>
        </Flex>
        <VerticalDivider sx={{ opacity: 1 }} />
        <Flex minWidth={40} justifyContent="center" flexShrink={0}>
          <Type.Caption {..._textProps} textAlign="center">
            {formatLeverage(data.marginMode, data.leverage)}
          </Type.Caption>
        </Flex>
        <VerticalDivider sx={{ opacity: 1 }} />
        <Flex
          flex={dynamicWidth ? undefined : '1.5'}
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
              ? PriceTokenText({ value: liquidatePrice, maxDigit: 2, minDigit: 2, hlDecimals })
              : '--'}
          </Type.Caption>
        </Flex>
      </Flex>
      <ProgressBar
        percent={Math.abs(riskPercent)}
        color={riskPercent < 0 ? 'green2' : 'red2'}
        bg="neutral3"
        sx={{ width: '100%', height: '2px', mt: '2px' }}
      />
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
  const { getSymbolByIndexToken } = useMarketsConfig()
  if (!data || !prices) return <></>
  // Todo: Check calc for value in rewards
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : data.indexToken
    ? getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
    : ''
  const marketPrice = prices[symbol]
  const { pnl, pnlInToken } = getOpeningPnl({ data, marketPrice, ignoreFee })
  return (
    <ValueOrToken
      protocol={data.protocol}
      indexToken={pnl == null ? data.collateralToken : undefined}
      value={pnl}
      valueInToken={pnlInToken}
      component={
        <SignedText
          value={pnl ?? pnlInToken}
          maxDigit={2}
          minDigit={2}
          prefix="$"
          // isCompactNumber={Math.abs(pnl ?? pnlInToken ?? 0) >= 100_000}
          isCompactNumber
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
  const { getSymbolByIndexToken } = useMarketsConfig()
  if (!data || !prices || !data?.protocol || PROTOCOLS_CROSS_MARGIN.includes(data.protocol)) return <>--</>
  // Todo: Check calc for value in rewards
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : data.indexToken
    ? getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
    : ''
  const marketPrice = prices[symbol]
  const { pnl, pnlInToken } = getOpeningPnl({ data, marketPrice, ignoreFee })
  return SignedText({
    value: ((pnl ?? 0) * 100) / data.collateral,
    minDigit: 2,
    maxDigit: 2,
    suffix: '%',
    sx: { textAlign: 'right', width: '100%', ...sx },
  })
}

export function renderTrader(
  address: string,
  protocol: ProtocolEnum,
  hasCopy?: boolean,
  enableProtocolLogo?: boolean,
  onQuickView?: ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => void
) {
  const protocolTooltipId = uuid()

  return (
    <Flex sx={{ gap: 1, px: 1 }} alignItems="center">
      <Box
        width={24}
        height={24}
        sx={{
          '&:hover': onQuickView
            ? {
                cursor: 'pointer',
                backgroundImage: `url(${IconEye})`,
                backgroundSize: '20px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }
            : {},
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onQuickView?.({ address, protocol })
        }}
      >
        <AddressAvatar address={address} size={24} sx={{ '&:hover': onQuickView ? { opacity: 0.25 } : {} }} />
      </Box>

      <Link to={generateTraderMultiExchangeRoute({ protocol, address })} onClick={(e) => e.stopPropagation()}>
        <Flex sx={{ gap: 1 }} alignItems="center">
          <AddressText
            address={address}
            sx={{
              ...overflowEllipsis(),
              width: '85px',
              display: 'flex',
              ':hover': { textDecoration: 'underline' },
            }}
          />

          {enableProtocolLogo && (
            <>
              <ProtocolLogo
                protocol={protocol}
                size={22}
                hasText={false}
                data-tip="React-tooltip"
                data-tooltip-id={`tt_protocol_${protocolTooltipId}`}
                data-tooltip-offset={0}
              />
              <Tooltip id={`tt_protocol_${protocolTooltipId}`} clickable={false}>
                <ProtocolLogo protocol={protocol} />
              </Tooltip>
            </>
          )}
          {hasCopy && (
            <CopyButton
              type="button"
              variant="ghost"
              value={address}
              size="sm"
              sx={{ color: 'neutral3', p: 0 }}
              iconSize={14}
              className={'hiding-btn'}
            ></CopyButton>
          )}
        </Flex>
      </Link>
    </Flex>
  )
}

export function SymbolComponent({
  pair,
  indexToken,
  protocol,
}: {
  pair?: string
  indexToken?: string
  protocol?: ProtocolEnum
}) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  if (!pair && !indexToken) return <></>
  const symbol = pair ? getSymbolFromPair(pair) : getSymbolByIndexToken?.({ protocol, indexToken }) ?? ''
  return <span>{formatSymbol(symbol)}</span>
}
