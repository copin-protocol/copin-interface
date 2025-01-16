import { DataPoint, HourlyChartData, HourlyChartOptionType, TopPairChartData } from 'entities/chart'
import { PerpDexStatisticData } from 'entities/statistic'
import {
  ORDERS_CHART_GRADIENTS,
  TRADERS_CHART_GRADIENTS,
  VOLUME_CHART_GRADIENTS,
} from 'pages/PerpDEXsExplorer/PerpDexDetails/configs/constants'
import { themeColors } from 'theme/colors'
import { CHART_DATE_FORMAT, DATE_FORMAT } from 'utils/config/constants'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

export function getHourlyChartDataByMetric({
  data,
  metric,
}: {
  data: HourlyChartData | undefined
  metric: string
  // top?: number
}) {
  const chartData: DataPoint[] = []
  const weekdaysData: any = {}
  if (!data) return []
  // Aggregate data day in a week
  // Monday is 0 and Sunday is 6
  Object.entries(data).forEach(([date, hourlyStats]) => {
    const dayNumber = getWeekDayNumber(date).toString()
    if (!weekdaysData[dayNumber]) {
      weekdaysData[dayNumber] = { ...hourlyStats }
    } else {
      Object.entries(hourlyStats).forEach(([hour, value]) => {
        if (!weekdaysData[dayNumber][hour]) {
          weekdaysData[dayNumber][hour] = value
        } else {
          weekdaysData[dayNumber][hour].volume += (value as any).volume
          weekdaysData[dayNumber][hour].traders += (value as any).traders
          weekdaysData[dayNumber][hour].orders += (value as any).orders
        }
      })
    }
  })

  // Format data for chart
  Object.entries(weekdaysData).forEach(([day, hourlyStats]) => {
    Object.entries(hourlyStats as any).forEach(([hour, value]) => {
      chartData.push({
        day: Number(day),
        hour: Number(hour),
        value: (value as any)[metric],
      })
    })
  })

  return chartData
}

export function getWeekDayNumber(dateStr: string): number {
  // Create a Date object from the input string
  const date = new Date(dateStr)

  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const originalDayNumber = date.getDay()

  // Convert to our desired format (0 = Monday, ..., 6 = Sunday)
  return originalDayNumber === 0 ? 6 : originalDayNumber - 1
}

export function getFillColor(minRange: number, maxRange: number, gradients: any[], value: number) {
  const rangeStep = (maxRange - minRange) / gradients.length

  for (let i = 0; i < gradients.length; i++) {
    if (value >= maxRange - i * rangeStep) {
      return gradients[i].color
    }
  }
  return gradients[gradients.length - 1].color // return the last color if no match
}

export const getGradientColorsByOption = (optionId: HourlyChartOptionType) => {
  switch (optionId) {
    case 'traders':
      return TRADERS_CHART_GRADIENTS
    case 'volume':
      return VOLUME_CHART_GRADIENTS
    case 'orders':
      return ORDERS_CHART_GRADIENTS
    default:
      return TRADERS_CHART_GRADIENTS
  }
}

export function getChartData({ data }: { data: PerpDexStatisticData[] | undefined }) {
  if (!data) return []

  let volumeCumulative = 0
  let revenueCumulative = 0
  let liquidationCumulative = 0
  let traderPnlCumulative = 0
  let traderProfitCumulative = 0
  let traderLossCumulative = 0

  return data.map((stats) => {
    volumeCumulative += stats.volume
    revenueCumulative += stats.revenue
    liquidationCumulative += stats.liquidations
    traderPnlCumulative += stats.traderPnl
    traderProfitCumulative += stats.traderProfit
    traderLossCumulative += stats.traderLoss

    return {
      date: formatLocalDate(stats.statisticAt, CHART_DATE_FORMAT),
      dateTime: formatLocalDate(stats.statisticAt, DATE_FORMAT),
      perpdex: stats.perpdex,
      perpdexName: stats.perpdexName,
      volume: stats.volume,
      volumeCumulative,
      traders: stats.traders,
      traderCumulative: stats.totalTraders,
      revenue: stats.revenue,
      revenueCumulative,
      longLiquidations: stats.longLiquidations,
      shortLiquidations: stats.shortLiquidations,
      liquidations: stats.liquidations,
      liquidationCumulative,
      longPnl: stats.longPnl,
      shortPnl: stats.shortPnl,
      traderPnl: stats.traderPnl,
      traderPnlCumulative,
      traderProfit: stats.traderProfit,
      traderLoss: stats.traderLoss,
      traderProfitCumulative,
      traderLossCumulative,
    }
  })
}

