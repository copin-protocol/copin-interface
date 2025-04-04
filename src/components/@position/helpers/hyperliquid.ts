import { CopyPositionData } from 'entities/copyTrade'
import {
  AssetPosition,
  GroupedFillsData,
  HlOrderData,
  HlOrderFillData,
  HlOrderFillRawData,
  HlOrderRawData,
} from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import { CopyTradePlatformEnum, MarginModeEnum, PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/price'
import { getSymbolFromPair } from 'utils/helpers/transform'

export function parseHLPositionData({ account, data }: { account: string; data: AssetPosition[] }) {
  if (!data) return []
  return data.map((e) => {
    const sizeInToken = Number(e.position.szi)
    return {
      account,
      protocol: ProtocolEnum.HYPERLIQUID,
      isLong: sizeInToken >= 0,
      pair: convertPairHL(e.position.coin),
      marginMode: e.position.leverage.value > 0 ? MarginModeEnum.ISOLATED : MarginModeEnum.CROSS,
      leverage: e.position.leverage.value,
      collateral: Number(e.position.marginUsed),
      averagePrice: Number(e.position.entryPx),
      liquidationPrice: Number(e.position.liquidationPx),
      funding: Number(e.position.cumFunding.sinceOpen),
      sizeInToken: Math.abs(sizeInToken),
      size: Number(e.position.positionValue),
      pnl: Number(e.position.unrealizedPnl),
      roi: (Number(e.position.unrealizedPnl) / Number(e.position.positionValue)) * e.position.leverage.value * 100,
      status: PositionStatusEnum.OPEN,
    } as PositionData
  })
}
export function parseHLCopyPositionData({ data }: { data: AssetPosition[] | undefined }) {
  if (!data) return []
  return data.map((e) => {
    const hlPosition = getHLPositionData(e)
    const position = {
      protocol: hlPosition.protocol,
      isLong: hlPosition.isLong,
      entryPrice: hlPosition.averagePrice,
      pair: hlPosition.pair,
      leverage: hlPosition.leverage,
      sizeDelta: `${hlPosition.sizeInToken}`,
      totalSizeDelta: hlPosition.sizeInToken,
      status: PositionStatusEnum.OPEN,
      exchange: CopyTradePlatformEnum.HYPERLIQUID,
      openingPositionType: 'onlyLiveHyper',
      hlPosition: e,
    } as CopyPositionData
    return position
  })
}

export function getHLCopyPositionIdentifyKey(position: CopyPositionData) {
  const symbol = getSymbolFromPair(position.pair)
  const { originalSymbol } = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol]
  return `${originalSymbol}${position.isLong}`
}

function getHLPositionData(data: AssetPosition) {
  const position = data.position
  const _sizeInToken = Number(position.szi)
  const protocol = ProtocolEnum.HYPERLIQUID
  const isLong = _sizeInToken >= 0
  const pair = convertPairHL(position.coin)
  const marginMode = position.leverage.value > 0 ? MarginModeEnum.ISOLATED : MarginModeEnum.CROSS
  const leverage = position.leverage.value
  const collateral = Number(position.marginUsed)
  const averagePrice = Number(position.entryPx)
  const liquidationPrice = Number(position.liquidationPx)
  const funding = Number(position.cumFunding.sinceOpen)
  const sizeInToken = Math.abs(_sizeInToken)
  const size = Number(position.positionValue)
  const pnl = Number(position.unrealizedPnl)
  const roi = (Number(position.unrealizedPnl) / Number(position.positionValue)) * 100
  return {
    protocol,
    isLong,
    marginMode,
    pair,
    leverage,
    collateral,
    averagePrice,
    liquidationPrice,
    funding,
    sizeInToken,
    size,
    pnl,
    roi,
  }
}

