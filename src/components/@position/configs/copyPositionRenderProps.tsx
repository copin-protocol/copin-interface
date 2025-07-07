import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'

import { renderCopyWalletLabel } from 'components/@copyTrade/renderProps/copyTradeColumns'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import TraderAddress from 'components/@ui/TraderAddress'
import { SymbolComponent } from 'components/@widgets/renderProps'
import { CopyPositionData, CopyTradeData } from 'entities/copyTrade.d'
import { CopyWalletData } from 'entities/copyWallet'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { Button } from 'theme/Buttons'
import SkullIcon from 'theme/Icons/SkullIcon'
import Loading from 'theme/Loading'
import ProgressBar from 'theme/ProgressBar'
import StatusTag from 'theme/Tag/StatusTag'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import {
  CopyTradePlatformEnum,
  CopyTradeStatusEnum,
  PositionStatusEnum,
  ProtocolEnum,
  SLTPTypeEnum,
} from 'utils/config/enums'
import { COPY_POSITION_CLOSE_TYPE_TRANS } from 'utils/config/translations'
import { calcCopyLiquidatePrice, calcCopyOpeningPnL, calcRiskPercent } from 'utils/helpers/calculate'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten, compactNumber, formatNumber, formatPrice } from 'utils/helpers/format'
import { SYMBOL_BY_PROTOCOL_MAPPING } from 'utils/helpers/price'
import { getSymbolFromPair, normalizeExchangePrice, parseColorByValue, parseWalletName } from 'utils/helpers/transform'
import { UsdPrices } from 'utils/types'

export const renderCopyWallet = (data: CopyPositionData, _: number | undefined, externalSource: any) => {
  let walletName = '--'
  if (data.copyWalletName) {
    walletName = data.copyWalletName
  } else if (data.copyWalletId) {
    const walletFromContext = externalSource?.copyWallets?.find(
      (wallet: CopyWalletData) => wallet.id === data.copyWalletId
    )
    if (walletFromContext) {
      walletName = parseWalletName(walletFromContext)
    }
  } else if (data.copyTradeId) {
    const copyTrade = externalSource?.copyTrades?.find((trade: CopyTradeData) => trade.id === data.copyTradeId)
    if (copyTrade) {
      const walletFromContext = externalSource?.copyWallets?.find(
        (wallet: CopyWalletData) => wallet.id === copyTrade.copyWalletId
      )
      if (walletFromContext) {
        walletName = parseWalletName(walletFromContext)
      }
    }
  }
  return renderCopyWalletLabel({ walletName, exchange: data.exchange })
}

export const renderCopyTitle = (data: CopyPositionData) => (
  <Type.Caption color="neutral1" sx={{ maxWidth: '110px', ...overflowEllipsis(), display: 'block' }}>
    {data.copyTradeTitle}
  </Type.Caption>
)

export function renderEntry(data: CopyPositionData) {
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', color: 'neutral1' }}>
      <Type.Caption width={8} color={data.isLong ? 'green1' : 'red2'}>
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption>
        <SymbolComponent pair={data.pair} indexToken={data.indexToken} protocol={data.protocol} />
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption>{formatPrice(data.entryPrice)}</Type.Caption>
    </Flex>
  )
}

export function renderOpeningSize(data: CopyPositionData) {
  return <OpeningSizeComponent data={data} />
}