// Format data by pair statistics
export function getPairChartDataByMetric({
  data,
  metric,
  sortType = 'asc',
  top,
}: {
  data: PerpDexStatisticData[] | undefined
  metric?: 'volume' | 'totalPnl' | 'totalOi' | 'totalProfit' | 'totalLoss' | 'longProfit' | 'totalProfitLoss'
  sortType?: 'asc' | 'desc'
  top?: number
}) {
  if (!data) return []

  const pairAggregates: Record<string, TopPairChartData> = data.reduce((acc, entry) => {
    Object.entries(entry.pairStatistics).forEach(([pair, stats]) => {
      if (!acc[pair]) {
        acc[pair] = {
          pair,
          volume: 0,
          longPnl: 0,
          shortPnl: 0,
          totalPnl: 0,
          longOi: 0,
          shortOi: 0,
          totalOi: 0,
          longProfit: 0,
          shortProfit: 0,
          totalProfit: 0,
          longLoss: 0,
          shortLoss: 0,
          totalLoss: 0,
          totalProfitLoss: 0,
        }
      }

      for (const key of Object.keys(stats)) {
        if (key in acc[pair]) {
          // @ts-ignore
          acc[pair][key] += stats[key] || 0
        }
      }

      acc[pair].totalPnl += stats.longPnl + stats.shortPnl
      acc[pair].totalOi += stats.longOi + stats.shortOi
      acc[pair].totalProfit += (stats.longProfit || 0) + (stats.shortProfit || 0)
      acc[pair].totalLoss += (stats.longLoss || 0) + (stats.shortLoss || 0)
    })
    return acc
  }, {} as { [pair: string]: TopPairChartData })

  for (const pair in pairAggregates) {
    const { totalProfit, totalLoss } = pairAggregates[pair]
    pairAggregates[pair].totalProfitLoss = Math.abs(totalProfit || 0) + Math.abs(totalLoss || 0)
  }

  const pairData = Object.values(pairAggregates)
    .map((stats) => ({
      ...stats,
      pair: stats.pair.split('-')?.[0] ?? stats.pair,
      backgroundColor:
        stats.longOi > stats.shortOi
          ? themeColors.green2
          : stats.longOi < stats.shortOi
          ? themeColors.red1
          : themeColors.neutral4,
    }))
    .filter((pair) => {
      switch (metric) {
        case 'volume':
          return pair.volume > 0
        case 'totalOi':
          return pair.longOi > 0 || pair.shortOi > 0
        case 'totalProfit':
          return pair.totalProfit > 0 || pair.totalLoss < 0
        case 'totalProfitLoss':
          return pair.totalProfitLoss != 0
        default:
          return true
      }
    })

  const sortedPairs = metric
    ? pairData.sort((a, b) =>
        sortType === 'desc' ? (b[metric] || 0) - (a[metric] || 0) : (a[metric] || 0) - (b[metric] || 0)
      )
    : pairData

  return top ? sortedPairs.slice(0, top).map((item, index) => ({ ...item, top: index + 1 })) : sortedPairs
}

export function tooltipFormatter(value: any, index: any, item: any) {
  const _value = value as number
  if (item.unit === '%') return formatNumber(_value, 1)
  return formatNumber(_value, _value < 1 && _value > -1 ? 1 : 0)
}
