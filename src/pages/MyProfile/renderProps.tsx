import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { CopyPositionData } from 'entities/copyTrade.d'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, TextProps, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcCopyOpeningPnL } from 'utils/helpers/calculate'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

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
      <Type.Caption>{TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken].symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption>{formatNumber(data.entryPrice, 2)}</Type.Caption>
    </Flex>
  )
}
export function renderPnL(data: CopyPositionData, prices?: UsdPrices) {
  const pnl =
    data.status === PositionStatusEnum.OPEN
      ? calcCopyOpeningPnL(data, prices ? prices[data.indexToken] : undefined)
      : data.pnl

  return (
    <Type.Caption color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'}>{formatNumber(pnl, 2, 2)}</Type.Caption>
  )
}

export function renderTrader(
  address: string,
  protocol?: ProtocolEnum,
  {
    sx = {},
    textSx = {},
    isLink = true,
    size = 24,
    dividerColor = 'neutral4',
    hasAddressTooltip = false,
  }: {
    textSx?: TextProps
    isLink?: boolean
    size?: number
    dividerColor?: string
    hasAddressTooltip?: boolean
  } & SxProps = {}
) {
  const tooltipId = uuid()
  return (
    <Flex
      as={isLink && protocol ? Link : undefined}
      to={isLink && protocol ? generateTraderDetailsRoute(protocol, address) : ''}
      sx={{ gap: 2, ...sx }}
      alignItems="center"
    >
      <AddressAvatar address={address} size={size} />
      <Type.Caption
        className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
        color="inherit"
        data-trader-address={address}
        sx={{ color: 'neutral1', ':hover': { textDecoration: isLink ? 'underline' : undefined }, ...textSx }}
        {...(hasAddressTooltip ? { 'data-tooltip-id': tooltipId, 'data-tooltip-delay-show': 360 } : {})}
      >
        {addressShorten(address, 3, 5)}
      </Type.Caption>
      {protocol && (
        <>
          <Type.Caption color={dividerColor}>|</Type.Caption>
          <Image src={parseProtocolImage(protocol)} width={16} height={16} />
        </>
      )}
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
    </Flex>
  )
}

export const renderOpenTime = (data: CopyPositionData) => (
  <Type.Caption color="neutral3">
    <LocalTimeText date={data.createdAt} />
  </Type.Caption>
)

export const renderCloseTime = (data: CopyPositionData) => (
  <Type.Caption color="neutral3">
    {data.status === PositionStatusEnum.CLOSE ? <LocalTimeText date={data.lastOrderAt} /> : '--'}
  </Type.Caption>
)

export const renderValue = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    {data.status === PositionStatusEnum.OPEN
      ? formatNumber(Number(data.sizeDelta), 4, 4)
      : !isNaN(Number(data.totalSizeDelta))
      ? formatNumber(Number(data.totalSizeDelta), 4, 4)
      : '--'}{' '}
    {TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken].symbol}
  </Type.Caption>
)
export const renderSize = (data: CopyPositionData) => (
  <Type.Caption color="neutral1">
    $
    {data.status === PositionStatusEnum.OPEN
      ? formatNumber(Number(data.sizeDelta) * data.entryPrice, 0)
      : !isNaN(Number(data.totalSizeDelta))
      ? formatNumber(Number(data.totalSizeDelta) * data.entryPrice, 0)
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
  <Flex width="100%" alignItems="center" justifyContent="right">
    <Tag width={70} status={data.status} />
  </Flex>
)

const VerticalDivider = styled(Box)`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`

export function renderSource(item: CopyPositionData, index?: number, externalSource?: any, isHistory?: boolean) {
  return externalSource?.submitting && externalSource?.currentId === item.id ? (
    <Loading size={12} margin="0 4px!important" />
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
        {addressShorten(item.sourceOrderTxHashes?.[0] ?? item.copyAccount, isHistory ? 4 : 3, isHistory ? 4 : 2)}
      </Type.Caption>
    </Button>
  )
}

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