function OpeningSizeComponent({ data, dynamicWidth }: { data: CopyPositionData | undefined; dynamicWidth?: boolean }) {
  const { gainsPrices, prices } = useGetUsdPrices()
  const { getSymbolByIndexToken } = useMarketsConfig()
  if (!data) return <></>
  const _prices = data.protocol && GAINS_TRADE_PROTOCOLS.includes(data.protocol) ? gainsPrices : prices
  // Todo: Check calc for value in rewards

  const symbolByIndexToken = getSymbolByIndexToken
    ? getSymbolByIndexToken?.({ protocol: data?.protocol, indexToken: data?.indexToken })
    : undefined
  const symbol = data?.pair ? getSymbolFromPair(data.pair) : symbolByIndexToken
  const marketPrice: number = symbol && _prices[symbol] != null ? (_prices[symbol] as number) : 0
  const liquidatePrice = calcCopyLiquidatePrice(data)
  const riskPercent = calcRiskPercent(!!data.isLong, data.entryPrice, marketPrice, liquidatePrice ?? 0)

  return (
    <Flex width="100%" sx={{ flexDirection: 'column', alignItems: 'center', color: 'neutral1' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2px' }}>
        <Flex flex={dynamicWidth ? undefined : '1.15'} minWidth={40} sx={{ flexShrink: 0 }}>
          <Type.Caption>${formatNumber(Number(data.sizeDelta) * (data.entryPrice ?? 0), 0)}</Type.Caption>
        </Flex>
        <VerticalDivider sx={{ opacity: 0.2 }} />
        <Flex minWidth={40} justifyContent="center" flexShrink={0}>
          <Type.Caption textAlign="center">{formatNumber(data.leverage, 1, 1)}x</Type.Caption>
        </Flex>
        <VerticalDivider sx={{ opacity: 0.2 }} />
        <Flex
          flex={dynamicWidth ? undefined : '1.15'}
          justifyContent="flex-end"
          sx={{ flexShrink: 0, gap: 1, alignItems: 'center', height: 22 }}
        >
          <SkullIcon style={{ flexShrink: 0 }} />
          <Type.Caption
            sx={{
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
      <ProgressBar
        percent={Math.abs(riskPercent)}
        color={riskPercent < 0 ? 'green2' : 'red2'}
        bg="neutral3"
        sx={{ width: '100%', height: '2px', mt: '2px' }}
      />
    </Flex>
  )
}

export function renderPnL(data: CopyPositionData, prices?: UsdPrices, textSx?: any) {
  if (data.status === PositionStatusEnum.OPEN) {
    return <OpeningPositionPnlComponent data={data} textSx={textSx} />
  }
  return <PnLComponent data={data} prices={prices} textSx={textSx} />
}

type PnLComponentProps = {
  data: CopyPositionData
  prices?: UsdPrices
  textSx?: any
}

function OpeningPositionPnlComponent({ data, textSx }: PnLComponentProps) {
  const { getPricesData } = useGetUsdPrices()
  const _prices = getPricesData({ protocol: data.protocol, exchange: data.exchange })

  return <PnLComponent data={data} prices={_prices} textSx={textSx} />
}

function useGetCopyPositionPnl({ data, prices }: { data: CopyPositionData; prices?: UsdPrices }) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  if (!data.protocol) return 0
  const symbolByIndexToken = getSymbolByIndexToken
    ? getSymbolByIndexToken?.({ protocol: data?.protocol, indexToken: data?.indexToken })
    : undefined
  const symbol = data?.pair ? getSymbolFromPair(data.pair) : symbolByIndexToken
  const isOpening = data.status === PositionStatusEnum.OPEN
  const symbolByProtocol = SYMBOL_BY_PROTOCOL_MAPPING[`${data.protocol}-${symbol}`]
  const priceSymbol =
    [ProtocolEnum.GNS, ProtocolEnum.GNS_APE, ProtocolEnum.GNS_BASE, ProtocolEnum.GNS_POLY].includes(data.protocol) &&
    data.exchange === CopyTradePlatformEnum.HYPERLIQUID &&
    symbolByProtocol
      ? symbolByProtocol
      : symbol ?? ''
  const pnl = isOpening
    ? calcCopyOpeningPnL(
        data,
        prices && priceSymbol
          ? normalizeExchangePrice({
              protocolSymbol: priceSymbol,
              protocolSymbolPrice: prices[priceSymbol],
              exchange: data.exchange,
            })
          : undefined
      )
    : data.realisedPnl ?? data.pnl
  return pnl
}

function PnLComponent({ data, prices, textSx }: PnLComponentProps) {
  const isOpening = data.status === PositionStatusEnum.OPEN
  // const pnl = useGetCopyPositionPnl({ data, prices })
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const pnl = pnlWithFeeEnabled ? data.pnl : data.realisedPnl

  return isOpening ? (
    renderValueWithColor(pnl ?? 0)
  ) : (
    <LabelWithTooltip
      id={`tt_copy_pnl_${data.id}_${data.status}`}
      tooltipSx={{ textAlign: 'left' }}
      tooltip={
        <Flex flexDirection="column" sx={{ gap: 2 }}>
          <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
            <Type.Caption>PnL w. Fees:</Type.Caption>
            {renderValueWithColor(data.pnl ?? 0)}
          </Flex>
          <Divider />
          <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
            <Type.Caption>Realized PnL:</Type.Caption>
            {renderValueWithColor(data.realisedPnl)}
          </Flex>
          {!!data.fee && (
            <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
              <Type.Caption>Fees:</Type.Caption>
              {renderValueWithColor(data.fee)}
            </Flex>
          )}
          {!!data.funding && (
            <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
              <Type.Caption>Funding:</Type.Caption>
              {renderValueWithColor(data.funding)}
            </Flex>
          )}
        </Flex>
      }
      dashed
    >
      {renderValueWithColor(pnl ?? 0, textSx)}
    </LabelWithTooltip>
  )
}

/**
 *  use for hl position
 */
export function renderOpeningROI(data: CopyPositionData) {
  return <OpeningPositionROIComponent data={data} />
}
function OpeningPositionROIComponent({ data }: { data: CopyPositionData }) {
  const { getPricesData } = useGetUsdPrices()
  const _prices = getPricesData({ protocol: data.protocol, exchange: data.exchange })
  const pnl = useGetCopyPositionPnl({ data, prices: _prices })
  const sizeUsd = data.entryPrice ? Number(data.sizeDelta ?? 0) * data.entryPrice : 0
  const roi = sizeUsd <= 0 ? 0 : data.leverage ? ((pnl ?? 0) / (sizeUsd / data.leverage)) * 100 : 0

  return <SignedText value={roi} maxDigit={2} suffix="%" fontInherit sx={{ fontSize: 12 }} />
}

export function renderValueWithColor(value: number | undefined, textSx?: any) {
  return (
    <Type.Caption color={parseColorByValue(value)} sx={{ ...textSx }}>
      {`${(value ?? 0) < 0 ? '-' : ''}$${formatNumber(Math.abs(value ?? 0) ?? 0, 2, 2)}`}
    </Type.Caption>
  )
}

export function renderTrader(address: string | undefined, protocol: ProtocolEnum | undefined) {
  if (address == null) return <>--</>
  return <TraderAddress address={address} protocol={protocol} />
}

export const renderOpenTime = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    <LocalTimeText date={data.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
  </Type.Caption>
)

export const renderCloseTime = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    {data.status === PositionStatusEnum.CLOSE ? (
      <LocalTimeText date={data.lastOrderAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
    ) : (
      '--'
    )}
  </Type.Caption>
)

export const renderValue = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    {data.status === PositionStatusEnum.OPEN
      ? formatNumber(Number(data.sizeDelta), 4, 4)
      : !isNaN(Number(data.totalSizeDelta))
      ? formatNumber(Number(data.totalSizeDelta), 4, 4)
      : '--'}{' '}
    {getSymbolFromPair(data.pair)}
  </Type.Caption>
)
export const renderSize = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    $
    {!isNaN(Number(data.totalSizeDelta))
      ? formatNumber(Number(data.totalSizeDelta) * (data.entryPrice ?? 0), 0)
      : data.status === PositionStatusEnum.OPEN
      ? formatNumber(Number(data.sizeDelta) * (data.entryPrice ?? 0), 0)
      : '--'}
  </Type.Caption>
)

export const renderLeverage = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">{formatNumber(data.leverage, 1, 1)}x</Type.Caption>
)

