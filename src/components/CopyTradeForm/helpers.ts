import { CopyTradeData } from 'entities/copyTrade'

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
    protocol,
    exchange,
    copyWalletId,
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
    result.stopLossAmount = stopLossAmount
  }
  if (typeof maxVolMultiplier === 'number' && maxVolMultiplier > 0) {
    result.maxMarginPerPosition = maxVolMultiplier * volume
  }
  result.skipLowLeverage = !!skipLowLeverage
  result.exchange = exchange
  result.copyWalletId = copyWalletId
  return result
}

export function getRequestDataFromForm(formData: CopyTradeFormValues) {
  return {
    title: formData.title,
    volume: formData.volume,
    tokenAddresses: formData.tokenAddresses,
    leverage: formData.leverage,
    reverseCopy: formData.reverseCopy,
    enableStopLoss: formData.stopLossAmount && formData.stopLossAmount > 0 ? true : false,
    stopLossAmount: formData.stopLossAmount,
    volumeProtection: formData.volumeProtection,
    lookBackOrders: formData.volumeProtection ? formData.lookBackOrders : undefined,
    maxVolMultiplier: formData.maxMarginPerPosition
      ? Number(formData.maxMarginPerPosition / formData.volume)
      : undefined,
    skipLowLeverage: formData.skipLowLeverage,
    protocol: formData.protocol,
    exchange: formData.exchange,
    copyWalletId: formData.copyWalletId,
  }
}