export function parseHLOrderData({ account, data }: { account: string; data: HlOrderRawData[] }) {
  if (!data) return []
  return data
    .map((e) => {
      return {
        account,
        protocol: ProtocolEnum.HYPERLIQUID,
        orderId: e.oid,
        closeId: e.cloid,
        pair: convertPairHL(e.coin),
        originalSizeNumber: Number(e.origSz) * Number(e.limitPx),
        originalSizeInTokenNumber: Number(e.origSz),
        sizeNumber: Number(e.sz) * Number(e.limitPx),
        sizeInTokenNumber: Number(e.sz),
        priceNumber: Number(e.limitPx),
        triggerPriceNumber: Number(e.triggerPx),
        triggerCondition: e.triggerCondition,
        isTrigger: e.isTrigger,
        isPositionTpsl: e.isPositionTpsl,
        reduceOnly: e.reduceOnly,
        isLong: e.side === 'B' && e.reduceOnly ? false : e.side === 'A' && e.reduceOnly ? true : e.side === 'B',
        isBuy: e.side === 'B',
        orderType: e.orderType,
        type: e.orderType,
        timestamp: e.timestamp,
      } as HlOrderData
    })
    .filter((d) => !d.pair.startsWith('@'))
}

export function parseHLOrderFillData({ account, data }: { account: string; data: HlOrderFillRawData[] }) {
  if (!data) return []
  return data
    .map((e) => {
      return {
        id: e.tid,
        orderId: e.oid,
        txHash: e.hash,
        account,
        protocol: ProtocolEnum.HYPERLIQUID,
        pair: convertPairHL(e.coin),
        direction: e.dir,
        sizeNumber: Number(e.sz) * Number(e.px),
        sizeInTokenNumber: Number(e.sz),
        priceNumber: Number(e.px),
        pnl: Number(e.closedPnl),
        fee: Number(e.fee),
        builderFee: e.builderFee ? Number(e.builderFee) : undefined,
        feeToken: e.feeToken,
        isLong: e.side === 'B',
        isBuy: e.side === 'B',
        timestamp: e.time,
      } as HlOrderFillData
    })
    .filter((d) => !d.pair.startsWith('@'))
}

export function convertPairHL(symbol: string) {
  let _pair = symbol
  if (_pair.startsWith('k')) {
    _pair = _pair.replace('k', '1000')
  }
  return _pair + '-USDT'
}

export function groupHLOrderFillsByOid(fills: HlOrderFillData[]) {
  // First sort fills by timestamp to ensure chronological order
  const sortedFills = [...fills].sort((a, b) => a.timestamp - b.timestamp)

  // Group fills by orderId and track direction changes
  const groups: Array<GroupedFillsData> = []

  let currentGroup: (typeof groups)[0] | null = null

  sortedFills.forEach((fill) => {
    // Start a new group if:
    // 1. No current group exists
    // 2. Current fill has different orderId
    // 3. Direction changed since last group
    if (!currentGroup || currentGroup.fills[0].orderId !== fill.orderId || currentGroup.direction !== fill.direction) {
      currentGroup = {
        fills: [],
        totalSize: 0,
        totalSizeInToken: 0,
        avgPrice: 0,
        totalPnl: 0,
        totalFee: 0,
        totalBuilderFee: 0,
        timestamp: fill.timestamp,
        direction: fill.direction,
        pair: fill.pair,
        isLong: fill.isLong,
        feeToken: fill.feeToken,
        txHash: fill.txHash,
        orderId: fill.orderId,
      }
      groups.push(currentGroup)
    }

    currentGroup.fills.push(fill)
    currentGroup.totalSize += fill.sizeNumber
    currentGroup.totalSizeInToken += fill.sizeInTokenNumber
    currentGroup.totalPnl += fill.pnl
    currentGroup.totalFee += fill.fee
    currentGroup.totalBuilderFee += fill.builderFee ?? 0

    // Calculate weighted average price
    currentGroup.avgPrice =
      currentGroup.fills.reduce((sum, f) => sum + f.priceNumber * f.sizeInTokenNumber, 0) /
      currentGroup.totalSizeInToken

    // Update timestamp to the latest fill timestamp
    currentGroup.timestamp = Math.max(currentGroup.timestamp, fill.timestamp)
  })

  // Sort fills within each group by timestamp (most recent first)
  groups.forEach((group) => {
    group.fills.sort((a, b) => b.timestamp - a.timestamp)
  })

  // Sort groups by their latest fill timestamp
  return groups.sort((a, b) => b.timestamp - a.timestamp)
}
