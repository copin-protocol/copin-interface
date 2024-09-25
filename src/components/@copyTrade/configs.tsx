import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { Flex, Type } from 'theme/base'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeTypeEnum, ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'

import { getExchangeOption } from './helpers'
import { CopyTradeFormValues, ExchangeOptions } from './types'

export const fieldName: { [key in keyof CopyTradeFormValues]: keyof CopyTradeFormValues } = {
  multipleCopy: 'multipleCopy',
  protocol: 'protocol',
  account: 'account',
  accounts: 'accounts',
  volume: 'volume',
  leverage: 'leverage',
  tokenAddresses: 'tokenAddresses',
  excludingTokenAddresses: 'excludingTokenAddresses',
  stopLossType: 'stopLossType',
  stopLossAmount: 'stopLossAmount',
  takeProfitType: 'takeProfitType',
  takeProfitAmount: 'takeProfitAmount',
  lookBackOrders: 'lookBackOrders',
  exchange: 'exchange',
  copyWalletId: 'copyWalletId',
  serviceKey: 'serviceKey',
  title: 'title',
  reverseCopy: 'reverseCopy',
  duplicateToAddress: 'duplicateToAddress',
  maxMarginPerPosition: 'maxMarginPerPosition',
  skipLowLeverage: 'skipLowLeverage',
  lowLeverage: 'lowLeverage',
  agreement: 'agreement',
  copyAll: 'copyAll',
  hasExclude: 'hasExclude',
  skipLowCollateral: 'skipLowCollateral',
  lowCollateral: 'lowCollateral',
  skipLowSize: 'skipLowSize',
  lowSize: 'lowSize',
}

export const defaultCopyTradeFormValues: CopyTradeFormValues = {
  multipleCopy: false,
  protocol: ProtocolEnum.GMX,
  volume: 0,
  leverage: 2,
  tokenAddresses: [],
  excludingTokenAddresses: [],
  type: CopyTradeTypeEnum.COPY_TRADER,
  stopLossType: SLTPTypeEnum.PERCENT,
  stopLossAmount: undefined,
  takeProfitType: SLTPTypeEnum.PERCENT,
  takeProfitAmount: undefined,
  lookBackOrders: undefined,
  exchange: CopyTradePlatformEnum.BINGX,
  copyWalletId: '',
  serviceKey: SERVICE_KEYS[ProtocolEnum.KWENTA],
  title: '',
  reverseCopy: false,
  duplicateToAddress: '',
  maxMarginPerPosition: null,
  skipLowLeverage: false,
  lowLeverage: undefined,
  agreement: false,
  copyAll: false,
  hasExclude: false,
  skipLowCollateral: false,
  lowCollateral: undefined,
  skipLowSize: false,
  lowSize: undefined,
}

export const dcpExchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.GNS_V8),
  getExchangeOption(CopyTradePlatformEnum.SYNTHETIX_V2),
]

export const exchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.BINGX),
  getExchangeOption(CopyTradePlatformEnum.BITGET),
  getExchangeOption(CopyTradePlatformEnum.BYBIT),
  getExchangeOption(CopyTradePlatformEnum.OKX),
  getExchangeOption(CopyTradePlatformEnum.GATE),
  // getExchangeOption(CopyTradePlatformEnum.SYNTHETIX),
]
export const internalExchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.BINGX),
  getExchangeOption(CopyTradePlatformEnum.BITGET),
  getExchangeOption(CopyTradePlatformEnum.BYBIT),
  getExchangeOption(CopyTradePlatformEnum.OKX),
  getExchangeOption(CopyTradePlatformEnum.GATE),
  getExchangeOption(CopyTradePlatformEnum.HYPERLIQUID),
  getExchangeOption(CopyTradePlatformEnum.BINANCE),
]
export const protocolOptions = RELEASED_PROTOCOLS.map((value) => {
  return {
    value,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Type.Body>{value}</Type.Body> <ProtocolLogo protocol={value} isActive={false} size={16} hasText={false} />
      </Flex>
    ),
  }
})
