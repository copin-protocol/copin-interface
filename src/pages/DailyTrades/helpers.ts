import { LiveTradesPermission } from 'entities/permission'
import { OrderData, PositionData } from 'entities/trader'
import { ColumnData } from 'theme/Table/types'
import { PairFilterEnum } from 'utils/config/enums'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

export function getPairsParam({
  pairs,
  defaultAllPairs,
  excludedPairs,
}: {
  pairs: string[]
  defaultAllPairs: string[] | undefined
  excludedPairs: string[]
}) {
  let params: { pairs: string | null; excludedPairs: string | null } = { pairs: null, excludedPairs: null }
  const isCopyAll = pairs.length === defaultAllPairs?.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  if (hasExcludingPairs) {
    params = { pairs: PairFilterEnum.ALL, excludedPairs: excludedPairs.join('_') }
  } else if (!isCopyAll) {
    params = { pairs: pairs.join('_'), excludedPairs: null }
  } else {
    params = { pairs: null, excludedPairs: null }
  }
  return params
}

export function getOrderColumnRequiredPlan<T, K>({
  columnData,
  liveTradesPermission,
}: {
  columnData: ColumnData<T, K>
  liveTradesPermission: LiveTradesPermission | undefined
}) {
  return getRequiredPlan({
    conditionFn: (plan) =>
      !!liveTradesPermission?.[plan]?.orderFieldsAllowed?.includes(columnData.key as keyof OrderData),
  })
}

export function getPositionColumnRequiredPlan<T, K>({
  columnData,
  liveTradesPermission,
}: {
  columnData: ColumnData<T, K>
  liveTradesPermission: LiveTradesPermission | undefined
}) {
  return getRequiredPlan({
    conditionFn: (plan) =>
      !!liveTradesPermission?.[plan]?.positionFieldsAllowed?.includes(columnData.key as keyof PositionData),
  })
}

export const PERMISSION_TOOLTIP_ID_PREFIX = 'live_trade_required_plan_'
export function getPermissionTooltipId({ requiredPlan }: { requiredPlan: SubscriptionPlanEnum }) {
  return `${PERMISSION_TOOLTIP_ID_PREFIX}${requiredPlan}`
}

export const mapOrderData = ({
  sourceData,
  allowedFields,
}: {
  sourceData: OrderData
  allowedFields: (keyof OrderData)[] | undefined
}) => {
  if (allowedFields == null) return sourceData
  const orderNumberField: (keyof OrderData)[] = [
    'blockTime',
    'leverage',
    'collateralDeltaNumber',
    'sizeDeltaNumber',
    'priceNumber',
    'feeNumber',
  ]
  const pairs = ['ETH-USDT', 'BTC-USDT', 'SOL-USDT']
  const result: Partial<OrderData> = {
    ...sourceData,
  }
  if (!allowedFields.includes('pair')) {
    result.pair = pairs[Math.round(Math.random() * 3)]
  }
  if (!allowedFields.includes('account')) {
    result.account = '0x0000000000000000000000000000000000000000'
  }
  orderNumberField.forEach((field) => {
    if (allowedFields.includes(field)) return
    const source = result[field]
    if (source == null) {
      result[field] = Math.round(Math.random() * 10000) as any
    }
  })
  return result as OrderData
}

export const mapPositionData = ({
  sourceData,
  allowedFields,
}: {
  sourceData: PositionData
  allowedFields: (keyof PositionData)[] | undefined
}) => {
  if (allowedFields == null) return sourceData
  const pairs = ['ETH-USDT', 'BTC-USDT', 'SOL-USDT']
  const positionNumberField: (keyof PositionData)[] = [
    'openBlockTime',
    'closeBlockTime',
    'leverage',
    'averagePrice',
    'size',
    'leverage',
    'collateral',
    'durationInSecond',
    'orderCount',
    'fee',
    'roi',
    'pnl',
  ]
  const result: Partial<PositionData> = {
    ...sourceData,
  }
  if (!allowedFields.includes('pair')) {
    result.pair = pairs[Math.round(Math.random() * 3)]
  }
  if (!allowedFields.includes('account')) {
    result.account = '0x0000000000000000000000000000000000000000'
  }
  positionNumberField.forEach((field) => {
    if (allowedFields.includes(field)) return
    const source = result[field]
    if (source == null) {
      result[field] = Math.round(Math.random() * 10000) as any
    }
  })
  return result as PositionData
}
