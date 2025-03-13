import * as yup from 'yup'

import { MAX_PERPDEX_ISSUE_DESCRIPTION } from 'utils/config/constants'
import { CopyTradePlatformEnum, SLTPTypeEnum } from 'utils/config/enums'

export const advanceSettingSchema = {
  lookBackOrders: yup.number().min(1).integer().label('Orders To Lookback'),
  side: yup.string().label('Side'),
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

const commonSchema = {
  totalVolume: yup.number(),
  leverage: yup.number().required().min(2).label('Leverage'),
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
  agreement: yup.boolean().isTrue(),
  ...advanceSettingSchema,
}

export const copyTradeFormSchema = yup.object({
  ...commonSchema,
  // serviceKey: yup.string().required().label('Service Key'),
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
      CopyTradePlatformEnum.HYPERLIQUID,
      CopyTradePlatformEnum.GNS_V8,
      // CopyTradePlatformEnum.SYNTHETIX_V2,
      CopyTradePlatformEnum.APEX,
      // CopyTradePlatformEnum.SYNTHETIX_V3,
    ])
    .label('Exchange'),
  copyWalletId: yup.string().required().label('Wallet'),
})
export const bulkUpdateFormSchema = yup.object({
  ...advanceSettingSchema,
  volume: yup
    .number()
    .min(0)
    // @ts-ignore
    .when(['maxMarginPerPosition'], (maxMarginPerPosition, schema) => {
      if (!!maxMarginPerPosition) return schema.required('Margin is required when edit max margin per position')
      return schema
    })
    .label('Margin'),
  leverage: yup.number().min(2).max(50).label('Leverage'),
  stopLossAmount: yup.number().min(1).label('Stop Loss Amount'),
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
  // serviceKey: yup.string().required().label('Service Key'),
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
      CopyTradePlatformEnum.HYPERLIQUID,
      CopyTradePlatformEnum.GNS_V8,
      // CopyTradePlatformEnum.SYNTHETIX_V2,
      CopyTradePlatformEnum.APEX,
      // CopyTradePlatformEnum.SYNTHETIX_V3,
    ])
    .label('Exchange'),
})

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff', 'image/bmp']

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export const reportPerpdexSchema = yup.object().shape({
  perpdex: yup.string().required('PerpDEX is required'),
  description: yup
    .string()
    .required('Description is required')
    .max(MAX_PERPDEX_ISSUE_DESCRIPTION, 'Description is too long (max 800 characters)'),
  telegramAccount: yup.string().optional(),
  protocol: yup.string().optional(),
  images: yup
    .mixed<FileList>()
    .nullable()
    .transform((value) => (!value || value.length === 0 ? null : value))
    .test('fileCount', 'Only one image is allowed', (value) => {
      if (!value) return true
      return value.length === 1
    })
    .test('fileType', 'Unsupported format. Use JPEG, PNG, WEBP, GIF, TIFF, or BMP', (value) => {
      if (!value || !value[0]) return true
      return SUPPORTED_FORMATS.includes(value[0].type)
    })
    .test('fileSize', 'File size is too large (max 10MB)', (value) => {
      if (!value || !value[0]) return true
      return value[0].size <= MAX_FILE_SIZE
    }),
})
