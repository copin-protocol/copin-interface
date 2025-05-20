import { CopyPositionData } from 'entities/copyTrade'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { SYMBOL_BY_PROTOCOL_MAPPING } from 'utils/helpers/price'
import { getSymbolFromPair, normalizeExchangePrice } from 'utils/helpers/transform'

export default function useMarkPrice({ copyPosition }: { copyPosition: CopyPositionData | undefined }) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbolByIndexToken = getSymbolByIndexToken?.({
    protocol: copyPosition?.protocol,
    indexToken: copyPosition?.indexToken,
  })
  const symbol = copyPosition?.pair ? getSymbolFromPair(copyPosition.pair) : symbolByIndexToken
  const { getPricesData } = useGetUsdPrices()

  const prices = getPricesData({ protocol: copyPosition?.protocol, exchange: copyPosition?.exchange })
  const symbolByProtocol = SYMBOL_BY_PROTOCOL_MAPPING[`${copyPosition?.protocol}-${symbol}`]
  const priceSymbol =
    copyPosition?.protocol &&
    [ProtocolEnum.GNS, ProtocolEnum.GNS_APE, ProtocolEnum.GNS_BASE, ProtocolEnum.GNS_POLY].includes(
      copyPosition.protocol
    ) &&
    copyPosition?.exchange === CopyTradePlatformEnum.HYPERLIQUID &&
    symbolByProtocol
      ? symbolByProtocol
      : symbol ?? ''
  const markPrice = symbol
    ? normalizeExchangePrice({
        protocolSymbol: priceSymbol,
        protocolSymbolPrice: prices[priceSymbol],
        exchange: copyPosition?.exchange,
      })
    : 0
  return { markPrice, symbol }
}
