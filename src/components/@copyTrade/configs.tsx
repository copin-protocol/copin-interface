import { Lock } from '@phosphor-icons/react'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import {
  CopyTradePermission,
  CopyTradePermissionConfig,
  ProtocolPermission,
  ProtocolPermissionConfig,
} from 'entities/permission'
import { Flex, Image, Type } from 'theme/base'
import {
  CopyTradePlatformEnum,
  CopyTradeSideEnum,
  CopyTradeTypeEnum,
  ProtocolEnum,
  SLTPTypeEnum,
} from 'utils/config/enums'
import { DEFAULT_SERVICE_KEY, QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { getItemsAndRequiredPlan, parseExchangeImage } from 'utils/helpers/transform'

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
  type: 'type',
  side: 'side',
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
  volume: 10,
  leverage: 2,
  tokenAddresses: [],
  excludingTokenAddresses: [],
  type: CopyTradeTypeEnum.COPY_TRADER,
  side: CopyTradeSideEnum.BOTH,
  stopLossType: SLTPTypeEnum.PERCENT,
  stopLossAmount: undefined,
  takeProfitType: SLTPTypeEnum.PERCENT,
  takeProfitAmount: undefined,
  lookBackOrders: undefined,
  exchange: CopyTradePlatformEnum.HYPERLIQUID,
  copyWalletId: '',
  serviceKey: DEFAULT_SERVICE_KEY,
  title: '',
  reverseCopy: false,
  duplicateToAddress: '',
  maxMarginPerPosition: null,
  skipLowLeverage: false,
  lowLeverage: undefined,
  agreement: false,
  copyAll: true,
  hasExclude: false,
  skipLowCollateral: false,
  lowCollateral: undefined,
  skipLowSize: false,
  lowSize: undefined,
}
export const defaultBulkUpdateFormValues: CopyTradeFormValues = {
  ...defaultCopyTradeFormValues,
  volume: undefined,
  leverage: undefined,
}

export function getExchangeOption(
  exchange: CopyTradePlatformEnum,
  enabled?: boolean,
  permission?: {
    userPermission: CopyTradePermissionConfig | undefined
    pagePermission: CopyTradePermission | undefined
  }
) {
  let label = ''
  let refCode = ''
  switch (exchange) {
    case CopyTradePlatformEnum.BINGX:
      label = 'BingX'
      refCode = 'DY5QNN'
      break
    case CopyTradePlatformEnum.BITGET:
      label = 'Bitget'
      refCode = '1qlg'
      break
    case CopyTradePlatformEnum.BINANCE:
      label = 'Binance'
      refCode = '19902233'
      break
    case CopyTradePlatformEnum.BYBIT:
      label = 'Bybit'
      refCode = 'COPIN'
      break
    case CopyTradePlatformEnum.OKX:
      label = 'OKX'
      refCode = '75651458'
      break
    case CopyTradePlatformEnum.GATE:
      label = 'Gate'
      refCode = 'AgBFAApb'
      break
    case CopyTradePlatformEnum.HYPERLIQUID:
      label = 'Hyperliquid'
      refCode = 'COPIN'
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
      label = 'Synthetix v2'
      break
    case CopyTradePlatformEnum.GNS_V8:
      label = 'gTrade'
      break
    case CopyTradePlatformEnum.APEX:
      label = 'ApeX'
      break
    default:
      break
  }
  const shouldShowUpgrade =
    permission?.userPermission && !permission?.userPermission?.exchangeAllowed?.includes(exchange)
  return {
    value: exchange,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Image src={parseExchangeImage(exchange)} width={20} height={20} />
        <Type.Caption ml={1}>{label}</Type.Caption>
        {shouldShowUpgrade && <Lock size={12} />}
      </Flex>
    ),
    refCode,
    labelText: label,
    isDisabled: (enabled != null && !enabled) || shouldShowUpgrade,
  }
}

export const vaultExchangeOptions: ExchangeOptions[] = [getExchangeOption(CopyTradePlatformEnum.GNS_V8)]

export const dcpExchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.GNS_V8),
  // getExchangeOption(CopyTradePlatformEnum.SYNTHETIX_V2),
]

export const API_EXCHANGES = [
  CopyTradePlatformEnum.HYPERLIQUID,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.BINANCE,
]

export const exchangeOptions: ExchangeOptions[] = API_EXCHANGES.map((exchange) =>
  getExchangeOption(exchange)
) as ExchangeOptions[]
export const internalExchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.HYPERLIQUID),
  getExchangeOption(CopyTradePlatformEnum.BITGET),
  getExchangeOption(CopyTradePlatformEnum.GATE),
  getExchangeOption(CopyTradePlatformEnum.BINGX),
  getExchangeOption(CopyTradePlatformEnum.OKX),
  getExchangeOption(CopyTradePlatformEnum.BYBIT),
  getExchangeOption(CopyTradePlatformEnum.BINANCE),
  getExchangeOption(CopyTradePlatformEnum.APEX),
]

export const getExchangeOptions = (permission: {
  userPermission?: CopyTradePermissionConfig | undefined
  pagePermission?: CopyTradePermission | undefined
}) => {
  const exchangesByPlan = getItemsAndRequiredPlan('exchangeAllowed', permission?.pagePermission)
  return Object.keys(exchangesByPlan).map((value) =>
    getExchangeOption(value as CopyTradePlatformEnum, undefined, {
      userPermission: permission?.userPermission,
      pagePermission: permission?.pagePermission,
    })
  )
}

export const getProtocolOptions = (permission?: {
  userPermission: ProtocolPermissionConfig | undefined
  pagePermission: ProtocolPermission | undefined
}) => {
  const protocolsByPlan = getItemsAndRequiredPlan('protocolAllowed', permission?.pagePermission)

  return (Object.keys(protocolsByPlan) as ProtocolEnum[]).map((value) => {
    const shouldShowUpgrade =
      permission?.userPermission && !permission?.userPermission?.protocolAllowed?.includes(value)
    return {
      value: value.toString(),
      label: (
        <Flex sx={{ alignItems: 'center', gap: 1 }}>
          <ProtocolLogo protocol={value} isActive={false} size={20} hasText={false} />
          <Type.Caption ml={1}>{PROTOCOL_OPTIONS_MAPPING[value].text}</Type.Caption>
          {shouldShowUpgrade && <Lock size={12} />}
        </Flex>
      ),
      isDisabled: shouldShowUpgrade,
    }
  })
}

export const protocolOptions = getProtocolOptions()

export const postUpdateRefreshQueries = [
  QUERY_KEYS.GET_TRADER_VOLUME_COPY,
  QUERY_KEYS.GET_COPY_TRADE_SETTINGS,
  QUERY_KEYS.GET_EMBEDDED_COPY_TRADES,
  QUERY_KEYS.USE_GET_ALL_COPY_TRADES,
  QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW,
]
