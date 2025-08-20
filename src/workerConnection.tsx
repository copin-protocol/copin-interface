import { memo, useEffect, useRef, useState } from 'react'

import useTraderBalanceStore from 'hooks/store/useTraderBalanceStore'
import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/price'
import { WorkerMessage, WorkerSendMessage } from 'utils/types'

let worker: SharedWorker | null = null
let hlWorker: SharedWorker | null = null
if (!!window.SharedWorker) {
  worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
    name: 'Pyth worker',
  })
  worker.port.start()
  worker.port.postMessage('')

  hlWorker = new SharedWorker(new URL('./serviceWorker/hyperliquidWorker.ts', import.meta.url), {
    type: 'module',
    name: 'Hyperliquid worker',
  })
  hlWorker.port.start()
  hlWorker.port.postMessage('')
}

const WorkerConnection = memo(function WorkerConnectionMemo() {
  const { setPrices, setIsReady, setGainsPrices, setHlPrices } = useRealtimeUsdPricesStore()
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
    if (initiated.current) return
    initiated.current = true
    if (worker) {
      worker.port.onmessage = (event) => {
        if (document.visibilityState !== 'visible') return
        const data = event.data as WorkerMessage
        if (data?.type === 'pyth_price') {
          setIsReady(true)
          const prices = data.data
          Object.entries(PROTOCOL_PRICE_MULTIPLE_MAPPING).forEach(([protocolSymbol, config]) => {
            const multiple = config.multiple
            const originalSymbol = config.originalSymbol
            if (prices[originalSymbol]) {
              data.data[protocolSymbol] = (prices[originalSymbol] ?? 0) * multiple
            }
          })
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
    }
    if (hlWorker) {
      hlWorker.port.onmessage = (event) => {
        if (document.visibilityState !== 'visible') return
        const data = event.data as WorkerMessage

        // ex: kPEPE => check mapping => get all original => check if equal original symbol => push protocol symbol
        if (data?.type === 'hl_price') {
          // const { originalSymbol, multiple } = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol] ?? {}
          // const originalPrice = (data.data[symbol] ?? 0) / multiple
          const prices = data.data
          Object.entries(PROTOCOL_PRICE_MULTIPLE_MAPPING).forEach(([protocolSymbol, config]) => {
            const multiple = config.multiple
            const originalSymbol = config.originalSymbol
            if (prices[protocolSymbol]) {
              const originalPrice = (prices[protocolSymbol] ?? 0) / config.multiple
              Object.entries(PROTOCOL_PRICE_MULTIPLE_MAPPING).forEach(([_protocolSymbol, _config]) => {
                if (_protocolSymbol !== protocolSymbol && _config.originalSymbol === config.originalSymbol) {
                  data.data[_protocolSymbol] = originalPrice * _config.multiple
                }
              })
              data.data[originalSymbol] = (prices[protocolSymbol] ?? 0) / multiple
            }
            if (prices[originalSymbol]) {
              data.data[protocolSymbol] = (prices[originalSymbol] ?? 0) * multiple
            }
          })
          setHlPrices(data.data)
        }
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
