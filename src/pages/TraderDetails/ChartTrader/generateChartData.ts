import dayjs from 'dayjs'

import { TraderPnlStatisticData } from 'entities/statistic'

function addTimeframe(date: number, fromDate: number, toDate: number) {
  const diffDays = dayjs(toDate).utc().diff(fromDate, 'day')
  const diffHour = dayjs(toDate).utc().diff(dayjs(fromDate).utc(), 'hour')
  const currentDate = dayjs(date).utc()

  return diffDays > 4
    ? currentDate.add(4, 'hour')
    : diffDays > 0
    ? currentDate.add(1, 'hour')
    : diffHour > 8
    ? currentDate.add(15, 'minutes')
    : currentDate.add(5, 'minutes')
}

export function generateChartPnL(fromDate: number, toDate: number, cumulativeDates: TraderPnlStatisticData[]) {
  cumulativeDates.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const uniquePnlData: TraderPnlStatisticData[] = []
  cumulativeDates.forEach((item) => {
    const index = uniquePnlData.findIndex((e) => e.date === item.date)
    if (index >= 0) {
      const exist = uniquePnlData[index]
      uniquePnlData.splice(index, 1)
      uniquePnlData.push({ date: item.date, pnl: item.pnl + exist.pnl, fee: item.fee + exist.fee })
    } else {
      uniquePnlData.push(item)
    }
  })

  function convertToCumulativeArray(data: TraderPnlStatisticData[]): TraderPnlStatisticData[] {
    let cumulativePnl = 0
    let cumulativeFee = 0
    return data.reduce((cumulativeData: TraderPnlStatisticData[], dataPoint) => {
      cumulativePnl += dataPoint.pnl
      cumulativeFee += dataPoint.fee
      cumulativeData.push({ date: dataPoint.date, pnl: cumulativePnl, fee: cumulativeFee })

      return cumulativeData
    }, [])
  }
  const chartData = convertToCumulativeArray(uniquePnlData)

  const dateArray: TraderPnlStatisticData[] = []
  let currentDate = dayjs(fromDate).utc().startOf('hour')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let pnl = 0
    let fee = 0
    chartData.forEach((cumulativeDate) => {
      if (currentDate.isAfter(cumulativeDate.date)) {
        pnl = cumulativeDate.pnl
        fee = cumulativeDate.fee
      }
    })

    dateArray.push({ date: currentDate.toISOString(), pnl, fee })
    currentDate = addTimeframe(currentDate.valueOf(), fromDate, toDate)
  }

  return dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
}

export function generateChartDailyPnL(fromDate: number, toDate: number, cumulativeDates: TraderPnlStatisticData[]) {
  const dateArray: TraderPnlStatisticData[] = []
  let currentDate = dayjs(fromDate).utc().startOf('day')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let pnl = 0
    let fee = 0
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isSame(cumulativeDate.date)) {
        pnl = cumulativeDate.pnl
        fee = cumulativeDate.fee
      }
    })

    dateArray.push({ date: currentDate.toISOString(), pnl, fee })
    currentDate = currentDate.add(1, 'day')
  }

  const data = dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const result: TraderPnlStatisticData[] = []
  for (let i = 0; i < data.length - 1; i++) {
    result.push({
      date: data[i + 1].date,
      pnl: data[i + 1].pnl,
      fee: data[i + 1].fee,
      percentage: data[i].pnl ? ((data[i + 1].pnl - data[i].pnl) / data[i].pnl) * 100 : 0,
    })
  }

  return result
}
