import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import TraderCopyCountWarningIcon from 'components/TraderCopyCountWarningIcon'
import TraderCopyVolumeWarningIcon, { TraderTotalCopyVolumeIcon } from 'components/TraderCopyVolumeWarningIcon'
import { CopyPositionData, CopyTradeData } from 'entities/copyTrade.d'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Loading from 'theme/Loading'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, TextProps, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import {
  CopyTradeStatusEnum,
  PositionStatusEnum,
  ProtocolEnum,
  SLTPTypeEnum,
  SubscriptionPlanEnum,
} from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { getTokenTradeSupport } from 'utils/config/trades'
import { COPY_POSITION_CLOSE_TYPE_TRANS } from 'utils/config/translations'
import { calcCopyOpeningPnL } from 'utils/helpers/calculate'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten, compactNumber, formatNumber, formatPrice } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

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
      <Type.Caption>{getTokenTradeSupport(data.protocol)?.[data.indexToken]?.symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption>{formatPrice(data.entryPrice)}</Type.Caption>
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
    hasCopyAddress = false,
    hasAddressTooltip = false,
    hasCopyCountWarningIcon = false,
    hasCopyVolumeWarningIcon = false,
    hasCopyTradeVolumeIcon = false,
    copyVolume,
    maxCopyVolume,
    isRef,
    plan,
  }: {
    textSx?: TextProps
    isLink?: boolean
    size?: number
    dividerColor?: string
    hasCopyAddress?: boolean
    hasAddressTooltip?: boolean
    hasCopyCountWarningIcon?: boolean
    hasCopyVolumeWarningIcon?: boolean
    hasCopyTradeVolumeIcon?: boolean
    copyVolume?: number
    maxCopyVolume?: number
    isRef?: boolean
    plan?: SubscriptionPlanEnum
  } & SxProps = {}
) {
  const tooltipId = uuid()
  return (
    <Flex sx={{ alignItems: 'center', '& > *': { flexShrink: 0 }, gap: 1 }}>
      <Flex
        //@ts-ignore
        as={isLink && protocol ? Link : undefined}
        to={isLink && protocol ? generateTraderMultiExchangeRoute({ protocol, address }) : undefined}
        sx={{ gap: 1, flexShrink: 0, '& > *': { flexShrink: 0 }, ...sx }}
        alignItems="center"
        onClick={(e) => isLink && e.stopPropagation()}
      >
        <AddressAvatar address={address} size={size} />
        <Type.Caption
          minWidth="fit-content"
          className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
          color="inherit"
          {...{ [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address }}
          sx={{
            flexShrink: 0,
            color: 'neutral1',
            ':hover': { textDecoration: isLink ? 'underline' : undefined },
            minWidth: 74,
            ...textSx,
          }}
          {...(hasAddressTooltip ? { 'data-tooltip-id': tooltipId, 'data-tooltip-delay-show': 360 } : {})}
        >
          {addressShorten(address, 3, 5)}
        </Type.Caption>
        {hasCopyAddress && (
          <CopyButton
            type="button"
            variant="ghost"
            value={address}
            size="sm"
            sx={{ color: 'neutral3', p: 0 }}
            iconSize={14}
          ></CopyButton>
        )}
        {protocol && (
          <>
            <Type.Caption color={dividerColor}>|</Type.Caption>
            <ProtocolLogo protocol={protocol} hasText={false} size={20} />
          </>
        )}
      </Flex>
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
      {(hasCopyCountWarningIcon || hasCopyVolumeWarningIcon) && <Type.Caption color={dividerColor}>|</Type.Caption>}
      {hasCopyCountWarningIcon && <TraderCopyCountWarningIcon account={address} protocol={protocol} size={18} />}
      {hasCopyVolumeWarningIcon && (
        <TraderCopyVolumeWarningIcon account={address} protocol={protocol} size={18} copyVolume={copyVolume} />
      )}
      {hasCopyTradeVolumeIcon && copyVolume != null && maxCopyVolume && (
        <TraderTotalCopyVolumeIcon
          account={address}
          protocol={protocol}
          copyVolume={copyVolume}
          maxVolume={maxCopyVolume}
          isRef={isRef}
          plan={plan}
        />
      )}
    </Flex>
  )
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
    {getTokenTradeSupport(data.protocol)?.[data.indexToken]?.symbol}
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
  <Flex width="100%" alignItems="center" justifyContent="left">
    <Tag width={70} status={data.status} />
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
