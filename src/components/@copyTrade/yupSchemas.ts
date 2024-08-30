import * as yup from 'yup'

import { CopyTradePlatformEnum, SLTPTypeEnum } from 'utils/config/enums'

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
    is: (val: CopyTradePlatformEnum) =>
      val == CopyTradePlatformEnum.SYNTHETIX_V2 || val == CopyTradePlatformEnum.GNS_V8,
    then: (schema) => schema.required().min(60).label('Margin'),
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
      CopyTradePlatformEnum.SYNTHETIX_V2,
      CopyTradePlatformEnum.GNS_V8,
      // CopyTradePlatformEnum.SYNTHETIX_V3,
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
      CopyTradePlatformEnum.SYNTHETIX_V2,
      CopyTradePlatformEnum.GNS_V8,
      // CopyTradePlatformEnum.SYNTHETIX_V3,
    ])
    .label('Exchange'),
})