export const renderSizeMobile = (data: CopyPositionData) => (
  <Flex sx={{ gap: 1, alignItems: 'center' }}>
    {renderValue(data)}
    <VerticalDivider />
    {renderSize(data)}
    <VerticalDivider />
    {renderLeverage(data)}
  </Flex>
)
export const renderStatus = (data: CopyPositionData) => (
  <Flex width="100%" alignItems="center" justifyContent="left">
    <StatusTag width={70} status={data.status} />
  </Flex>
)

export const renderCloseType = (data: CopyPositionData) => (
  <Type.Caption>{!data.closeType ? '--' : COPY_POSITION_CLOSE_TYPE_TRANS[data.closeType]}</Type.Caption>
)

const VerticalDivider = styled(Box)`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`

export function renderSource(item: CopyPositionData, index?: number, externalSource?: any, isHistory?: boolean) {
  return externalSource?.submitting && externalSource?.currentId === item.id ? (
    <Flex sx={{ width: '100%', height: '12px', alignItems: 'center', justifyContent: 'center' }}>
      <Loading size={12} m={0} />
    </Flex>
  ) : (
    <Button
      variant="ghost"
      type="button"
      sx={{ p: 0, mx: 0 }}
      onClick={(event: any) =>
        externalSource && externalSource.onViewSource ? externalSource.onViewSource(item, event) : undefined
      }
    >
      <Type.Caption
        sx={{
          display: 'block',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {addressShorten(item.sourceOrderTxHashes?.[0] ?? item.copyAccount ?? '', isHistory ? 4 : 3, isHistory ? 4 : 2)}
      </Type.Caption>
    </Button>
  )
}

export function renderSLTP(item: CopyPositionData) {
  return (
    <Type.Caption color="neutral1">
      {item.stopLossPrice ? formatNumber(item.stopLossPrice, 2, 2) : '--'} /{' '}
      {item.takeProfitPrice ? formatNumber(item.takeProfitPrice, 2, 2) : '--'}
    </Type.Caption>
  )
}
export function renderCollateral(item: CopyPositionData) {
  return (
    <Type.Caption color="neutral1">
      $
      {formatNumber(
        item.leverage && item.entryPrice ? (Number(item.sizeDelta ?? 0) * item.entryPrice) / item.leverage : undefined,
        2,
        2
      )}
    </Type.Caption>
  )
}

export function renderSLTPSetting(item: CopyTradeData, ignoreDisable?: boolean) {
  const formatSLTP = (type: SLTPTypeEnum, amount?: number) => {
    const formatAmount = (amount ?? 0) >= 10000 ? compactNumber(item.stopLossAmount, 2) : formatNumber(amount)
    return type === SLTPTypeEnum.PERCENT ? `${formatAmount}%` : `$${formatAmount}`
  }
  return (
    <Flex alignItems="center">
      <Box
        as="span"
        color={ignoreDisable || (!ignoreDisable && item.status === CopyTradeStatusEnum.RUNNING) ? 'red2' : 'neutral3'}
      >
        {item.enableStopLoss ? formatSLTP(item.stopLossType, item.stopLossAmount) : '--'}
      </Box>
      <Box as="span" color="neutral3">
        {' / '}
      </Box>
      <Box
        as="span"
        color={ignoreDisable || (!ignoreDisable && item.status === CopyTradeStatusEnum.RUNNING) ? 'green1' : 'neutral3'}
      >
        {item.enableTakeProfit ? formatSLTP(item.takeProfitType, item.takeProfitAmount) : '--'}
      </Box>
    </Flex>
  )
}

// export const renderWalletName = (item: CopyPositionData, externalSource: any) => {
//     let walletName = '--'
//     const walletFromContext = externalSource?.copyWallets?.find((wallet) => wallet.id === item.)
//     if (walletFromContext) {
//         walletName = parseWalletName(walletFromContext)
//     }
//     return (
//         <Flex sx={{ alignItems: 'center', gap: 2 }}>
//             <Type.Caption
//                 color="neutral1"
//                 sx={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
//             >
//                 {walletName}
//             </Type.Caption>
//             <VerticalDivider />
//             <Image src={parseExchangeImage(item.exchange)} width={20} height={20} />
//         </Flex>
//     )
// }
// export function OrderTxHashes({ data }: { data: CopyPositionData }) {
//   const [isExpand, setIsExpand] = useState(false)
//   const tokenTrade = useMemo(() => TOKEN_TRADE_SUPPORT[data.indexToken], [data.indexToken])
//
//   const { data: positionDetail, isLoading } = useQuery(
//     [QUERY_KEYS.GET_MY_COPY_POSITION_DETAIL, data?.id,],
//     () =>
//       data.status === PositionStatusEnum.CLOSE
//         ? getMyCopySourcePositionDetailApi({ copyId: data?.id ?? '' })
//         : getOpeningPositionDetailApi({
//             protocol: ProtocolEnum.GMX,
//             account: data.copyAccount,
//             indexToken: data.indexToken,
//             key: data.key,
//           }),
//     {
//       retry: 0,
//       enabled: (!!data?.id || (!!data.indexToken && !!data.copyAccount && !!data.key)) && isExpand,
//     }
//   )
//
//   return (
//     <Flex flexDirection="column">
//       {isExpand && (
//         <Flex
//           py={2}
//           flexDirection="column"
//           sx={{
//             gap: 2,
//             borderBottom: '1px solid',
//             borderColor: 'neutral4',
//           }}
//         >
//           <Flex alignItems="center" sx={{ gap: 3 }}>
//             <Type.Caption width={110} textAlign="left">
//               <Trans>Source Order</Trans>
//             </Type.Caption>
//             <Type.Caption width={110} textAlign="left">
//               <Trans>Copy Order</Trans>
//             </Type.Caption>
//             <Type.Caption width={150} textAlign="left">
//               <Trans>Position Details</Trans>
//             </Type.Caption>
//           </Flex>
//           <Flex alignItems="flex-start" sx={{ gap: 3 }}>
//             <Flex width={110} flexDirection="column" alignItems="flex-start">
//               {data.sourceOrderTxHashes.map((txHash, index) => {
//                 return (
//                   <a key={index} href={`${LINKS.arbitrumExplorer}/tx/${txHash}`} target="_blank" rel="noreferrer">
//                     <Type.Caption color="primary1" textAlign="left" sx={{ ':hover': { textDecoration: 'underline' } }}>
//                       {addressShorten(txHash, 3, 3)}
//                     </Type.Caption>
//                   </a>
//                 )
//               })}
//             </Flex>
//             <Flex width={110} flexDirection="column" alignItems="flex-start">
//               {data.orderTxHashes.map((txHash, index) => {
//                 return (
//                   <a key={index} href={`${LINKS.arbitrumExplorer}/tx/${txHash}`} target="_blank" rel="noreferrer">
//                     <Type.Caption color="primary1" textAlign="left" sx={{ ':hover': { textDecoration: 'underline' } }}>
//                       {addressShorten(txHash, 3, 3)}
//                     </Type.Caption>
//                   </a>
//                 )
//               })}
//             </Flex>
//             <Flex width={150} flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
//               <a
//                 href={
//                   isLoading
//                     ? ''
//                     : positionDetail && data.status === PositionStatusEnum.CLOSE
//                     ? // TODO: 2
//                       generateClosedPositionRoute(ProtocolEnum.GMX, { id: positionDetail.id })
//                     : generateOpeningPositionRoute(ProtocolEnum.GMX, data)
//                 }
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <Type.Caption color="primary1" textAlign="left" sx={{ ':hover': { textDecoration: 'underline' } }}>
//                   {isLoading ? <Trans>Loading...</Trans> : <Trans>View</Trans>}
//                 </Type.Caption>
//               </a>
//             </Flex>
//           </Flex>
//         </Flex>
//       )}
//       <Flex width="100%">
//         <Button width="100%" py={0} pt={2} type="button" variant="ghost" onClick={() => setIsExpand(!isExpand)}>
//           <Type.CaptionBold color="neutral3" sx={{ ':hover': { color: 'neutral2' } }}>
//             {isExpand ? <Trans>Collapse</Trans> : <Trans>View Order Detail</Trans>}
//           </Type.CaptionBold>
//         </Button>
//       </Flex>
//     </Flex>
//   )
// }
