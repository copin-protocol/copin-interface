import { FilterValues } from 'components/@widgets/ConditionFilterForm/types'
import {
  DIRECTIONAL_BIAS_LABEL_KEY,
  DURATION_LABEL_KEY,
  PERFORMANCE_LABEL_KEY,
  PNL_TIER_KEY,
  RISK_LABEL_KEY,
  VOLUME_TIER_KEY,
} from 'utils/config/enums'

import { IFFilterParams } from '../ConditionFilter/types'

export function formatRankingRanges(ranges: FilterValues[]) {
  return ranges.map((values) => {
    const newValues = { ...values }
    newValues.fieldName = `ranking.${values.fieldName}`
    return newValues
  })
}

export function formatIFRanges({ ifLabels, ifGoodMarkets, ifBadMarkets }: IFFilterParams) {
  const conditions: FilterValues[] = []
  const marketConditions: { field: string; in?: string[] }[] = []
  if (!ifLabels || ifLabels?.length === 0) {
    conditions.push(
      {
        fieldName: 'ifLabels',
        nin: [],
      },
      {
        fieldName: 'ifLabels',
        exists: true,
      }
    )
  } else {
    conditions.push({
      fieldName: 'ifLabels',
      in: ifLabels,
    })
  }
  if (ifGoodMarkets?.length) {
    marketConditions.push({
      field: 'ifGoodMarkets',
      in: ifGoodMarkets,
    })
  }
  if (ifBadMarkets?.length) {
    marketConditions.push({
      field: 'ifBadMarkets',
      in: ifBadMarkets,
    })
  }
  return marketConditions.length === 1
    ? [...conditions, ...marketConditions]
    : [...conditions, { or: marketConditions }]
}

export function formatIFRangesWithAnd({ ifLabels, ifGoodMarkets, ifBadMarkets }: IFFilterParams) {
  const conditions: FilterValues[] = []
  const marketConditions: FilterValues[] = []
  if (ifLabels?.length === 0) {
    conditions.push({
      and: [
        { fieldName: 'ifLabels', nin: [] },
        { fieldName: 'ifLabels', exists: true },
      ],
    })
  } else {
    conditions.push({
      fieldName: 'ifLabels',
      in: ifLabels,
    })
  }
  if (ifGoodMarkets?.length) {
    marketConditions.push({
      fieldName: 'ifGoodMarkets',
      in: ifGoodMarkets,
    })
  }
  if (ifBadMarkets?.length) {
    marketConditions.push({
      fieldName: 'ifBadMarkets',
      in: ifBadMarkets,
    })
  }
  return marketConditions.length === 1
    ? [...conditions, ...marketConditions]
    : [...conditions, { or: marketConditions }]
}

export function formatLabelsRanges(values: any[], pnlWithFeeEnabled?: boolean) {
  if (values?.length === 0) return []
  const conditions: { field: string; in: string[] }[] = []

  const statisticLabels = [
    VOLUME_TIER_KEY,
    PNL_TIER_KEY,
    DURATION_LABEL_KEY,
    RISK_LABEL_KEY,
    DIRECTIONAL_BIAS_LABEL_KEY,
  ]

  statisticLabels.forEach((labels) => {
    const condition: { field: string; in: string[] } = {
      field: pnlWithFeeEnabled ? 'statisticLabels' : 'realisedStatisticLabels',
      in: [],
    }
    Object.keys(labels).forEach((label) => {
      if (values.includes(label)) {
        condition.in.push(label)
      }
    })
    if (condition.in.length > 0) {
      conditions.push(condition)
    }
  })

  const performanceCondition: { field: string; in: string[] } = {
    field: pnlWithFeeEnabled ? 'aggregatedLabels' : 'realisedAggregatedLabels',
    in: [],
  }

  Object.keys(PERFORMANCE_LABEL_KEY).forEach((label) => {
    if (values.includes(label)) {
      performanceCondition.in.push(label)
    }
  })

  if (performanceCondition.in.length > 0) {
    conditions.push(performanceCondition)
  }

  if (conditions.length > 0) {
    return [{ and: conditions }]
  }
  return []
}
