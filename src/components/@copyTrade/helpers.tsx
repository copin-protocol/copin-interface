import { toast } from 'react-toastify'

import { parseInputValue } from 'components/@ui/TextWithEdit'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData, RequestCopyTradeData } from 'entities/copyTrade'
import { DCP_EXCHANGES } from 'utils/config/constants'
import { CopyTradeSideEnum, CopyTradeStatusEnum, SLTPTypeEnum } from 'utils/config/enums'
import { findObjectDifferences } from 'utils/helpers/findObjectDiff'

import { defaultBulkUpdateFormValues } from './configs'
import { CopyTradeFormValues, TradersByProtocolData } from './types'

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
    serviceKey,
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
    side,
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
  if (serviceKey) result.serviceKey = serviceKey
  if (enableStopLoss) {
    result.stopLossType = stopLossType
    result.stopLossAmount = stopLossAmount
  }
  if (enableTakeProfit) {
    result.takeProfitType = takeProfitType
    result.takeProfitAmount = takeProfitAmount
  }
  if (!result.takeProfitType) {
    result.takeProfitType = SLTPTypeEnum.PERCENT
  }
  if (!result.stopLossType) {
    result.stopLossType = SLTPTypeEnum.PERCENT
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
  result.side = side ?? CopyTradeSideEnum.BOTH
  return result
}

export function getRequestDataFromForm(formData: CopyTradeFormValues, isClone?: boolean) {
  const isDCP = DCP_EXCHANGES.includes(formData.exchange)
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
    volumeProtection: isDCP ? false : !!formData.lookBackOrders,
    lookBackOrders: !isDCP && formData.lookBackOrders ? formData.lookBackOrders : null,
    enableTakeProfit: !!formData?.takeProfitAmount,
    takeProfitType: formData.takeProfitType,
    takeProfitAmount: formData.takeProfitAmount,
    maxVolMultiplier:
      !isDCP && formData.maxMarginPerPosition && formData.maxMarginPerPosition > 0 && !!formData.volume
        ? Number(formData.maxMarginPerPosition / formData.volume)
        : null,
    skipLowLeverage: formData.skipLowLeverage,
    lowLeverage: formData.lowLeverage,
    skipLowCollateral: formData.skipLowCollateral,
    lowCollateral: formData.lowCollateral,
    skipLowSize: isDCP ? undefined : formData.skipLowSize,
    lowSize: isDCP ? undefined : formData.lowSize,
    protocol: formData.protocol,
    serviceKey: formData.serviceKey,
    exchange: formData.exchange,
    copyWalletId: formData.copyWalletId,
    copyAll: formData.copyAll,
    hasExclude: formData.hasExclude,
    ...(formData.multipleCopy && formData.accounts && formData.accounts.length > 0
      ? { multipleCopy: true, accounts: formData.accounts?.filter((_v) => !!_v) }
      : { multipleCopy: false, account: isClone ? formData.duplicateToAddress : formData.account }),
    side: formData.side,
  }
}
export function getRequestDataBulkUpdate(formData: CopyTradeFormValues) {
  const diff = findObjectDifferences(formData, defaultBulkUpdateFormValues)
  const result: RequestCopyTradeData = Object.entries(diff).reduce((result, [field, obj]) => {
    const newResult = { ...result, [field]: obj.obj1Value }
    if (field === 'stopLossAmount') {
      newResult['enableStopLoss'] = true
      if (!diff['stopLossType']) {
        newResult['stopLossType'] = defaultBulkUpdateFormValues.stopLossType
      }
    }
    if (field === 'takeProfitAmount') {
      newResult['enableTakeProfit'] = true
      if (!diff['takeProfitType']) {
        newResult['takeProfitType'] = defaultBulkUpdateFormValues.takeProfitType
      }
    }
    if (field === 'maxMarginPerPosition') {
      //@ts-ignore
      if (newResult['maxMarginPerPosition']) delete newResult['maxMarginPerPosition']
      const maxMarginPerPosition = obj.obj1Value as number
      const volume = diff['volume']?.obj1Value as unknown as number
      if (!!maxMarginPerPosition && !!volume) {
        newResult['maxVolMultiplier'] = Number(maxMarginPerPosition / volume)
      }
    }
    if (field === 'lookBackOrders') {
      const value = obj.obj1Value as number
      if (!!value) {
        newResult['volumeProtection'] = true
        newResult['lookBackOrders'] = value
      } else {
        if (newResult['lookBackOrders']) delete newResult['lookBackOrders']
      }
    }
    return newResult
  }, {} as RequestCopyTradeData)
  return result
}

export const isCopyTradeRunningFn = (status: CopyTradeStatusEnum) => status === CopyTradeStatusEnum.RUNNING

export const validateNumberValue = ({ value, field }: { value: string; field: keyof CopyTradeData }) => {
  if (typeof value !== 'string') return
  const numberValue = parseInputValue(value)
  switch (field) {
    case 'volume':
      return true
    case 'leverage':
      if (numberValue < 2) {
        toast.error(<ToastBody title="Error" message="Leverage must be greater than or equal to 2" />)
        return
      }
      if (numberValue > 50) {
        toast.error(<ToastBody title="Error" message="Leverage must be less than 50x" />)
        return
      }
      return true
  }
  return numberValue >= 0
}

export function getTradersByProtocolFromCopyTrade(
  copyTrades: CopyTradeData[] | undefined,
  allTraders: string[] | undefined
) {
  if (!copyTrades?.length || !allTraders?.length) return undefined
  const checkerMapping: Record<string, { [protocol: string]: boolean }> = {}
  const tradersByProtocol = copyTrades?.reduce((result, copyTrade) => {
    const accounts = [copyTrade.account, ...(copyTrade.accounts || [])]
    accounts.forEach((account) => {
      if (checkerMapping[account]?.[copyTrade.protocol] || !allTraders.includes(account)) return
      checkerMapping[account] = { [copyTrade.protocol]: true }
      result[copyTrade.protocol] = [
        ...(result[copyTrade.protocol] ?? []),
        { address: account, status: copyTrade.status === CopyTradeStatusEnum.RUNNING ? 'copying' : 'deleted' },
      ]
    })
    return result
  }, {} as TradersByProtocolData)
  return tradersByProtocol
}
