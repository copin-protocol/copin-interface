import dayjs from 'dayjs'

import { ChartDataType } from './types'

export function sortInputData<T extends ChartDataType>(data: T[]): T[] {
  const newData = [...data]
  newData.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  return newData
}

export function chartTimeFrame(date: number, fromDate: number, toDate: number) {
  const diffDays = dayjs(toDate).utc().diff(fromDate, 'day')
  const diffHour = dayjs(toDate).utc().diff(dayjs(fromDate).utc(), 'hour')
  const currentDate = dayjs(date).utc()

  return diffDays >= 60
    ? currentDate.add(1, 'day')
    : diffDays >= 7
    ? currentDate.add(4, 'hour')
    : diffDays >= 1
    ? currentDate.add(1, 'hour')
    : diffHour > 8
    ? currentDate.add(15, 'minutes')
    : currentDate.add(5, 'minutes')
}
