import { CopyPositionData } from 'entities/copyTrade'
import { AssetPosition, HlOrderData, HlOrderRawData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import { CopyTradePlatformEnum, MarginModeEnum, PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'

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
    } as CopyPositionData
    return position
  })
}

export function getHLCopyPositionIdentifyKey(position: CopyPositionData) {
  return `${position.pair}${position.isLong}`
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
        openId: e.oid,
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

export function convertPairHL(symbol: string) {
  let _pair = symbol
  if (_pair.startsWith('k')) {
    _pair = _pair.replace('k', '1000')
  }
  return _pair + '-USDT'
}
