import dayjs from 'dayjs'

import { CopyTradePnL } from 'entities/copyTrade'

function addTimeframe(date: number, fromDate: number, toDate: number) {
  const diffDays = dayjs(toDate).utc().diff(fromDate, 'day')
  const currentDate = dayjs(date).utc()

  if (diffDays <= 7) {
    return currentDate.add(1, 'hour')
  } else if (diffDays <= 30) {
    return currentDate.add(4, 'hour')
  } else {
    return currentDate.add(1, 'day')
  }
}

export function generateChartPnL(fromDate: number, toDate: number, cumulativeDates: CopyTradePnL[]) {
  cumulativeDates.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const dateArray: CopyTradePnL[] = []
  let currentDate = dayjs(fromDate).utc().startOf('hour')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let amount = 0
    let roi = 0
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isAfter(cumulativeDate.date)) {
        amount = cumulativeDate.amount
        roi = cumulativeDate.roi
      }
    })

    dateArray.push({ date: currentDate.toISOString(), amount, roi })
    currentDate = addTimeframe(currentDate.valueOf(), fromDate, toDate)
  }

  return dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
}

export function generateChartDailyROI(fromDate: number, toDate: number, cumulativeDates: CopyTradePnL[]) {
  const dateArray: CopyTradePnL[] = []
  let currentDate = dayjs(fromDate).utc().startOf('day')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let amount = 0
    let roi = 0
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isSame(cumulativeDate.date)) {
        amount = cumulativeDate.amount
        roi = cumulativeDate.roi
      }
    })

    dateArray.push({ date: currentDate.toISOString(), amount, roi })
    currentDate = currentDate.add(1, 'day')
  }

  const data = dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const result: CopyTradePnL[] = []
  for (let i = 0; i < data.length - 1; i++) {
    result.push({
      date: data[i + 1].date,
      roi: data[i].amount ? ((data[i + 1].amount - data[i].amount) / data[i].amount) * 100 : 0,
      amount: data[i].amount ? data[i + 1].amount - data[i].amount : 0,
    })
  }

  return result
}
