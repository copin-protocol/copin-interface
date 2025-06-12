import { LineData } from 'lightweight-charts'
import { useEffect, useState } from 'react'

import { ProtocolEnum } from 'utils/config/enums'

import { ChartDataType } from '../types'
import ChartWorker from './chartWorker.ts?worker'

type Params = {
  fromDate: number
  toDate: number
  data: ChartDataType[]
  isCumulativeData: boolean
  address?: string
  protocol?: ProtocolEnum
}

let sharedWorker: Worker | null = null
const getWorker = () => {
  if (!sharedWorker) {
    sharedWorker = new ChartWorker()
  }
  return sharedWorker
}
export function useChartWorker(params: Params | undefined) {
  const [result, setResult] = useState<LineData[]>([])
  useEffect(() => {
    if (!params) return
    const worker = getWorker()
    const requestId = `${params.address ?? '-'}-${params.protocol ?? '-'}`
    const handleMessage = (event: MessageEvent) => {
      if (event.data.requestId === requestId) {
        setResult(event.data.result)
      }
    }
    worker.addEventListener('message', handleMessage)
    worker.postMessage({ ...params, requestId })
    return () => {
      worker.removeEventListener('message', handleMessage)
    }
  }, [params])
  return result
}
