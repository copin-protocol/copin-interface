import { ReactNode } from 'react'
import * as yup from 'yup'

import { Flex, Image, Type } from 'theme/base'
import { CopyTradePlatformEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'
import { parseExchangeImage, parseProtocolImage } from 'utils/helpers/transform'

const commonSchema = {
  title: yup.string().required().label('Title'),
  volume: yup.number().when('exchange', {
    is: CopyTradePlatformEnum.SYNTHETIX,
    then: (schema) => schema.required().min(50).label('Margin'),
    otherwise: (schema) => schema.required().min(0).label('Margin'),
  }),
  leverage: yup.number().required().min(2).label('Leverage'),
  stopLossAmount: yup.number().when('enableStopLoss', {
    is: true,
    then: (schema) => schema.required().min(0.1).label('Stop Loss Amount'),
  }),
  volumeProtection: yup.boolean(),
  lookBackOrders: yup.number().when('volumeProtection', {
    is: true,
    then: (schema) => schema.required().min(1).label('Look Back Orders'),
  }),
  enableMaxVolMultiplier: yup.boolean(),
  maxVolMultiplier: yup.number().when('enableMaxVolMultiplier', {
    is: true,
    then: (schema) => schema.required().min(0.1).label('Max Volume Multiplier'),
  }),
  skipLowLeverage: yup.boolean(),
  agreement: yup.boolean().isTrue(),
  copyAll: yup.boolean(),
  tokenAddresses: yup
    .array(yup.string())
    .when('copyAll', {
      is: false,
      then: (schema) => schema.required().min(1),
    })
    .label('Trading Pairs'),
}

export const copyTradeFormSchema = yup.object({
  ...commonSchema,
  serviceKey: yup.string().required().label('Service Key'),
  exchange: yup
    .mixed()
    .oneOf([CopyTradePlatformEnum.GMX, CopyTradePlatformEnum.BINGX, CopyTradePlatformEnum.SYNTHETIX])
    .label('Exchange'),
  copyWalletId: yup.string().required().label('Wallet'),
})

export const updateCopyTradeFormSchema = yup.object({
  ...commonSchema,
  account: yup.string().required().label('Account'),
})

export const cloneCopyTradeFormSchema = yup.object({
  ...commonSchema,
  account: yup.string().required().label('Account'),
  duplicateToAddress: yup.string().required().label('Clone To Address'),
})

export interface CopyTradeFormValues {
  account?: string
  volume: number
  leverage: number
  tokenAddresses: string[]
  type?: CopyTradeTypeEnum
  protocol?: ProtocolEnum
  stopLossAmount: number | undefined
  volumeProtection: boolean
  lookBackOrders: number
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  serviceKey: string
  title: string
  reverseCopy: boolean
  duplicateToAddress?: string
  maxMarginPerPosition: number | null
  skipLowLeverage: boolean
  agreement: boolean
  copyAll: boolean
}
export const fieldName: { [key in keyof CopyTradeFormValues]: keyof CopyTradeFormValues } = {
  protocol: 'protocol',
  account: 'account',
  volume: 'volume',
  leverage: 'leverage',
  tokenAddresses: 'tokenAddresses',
  stopLossAmount: 'stopLossAmount',
  volumeProtection: 'volumeProtection',
  lookBackOrders: 'lookBackOrders',
  exchange: 'exchange',
  copyWalletId: 'copyWalletId',
  serviceKey: 'serviceKey',
  title: 'title',
  reverseCopy: 'reverseCopy',
  duplicateToAddress: 'duplicateToAddress',
  maxMarginPerPosition: 'maxMarginPerPosition',
  skipLowLeverage: 'skipLowLeverage',
  agreement: 'agreement',
  copyAll: 'copyAll',
}

export const defaultCopyTradeFormValues: CopyTradeFormValues = {
  protocol: ProtocolEnum.GMX,
  volume: 0,
  leverage: 2,
  tokenAddresses: [],
  type: CopyTradeTypeEnum.FULL_ORDER,
  stopLossAmount: undefined,
  volumeProtection: true,
  lookBackOrders: 10,
  exchange: CopyTradePlatformEnum.BINGX,
  copyWalletId: '',
  serviceKey: SERVICE_KEYS[ProtocolEnum.GMX],
  title: '',
  reverseCopy: false,
  duplicateToAddress: '',
  maxMarginPerPosition: null,
  skipLowLeverage: false,
  agreement: false,
  copyAll: false,
}

interface ExchangeOptions {
  value: CopyTradePlatformEnum
  label: ReactNode
  isDisabled?: boolean
}
export const exchangeOptions: ExchangeOptions[] = [
  getExchangeOption(CopyTradePlatformEnum.BINGX),
  // getExchangeOption(CopyTradePlatformEnum.SYNTHETIX),
]
function getExchangeOption(exchange: CopyTradePlatformEnum, enabled?: boolean) {
  let label = ''
  switch (exchange) {
    case CopyTradePlatformEnum.BINGX:
      label = 'BingX'
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
    isDisabled: enabled != null && !enabled,
  }
}

export const protocolOptions = Object.values(ProtocolEnum).map((value) => {
  return {
    value,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1, width: 90 }}>
        <Type.Body>{value}</Type.Body> <Image src={parseProtocolImage(value)} sx={{ width: 16, height: 16 }} />
      </Flex>
    ),
  }
})
