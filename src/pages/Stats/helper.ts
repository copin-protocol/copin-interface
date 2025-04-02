import { StatisticChartData } from 'entities/chart'
import { CopyStatisticData } from 'entities/statistic'
import { CopyTradePlatformEnum, TimeIntervalEnum } from 'utils/config/enums'
import { formatLocalDate } from 'utils/helpers/format'

export function summarizeMonthly(data: CopyStatisticData[]) {
  return Object.values(
    data.reduce<Record<string, CopyStatisticData>>((acc, item) => {
      const date = new Date(item.statisticAt)
      const yearMonth = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`

      if (!acc[yearMonth]) {
        acc[yearMonth] = { ...item, statisticAt: yearMonth, exchanges: {} }
      } else {
        Object.keys(item).forEach((_key) => {
          const key = _key as keyof CopyStatisticData
          if (key !== 'statisticAt' && key !== 'exchanges') {
            const itemValue = item[key]
            const prevData = acc[yearMonth][key] ?? 0
            typeof itemValue === 'number' && !isNaN(itemValue) && (acc[yearMonth][key] = prevData + itemValue)
          }
        })

        // Aggregate exchanges dynamically
        Object.entries(item.exchanges).forEach(([exchangeName, exchangeData]) => {
          if (!acc[yearMonth].exchanges[exchangeName]) {
            acc[yearMonth].exchanges[exchangeName] = { ...exchangeData }
          } else {
            Object.keys(exchangeData).forEach((subKey) => {
              //@ts-ignore
              const subItemValue = exchangeData[subKey]
              //@ts-ignore
              const prevData = acc[yearMonth].exchanges[exchangeName][subKey] ?? 0
              typeof subItemValue === 'number' &&
                !isNaN(subItemValue) &&
                //@ts-ignore
                (acc[yearMonth].exchanges[exchangeName][subKey] = prevData + subItemValue)
            })
          }
        })
      }

      return acc
    }, {})
  )
}

export function getChartData({
  data,
  timeType,
}: {
  data: CopyStatisticData[] | undefined
  timeType: TimeIntervalEnum
}) {
  let chartData: StatisticChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    // Data for Volume Chart
    let volumeCumulative = 0
    let orderCumulative = 0

    // Data for Profit & Loss Chart
    let pnlCumulative = 0
    let profitCumulative = 0
    let lossCumulative = 0

    // Data for Realised Profit & Loss Chart
    let realisedPnlCumulative = 0
    let realisedProfitCumulative = 0
    let realisedLossCumulative = 0

    // Data for Copy Statistic Chart
    let copierCumulative = 0
    let copierActiveCumulative = 0
    let copyTradeCumulative = 0
    let copyTradeActiveCumulative = 0

    chartData = data
      // .sort((x, y) => (x.statisticAt < y.statisticAt ? -1 : x.statisticAt > y.statisticAt ? 1 : 0))
      .map((stats) => {
        // Volume Chart
        volumeCumulative += stats.totalVolume
        orderCumulative += stats.totalOrder

        // Profit & Loss Chart
        const pnl = stats.totalProfit + stats.totalLoss
        const absPnl = Math.abs(stats.totalProfit) + Math.abs(stats.totalLoss)
        profitCumulative += stats.totalProfit
        lossCumulative += stats.totalLoss
        pnlCumulative += pnl

        // Realised Profit & Loss Chart
        const realisedPnl = stats.totalRealisedProfit + stats.totalRealisedLoss
        const absRealisedPnl = Math.abs(stats.totalRealisedProfit) + Math.abs(stats.totalRealisedLoss)
        realisedProfitCumulative += stats.totalRealisedProfit
        realisedLossCumulative += stats.totalRealisedLoss
        realisedPnlCumulative += realisedPnl

        // Copy Statistic Chart
        const totalCopier = stats.totalActiveCopier + stats.totalInactiveCopier
        const totalCopyTrade = stats.totalActiveCopyTrade + stats.totalInactiveCopyTrade
        copierCumulative += totalCopier
        copierActiveCumulative += stats.totalActiveCopier
        copyTradeCumulative += totalCopyTrade
        copyTradeActiveCumulative += stats.totalActiveCopyTrade

        // Other Exchanges
        const otherExchanges = (stats: any) => {
          let totalActiveCopyTrade = 0
          let totalInactiveCopyTrade = 0
          let totalOrder = 0
          let totalVolume = 0
          let totalPnl = 0
          let totalProfit = 0
          let totalLoss = 0
          let totalRealisedPnl = 0
          let totalRealisedProfit = 0
          let totalRealisedLoss = 0

          for (const exchange in stats.exchanges) {
            if (
              [
                CopyTradePlatformEnum.BINGX,
                CopyTradePlatformEnum.BITGET,
                CopyTradePlatformEnum.BYBIT,
                CopyTradePlatformEnum.OKX,
                CopyTradePlatformEnum.GATE,
                CopyTradePlatformEnum.GNS_V8,
                CopyTradePlatformEnum.HYPERLIQUID,
                CopyTradePlatformEnum.APEX,
              ].includes(exchange as CopyTradePlatformEnum)
            ) {
              const exchangeStats = stats.exchanges[exchange] || {}
              totalActiveCopyTrade += exchangeStats.totalActiveCopyTrade || 0
              totalInactiveCopyTrade += exchangeStats.totalInactiveCopyTrade || 0
              totalOrder += exchangeStats.totalOrder || 0
              totalVolume += exchangeStats.totalVolume || 0
              totalPnl += exchangeStats.totalPnl || 0
              totalProfit += exchangeStats.totalProfit || 0
              totalLoss += exchangeStats.totalLoss || 0
              totalRealisedPnl += exchangeStats.totalRealisedPnl || 0
              totalRealisedProfit += exchangeStats.totalRealisedProfit || 0
              totalRealisedLoss += exchangeStats.totalRealisedLoss || 0
            }
          }

          return {
            totalActiveCopyTrade: stats.totalActiveCopyTrade - totalActiveCopyTrade,
            totalInactiveCopyTrade: stats.totalInactiveCopyTrade - totalInactiveCopyTrade,
            totalOrder: stats.totalOrder - totalOrder,
            totalVolume: stats.totalVolume - totalVolume,
            totalPnl: pnl - totalPnl,
            totalProfit: stats.totalProfit - totalProfit,
            totalLoss: stats.totalLoss - totalLoss,
            totalRealisedPnl: realisedPnl - totalRealisedPnl,
            totalRealisedProfit: stats.totalRealisedProfit - totalRealisedProfit,
            totalRealisedLoss: stats.totalRealisedLoss - totalRealisedLoss,
          }
        }

        stats.exchanges = {
          ...stats.exchanges,
          [CopyTradePlatformEnum.OTHERS]: otherExchanges(stats),
        }

        const formattedData: StatisticChartData = {
          date:
            timeType === TimeIntervalEnum.MONTHLY
              ? stats.statisticAt
              : formatLocalDate(stats.statisticAt, 'YYYY.MM.DD'),
          exchanges: stats.exchanges,
          // Volume Chart
          volumeCumulative,
          orderCumulative,
          totalVolume: stats.totalVolume,
          totalOrder: stats.totalOrder,
          // Profit & Loss Chart
          pnl,
          pnlCumulative,
          profitCumulative,
          lossCumulative,
          totalProfit: stats.totalProfit,
          totalLoss: stats.totalLoss,
          profitPercent: absPnl > 0 ? (stats.totalProfit / absPnl) * 100 : 0,
          lossPercent: absPnl > 0 ? (Math.abs(stats.totalLoss) / absPnl) * 100 : 0,
          // Realised Profit & Loss Chart
          realisedPnl,
          realisedPnlCumulative,
          realisedProfitCumulative,
          realisedLossCumulative,
          totalRealisedProfit: stats.totalRealisedProfit,
          totalRealisedLoss: stats.totalRealisedLoss,
          realisedProfitPercent: absRealisedPnl > 0 ? (stats.totalRealisedProfit / absRealisedPnl) * 100 : 0,
          realisedLossPercent: absRealisedPnl > 0 ? (Math.abs(stats.totalRealisedLoss) / absRealisedPnl) * 100 : 0,
          // Copy Statistic Chart
          copierCumulative,
          copierActiveCumulative,
          copyTradeCumulative,
          copyTradeActiveCumulative,
          totalCopier,
          totalCopyTrade,
          totalActiveCopier: stats.totalActiveCopier,
          totalInactiveCopier: stats.totalInactiveCopier,
          totalActiveCopyTrade: stats.totalActiveCopyTrade,
          totalInactiveCopyTrade: stats.totalInactiveCopyTrade,
          totalDistinctTrader: stats.totalDistinctTrader,
        }

        // for (const exchange in stats.exchanges) {
        //   formattedData['activeCopyTrade' + exchange] = stats.exchanges[exchange].totalActiveCopyTrade
        // }

        return formattedData
      })
  }

  return chartData
}
