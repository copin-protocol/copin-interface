import { memo, useEffect, useRef, useState } from 'react'

import useTraderBalanceStore from 'hooks/store/useTraderBalanceStore'
import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { WorkerMessage, WorkerSendMessage } from 'utils/types'

let worker: SharedWorker | null = null
if (!!window.SharedWorker) {
  worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
    name: 'Pyth worker',
  })

  worker.port.start()
  worker.port.postMessage('')
}

const WorkerConnection = memo(function WorkerConnectionMemo() {
  const { setPrices, setIsReady, setGainsPrices } = useRealtimeUsdPricesStore()
  const { traderToGetBalance, setBalances } = useTraderBalanceStore()
  const [isActive, setIsActive] = useState(document.visibilityState === 'visible')

  const prevTrader = useRef(traderToGetBalance)
  useEffect(() => {
    if (!!traderToGetBalance && prevTrader.current !== traderToGetBalance && isActive) {
      prevTrader.current = traderToGetBalance
      const msg: WorkerSendMessage = { type: 'trader_balance', data: traderToGetBalance }
      worker?.port.postMessage(msg)
    }
  }, [traderToGetBalance, isActive])

  const initiated = useRef(false)
  useEffect(() => {
    if (initiated.current || !worker) return
    initiated.current = true
    worker.port.onmessage = (event) => {
      if (document.visibilityState !== 'visible') return
      const data = event.data as WorkerMessage
      if (data?.type === 'pyth_price') {
        setIsReady(true)
        setPrices(data?.data ?? {})
      }

      if (data?.type === 'gains_price') {
        setIsReady(true)
        setGainsPrices(data?.data ?? {})
      }
      if (data?.type === 'trader_balance') {
        setBalances({ [`${data.data.address}__${data.data.protocol}`]: data.data.balances })
      }
    }
  }, [])

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsActive(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return null
})

export default WorkerConnection
