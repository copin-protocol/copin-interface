import { CopyTradeData } from 'entities/copyTrade'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { addressShorten } from 'utils/helpers/format'

import { CopyTradeFormValues } from './configs'

export function getFormValuesFromResponseData(copyTradeData: CopyTradeData | undefined) {
  const result = {} as CopyTradeFormValues
  if (!copyTradeData) return result
  const {
    account,
    title,
    volume,
    tokenAddresses,
    leverage,
    reverseCopy,
    volumeProtection,
    lookBackOrders,
    enableStopLoss,
    stopLossAmount,
    maxVolMultiplier,
    skipLowLeverage,
    bingXApiKey,
    protocol,
  } = copyTradeData
  if (account) result.account = account
  if (title) result.title = title
  if (typeof volume === 'number') result.volume = volume
  if (tokenAddresses.length) result.tokenAddresses = tokenAddresses
  if (typeof leverage === 'number') result.leverage = leverage
  if (reverseCopy) result.reverseCopy = true
  if (volumeProtection) {
    result.volumeProtection = true
    result.lookBackOrders = lookBackOrders
  }
  if (protocol) result.protocol = protocol
  if (enableStopLoss) {
    result.enableStopLoss = true
    result.stopLossAmount = stopLossAmount
  }
  if (typeof maxVolMultiplier === 'number' && maxVolMultiplier > 0) {
    result.enableMaxVolMultiplier = true
    result.maxVolMultiplier = maxVolMultiplier
  } else {
    result.enableMaxVolMultiplier = false
  }
  result.skipLowLeverage = !!skipLowLeverage

  if (bingXApiKey) {
    result.exchange = CopyTradePlatformEnum.BINGX
    result.bingXApiKey = addressShorten(bingXApiKey)
  } else {
    result.exchange = CopyTradePlatformEnum.GMX
  }
  return result
}

export function getRequestDataFromForm(formData: CopyTradeFormValues) {
  return {
    title: formData.title,
    volume: formData.volume,
    tokenAddresses: formData.tokenAddresses,
    leverage: formData.leverage,
    reverseCopy: formData.reverseCopy,
    enableStopLoss: formData.enableStopLoss,
    stopLossAmount: formData.enableStopLoss ? formData.stopLossAmount : undefined,
    volumeProtection: formData.volumeProtection,
    lookBackOrders: formData.volumeProtection ? formData.lookBackOrders : undefined,
    maxVolMultiplier: formData.enableMaxVolMultiplier ? formData.maxVolMultiplier : 0,
    skipLowLeverage: formData.skipLowLeverage,
  }
}
