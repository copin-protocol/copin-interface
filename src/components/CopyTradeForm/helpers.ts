import { CopyTradeData } from 'entities/copyTrade'

import { CopyTradeFormValues } from './configs'

export function getFormValuesFromResponseData(copyTradeData: CopyTradeData | undefined) {
  const result = {} as CopyTradeFormValues
  if (!copyTradeData) return result
  const {
    accounts,
    account,
    title,
    volume,
    tokenAddresses,
    excludingTokenAddresses,
    leverage,
    reverseCopy,
    volumeProtection,
    lookBackOrders,
    enableStopLoss,
    stopLossType,
    stopLossAmount,
    maxVolMultiplier,
    skipLowLeverage,
    lowLeverage,
    protocol,
    exchange,
    copyWalletId,
    copyAll,
    enableTakeProfit,
    takeProfitType,
    takeProfitAmount,
    skipLowCollateral,
    lowCollateral,
    skipLowSize,
    lowSize,
  } = copyTradeData
  if (accounts && accounts.length > 0) {
    result.multipleCopy = true
    result.accounts = accounts
  }
  if (account) {
    result.multipleCopy = false
    result.account = account
  }
  if (title) result.title = title
  if (typeof volume === 'number') result.volume = volume
  if (tokenAddresses.length) result.tokenAddresses = tokenAddresses
  if (typeof leverage === 'number') result.leverage = leverage
  if (reverseCopy) result.reverseCopy = true
  if (volumeProtection) {
    result.lookBackOrders = lookBackOrders
  }
  if (protocol) result.protocol = protocol
  if (enableStopLoss) {
    result.stopLossType = stopLossType
    result.stopLossAmount = stopLossAmount
  }
  if (enableTakeProfit) {
    result.takeProfitType = takeProfitType
    result.takeProfitAmount = takeProfitAmount
  }
  if (typeof maxVolMultiplier === 'number' && maxVolMultiplier > 0) {
    result.maxMarginPerPosition = maxVolMultiplier * volume
  } else {
    result.maxMarginPerPosition = null
  }
  if (!!skipLowLeverage) {
    result.skipLowLeverage = skipLowLeverage
    result.lowLeverage = lowLeverage
  }
  if (!!skipLowCollateral) {
    result.skipLowCollateral = skipLowCollateral
    result.lowCollateral = lowCollateral
  }
  if (!!skipLowSize) {
    result.skipLowSize = skipLowSize
    result.lowSize = lowSize
  }
  result.exchange = exchange
  result.copyWalletId = copyWalletId
  result.copyAll = !!copyAll
  if (!!excludingTokenAddresses?.length) {
    result.excludingTokenAddresses = excludingTokenAddresses
    result.hasExclude = true
  } else {
    result.excludingTokenAddresses = []
    result.hasExclude = false
  }
  return result
}

export function getRequestDataFromForm(formData: CopyTradeFormValues, isClone?: boolean) {
  return {
    title: formData.title,
    volume: formData.volume,
    tokenAddresses: formData.copyAll ? [] : formData.tokenAddresses,
    excludingTokenAddresses: formData.copyAll && formData.hasExclude ? formData.excludingTokenAddresses : [],
    leverage: formData.leverage,
    reverseCopy: formData.reverseCopy,
    enableStopLoss: !!formData?.stopLossAmount,
    stopLossType: formData.stopLossType,
    stopLossAmount: formData.stopLossAmount,
    volumeProtection: !!formData.lookBackOrders,
    lookBackOrders: formData.lookBackOrders ? formData.lookBackOrders : null,
    enableTakeProfit: !!formData?.takeProfitAmount,
    takeProfitType: formData.takeProfitType,
    takeProfitAmount: formData.takeProfitAmount,
    maxVolMultiplier:
      formData.maxMarginPerPosition && formData.maxMarginPerPosition > 0
        ? Number(formData.maxMarginPerPosition / formData.volume)
        : null,
    skipLowLeverage: formData.skipLowLeverage,
    lowLeverage: formData.lowLeverage,
    skipLowCollateral: formData.skipLowCollateral,
    lowCollateral: formData.lowCollateral,
    skipLowSize: formData.skipLowSize,
    lowSize: formData.lowSize,
    protocol: formData.protocol,
    exchange: formData.exchange,
    copyWalletId: formData.copyWalletId,
    copyAll: formData.copyAll,
    hasExclude: formData.hasExclude,
    ...(formData.accounts && formData.accounts.length > 0
      ? { multipleCopy: true, accounts: formData.accounts?.filter((_v) => !!_v) }
      : { multipleCopy: false, account: isClone ? formData.duplicateToAddress : formData.account }),
  }
}
