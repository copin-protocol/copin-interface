import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LineData } from 'lightweight-charts'

import { chartTimeFrame, sortInputData } from '../helpers'
import { ChartDataType } from '../types'

dayjs.extend(utc)

// Group data by month & year
function getMonthYear(_date: string) {
  const date = new Date(_date)
  return `${date.getFullYear()}-${date.getMonth() + 1}` // Month starts from 0, so +1
}

// Group data by week & year
function getWeekYear(_date: string) {
  const date = dayjs(_date)
  const year = date.year()
  const week = date.week()
  return `${year}-${week}` // Format: YYYY-WW
}

// Find the last day of each month in the data
function findLastDaysOfMonths(data: ChartDataType[]) {
  // Step 1: Group data by month and year
  const monthGroups: Record<string, ChartDataType> = {}

  data.forEach((item) => {
    const key = getMonthYear(item.date)
    monthGroups[key] = item
  })

  return Object.values(monthGroups).sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
}

// Find the last day of each week in the data
function findLastDaysOfWeeks(data: ChartDataType[]) {
  // Group data by week and year
  const weekGroups: Record<string, ChartDataType> = {}

  data.forEach((item) => {
    const key = getWeekYear(item.date)
    weekGroups[key] = item
  })

  return Object.values(weekGroups).sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
}

export function generateChartData({
  fromDate,
  toDate,
  data,
  isCumulativeData,
  isSimple,
}: {
  fromDate: number
  toDate: number
  data: ChartDataType[]
  isCumulativeData: boolean
  isSimple: boolean
}) {
  const sortedData = sortInputData(data)
  const fullChartData = isCumulativeData ? sortedData : convertToCumulativeArray(sortedData)

  // Find the first index with non-zero pnl
  const firstValidIndex = fullChartData.findIndex((d) => d.realisedPnl + d.unrealisedPnl !== 0)
  const chartData = firstValidIndex !== -1 ? fullChartData.slice(firstValidIndex) : []
  let dateArray: ChartDataType[] = []

  // Calculate diffDays based on sliced data
  const newFromDate = chartData[0] ? dayjs(chartData[0].date).valueOf() : fromDate
  const newToDate = chartData[chartData.length - 1] ? dayjs(chartData[chartData.length - 1].date).valueOf() : toDate
  let currentDate = dayjs(newFromDate).utc()
  const diffDays = dayjs(newToDate).diff(currentDate, 'day')

  // >2 years => Use monthly data, >230 days => Use weekly data
  if (diffDays >= 730 && isSimple) {
    dateArray = findLastDaysOfMonths(chartData)
  } else if (diffDays >= 230 && isSimple) {
    dateArray = findLastDaysOfWeeks(chartData)
  } else {
    currentDate =
      diffDays >= 60
        ? currentDate.startOf('day')
        : diffDays >= 1
        ? currentDate.startOf('hour')
        : currentDate.startOf('minute')

    const dataLength = chartData.length

    // Preprocess: Create a structure for fast data lookups
    const timePoints = []

    // Iterate over required time points for the chart
    let tempDate = currentDate.clone()
    while (tempDate.isSame(newToDate) || tempDate.isBefore(newToDate)) {
      timePoints.push({
        timestamp: tempDate.valueOf(),
        date: tempDate.toISOString(),
        realisedPnl: 0,
        unrealisedPnl: 0,
        pnl: 0,
        fee: 0,
        roi: 0,
      })
      tempDate = chartTimeFrame(tempDate.valueOf(), newFromDate, newToDate)
    }

    // Pointer for the data array
    let dataIndex = 0

    // Fill values for each time point using chartData
    for (let i = 0; i < timePoints.length; i++) {
      const currentPoint = timePoints[i]

      // Move the data pointer to the appropriate position
      for (; dataIndex < dataLength; dataIndex++) {
        const dataPoint = chartData[dataIndex]
        const dataTimestamp = dayjs(dataPoint.date).valueOf()

        // Stop if the data point is beyond the current time point
        if (dataTimestamp > currentPoint.timestamp) {
          break
        }

        // Update values for the current time point
        currentPoint.realisedPnl = dataPoint.realisedPnl
        currentPoint.unrealisedPnl = dataPoint.unrealisedPnl
        currentPoint.fee = dataPoint.fee
        currentPoint.roi = dataPoint.roi
        currentPoint.pnl = dataPoint.realisedPnl + dataPoint.unrealisedPnl
      }

      // If not the first point and no new data, copy values from the previous point
      if (
        i > 0 &&
        currentPoint.realisedPnl === 0 &&
        currentPoint.unrealisedPnl === 0 &&
        currentPoint.fee === 0 &&
        currentPoint.roi === 0
      ) {
        const prevPoint = timePoints[i - 1]
        currentPoint.realisedPnl = prevPoint.realisedPnl
        currentPoint.unrealisedPnl = prevPoint.unrealisedPnl
        currentPoint.pnl = prevPoint.pnl
        currentPoint.fee = prevPoint.fee
        currentPoint.roi = prevPoint.roi
      }
    }

    dateArray = timePoints
  }

  const timezone = new Date().getTimezoneOffset() * 60
  return dateArray.map((v) => ({ value: v.pnl, time: dayjs(v.date).utc().unix() - timezone } as LineData))
}

function convertToCumulativeArray(data: ChartDataType[]): ChartDataType[] {
  const uniquePnlData: ChartDataType[] = []
  data.forEach((item) => {
    const index = uniquePnlData.findIndex((e) => e.date === item.date)
    if (index >= 0) {
      const exist = uniquePnlData[index]
      uniquePnlData.splice(index, 1)
      uniquePnlData.push({
        date: item.date,
        realisedPnl: item.realisedPnl + exist.realisedPnl,
        unrealisedPnl: item.unrealisedPnl + exist.unrealisedPnl,
        pnl: item.pnl + exist.pnl,
        fee: item.fee + exist.fee,
        roi: item.roi + exist.roi,
      })
    } else {
      uniquePnlData.push(item)
    }
  })

  let cumulativeRealisedPnl = 0
  let cumulativeUnrealisedPnl = 0
  let cumulativePnl = 0
  let cumulativeFee = 0
  let cumulativeRoi = 0
  return uniquePnlData.reduce((result: ChartDataType[], dataPoint) => {
    cumulativeRealisedPnl += dataPoint.realisedPnl
    cumulativeUnrealisedPnl += dataPoint.unrealisedPnl
    cumulativePnl += dataPoint.pnl
    cumulativeFee += dataPoint.fee
    cumulativeRoi += dataPoint.roi
    result.push({
      date: dataPoint.date,
      realisedPnl: cumulativeRealisedPnl,
      unrealisedPnl: cumulativeUnrealisedPnl,
      pnl: cumulativePnl,
      fee: cumulativeFee,
      roi: cumulativeRoi,
    })

    return result
  }, [])
}
