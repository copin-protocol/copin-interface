import { memo, useEffect, useRef } from 'react'

import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { WorkerMessage } from 'utils/types'

let worker: SharedWorker | null = null
if (!!window.SharedWorker) {
  worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
    name: 'Pyth worker',
  })

  worker.port.start()
  worker.port.postMessage('')
}

const PythConnection = memo(function PythConnectionMemo() {
  const { setPrices, setIsReady } = useRealtimeUsdPricesStore()

  const initiated = useRef(false)
  useEffect(() => {
    if (initiated.current || !worker) return
    initiated.current = true
    worker.port.onmessage = (event) => {
      const pythPrices = event.data as WorkerMessage
      if (event.data) {
        setIsReady(true)
        setPrices(pythPrices.data)
      }
    }

    setIsReady(true)
  }, [])

  useEffect(() => {
    return () => {
      setIsReady(false)
    }
  }, [])

  return null
})

export default PythConnection
