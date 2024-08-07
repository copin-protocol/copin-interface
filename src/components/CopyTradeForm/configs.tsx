import { ReactNode } from 'react'
import * as yup from 'yup'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { ALLOWED_PROTOCOLS } from 'pages/Home/configs'
import { Flex, Image, Type } from 'theme/base'
import { CopyTradePlatformEnum, CopyTradeTypeEnum, ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { parseExchangeImage } from 'utils/helpers/transform'

const commonSchema = {
  totalVolume: yup.number(),
  multipleCopy: yup.boolean(),
  accounts: yup
    .array(yup.string())
    .when('multipleCopy', {
      is: true,
      then: (schema) => schema.required(),
    })
    .label('Accounts'),
  account: yup
    .string()
    .when('multipleCopy', {
      is: false,
      then: (schema) => schema.required(),
    })
    .label('Account'),
  title: yup.string().required().label('Title'),
  volume: yup.number().when('exchange', {
    is: CopyTradePlatformEnum.SYNTHETIX,
    then: (schema) => schema.required().min(50).label('Margin'),
    otherwise: (schema) => schema.required().min(0).label('Margin'),
  }),
  leverage: yup.number().required().min(2).label('Leverage'),
  lookBackOrders: yup.number().min(1).integer().label('Orders To Lookback'),
  stopLossType: yup.string().label('Stop Loss Type'),
  stopLossAmount: yup
    .number()
    .positive()
    // @ts-ignore
    .when(['stopLossType', 'volume'], (stopLossType, volume, schema) => {
      if (stopLossType === SLTPTypeEnum.PERCENT) return schema.max(100)
      return schema.max(volume)
    })
    .label('Stop Loss Amount'),
  takeProfitType: yup.string().label('Take Profit Type'),
  takeProfitAmount: yup.number().positive().label('Take Profit Amount'),
  maxMarginPerPosition: yup.number().nullable().positive().label('Max Margin Per Position'),
  skipLowLeverage: yup.boolean(),
  lowLeverage: yup
    .number()
    .positive()
    .when('skipLowLeverage', {
      is: true,
      then: (schema) => schema.required().min(1).max(150),
    })
    .label('Low Leverage'),
  skipLowCollateral: yup.boolean(),
  lowCollateral: yup
    .number()
    .positive()
    .when('skipLowCollateral', {
      is: true,
      then: (schema) => schema.required().min(1),
    })
    .label('Low Collateral'),
  skipLowSize: yup.boolean(),
  lowSize: yup
    .number()
    .positive()
    .when('skipLowSize', {
      is: true,
      then: (schema) => schema.required().min(1),
    })
    .label('Low Size'),
  agreement: yup.boolean().isTrue(),
  copyAll: yup.boolean(),
  tokenAddresses: yup
    .array(yup.string())
    .when('copyAll', {
      is: false,
      then: (schema) => schema.required().min(1),
    })
    .label('Trading Pairs'),
  hasExclude: yup.boolean(),
  excludingTokenAddresses: yup
    .array(yup.string())
    .when('hasExclude', {
      is: true,
      then: (schema) => schema.required().min(1),
    })
    .label('Excluding Trading Pairs'),
}

export const copyTradeFormSchema = yup.object({
  ...commonSchema,
  serviceKey: yup.string().required().label('Service Key'),
  exchange: yup
    .mixed()
    .oneOf([
      CopyTradePlatformEnum.GMX,
      CopyTradePlatformEnum.BINGX,
      CopyTradePlatformEnum.BITGET,
      CopyTradePlatformEnum.BINANCE,
      CopyTradePlatformEnum.BYBIT,
      CopyTradePlatformEnum.OKX,
      CopyTradePlatformEnum.GATE,
      CopyTradePlatformEnum.SYNTHETIX,
    ])
    .label('Exchange'),
  copyWalletId: yup.string().required().label('Wallet'),
})

export const updateCopyTradeFormSchema = yup.object({
  ...commonSchema,
  // account: yup.string().required().label('Account'),
})

export const cloneCopyTradeFormSchema = yup.object({
  ...commonSchema,
  // account: yup.string().required().label('Account'),
  duplicateToAddress: yup
    .string()
    .when('multipleCopy', {
      is: false,
      then: (schema) => schema.required(),
    })
    .label('Clone to address'),
})

export interface CopyTradeFormValues {
  totalVolume?: number
  multipleCopy: boolean
  account?: string
  accounts?: string[]
  volume: number
  leverage: number
  tokenAddresses: string[]
  excludingTokenAddresses: string[]
  type?: CopyTradeTypeEnum
  protocol?: ProtocolEnum
  stopLossType: SLTPTypeEnum
  stopLossAmount: number | undefined
  takeProfitType: SLTPTypeEnum
  takeProfitAmount: number | undefined
  lookBackOrders: number | null
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  serviceKey: string
  title: string
  reverseCopy: boolean
  duplicateToAddress?: string
  maxMarginPerPosition: number | null
  skipLowLeverage: boolean
  lowLeverage: number | undefined
  skipLowCollateral: boolean
  lowCollateral: number | undefined
  skipLowSize: boolean
  lowSize: number | undefined
  agreement: boolean
  copyAll: boolean
  hasExclude: boolean
}
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
  stopLossType: SLTPTypeEnum.USD,
  stopLossAmount: undefined,
  takeProfitType: SLTPTypeEnum.USD,
  takeProfitAmount: undefined,
  lookBackOrders: 10,
  exchange: CopyTradePlatformEnum.BINGX,
  copyWalletId: '',
  serviceKey: SERVICE_KEYS[ProtocolEnum.GMX],
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

export interface ExchangeOptions {
  value: CopyTradePlatformEnum
  label: ReactNode
  isDisabled?: boolean
}
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
  getExchangeOption(CopyTradePlatformEnum.BINANCE),
  getExchangeOption(CopyTradePlatformEnum.BYBIT),
  getExchangeOption(CopyTradePlatformEnum.OKX),
  getExchangeOption(CopyTradePlatformEnum.GATE),
  // getExchangeOption(CopyTradePlatformEnum.SYNTHETIX),
]
export function getExchangeOption(exchange: CopyTradePlatformEnum, enabled?: boolean) {
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
    case CopyTradePlatformEnum.SYNTHETIX:
      label = 'Synthetix'
      break
    default:
      break
  }
  return {
    value: exchange,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Image src={parseExchangeImage(exchange)} width={24} height={24} />
        <Type.Caption>{label}</Type.Caption>
      </Flex>
    ),
    refCode,
    labelText: label,
    isDisabled: enabled != null && !enabled,
  }
}

export const protocolOptions = ALLOWED_PROTOCOLS.map((value) => {
  return {
    value,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Type.Body>{PROTOCOL_OPTIONS_MAPPING[value].text}</Type.Body>{' '}
        <ProtocolLogo protocol={value} isActive={false} size={16} hasText={false} />
      </Flex>
    ),
  }
})

export const RISK_LEVERAGE = 20
