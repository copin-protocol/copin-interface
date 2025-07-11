import { FilterValues } from 'components/@widgets/ConditionFilterForm/types'
import {
  DIRECTIONAL_BIAS_LABEL_KEY,
  DURATION_LABEL_KEY,
  PERFORMANCE_LABEL_KEY,
  PNL_TIER_KEY,
  RISK_LABEL_KEY,
  VOLUME_TIER_KEY,
} from 'utils/config/enums'

export function formatRankingRanges(ranges: FilterValues[]) {
  return ranges.map((values) => {
    const newValues = { ...values }
    newValues.fieldName = `ranking.${values.fieldName}`
    return newValues
  })
}

export function formatIFLabelsRanges(values: any[]) {
  if (values?.length === 0) {
    return [
      {
        fieldName: 'ifLabels',
        nin: [],
      },
      {
        fieldName: 'ifLabels',
        exists: true,
      },
    ]
  }

  return [{ fieldName: 'ifLabels', in: values }]
}

export function formatIFLabelsRangesWithAnd(values: any[]) {
  if (values?.length === 0) {
    return [
      {
        and: [
          { fieldName: 'ifLabels', nin: [] },
          { fieldName: 'ifLabels', exists: true },
        ],
      },
    ]
  }

  return [{ fieldName: 'ifLabels', in: values }]
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
