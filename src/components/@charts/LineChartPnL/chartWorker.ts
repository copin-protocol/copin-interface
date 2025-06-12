import { ChartDataType } from '../types'
import { generateChartData } from './generateChartData'

export type ChartWorkerInput = {
  fromDate: number
  toDate: number
  data: ChartDataType[]
  isCumulativeData: boolean
  isSimple: boolean
  requestId: number
}
self.onmessage = function (event: MessageEvent<ChartWorkerInput>) {
  const { requestId } = event.data
  const result = generateChartData(event.data)
  self.postMessage({ result, requestId })
}
