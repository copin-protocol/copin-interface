import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

import { useParsedProtocol } from 'hooks/store/useProtocols'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

const GAINS_TRADE_PRICE_FEED_URL = 'wss://backend-pricing.eu.gains.trade'

const INTERVAL_TIME = 3 // s
const INCLUDE_PATH = [
  ROUTES.OPEN_INTEREST.path_prefix,
  ROUTES.POSITION_DETAILS.path_prefix,
  ROUTES.TRADER_DETAILS.path_prefix,
  ROUTES.MY_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.MY_HISTORY.path,
]

export default function GainsTradeConnection() {
  const { setPrices, setIsReady, prices } = useRealtimeUsdPricesStore()
  const { pathname } = useLocation()
  const lastLogTime = useRef(Date.now())
  const protocol = useParsedProtocol()
  const isGains =
    GAINS_TRADE_PROTOCOLS.some((protocol) => !!pathname.match(protocol)?.length) ||
    GAINS_TRADE_PROTOCOLS.includes(protocol)

  const { readyState, getWebSocket } = useWebSocket(GAINS_TRADE_PRICE_FEED_URL, {
    onOpen: () => console.log('gTrade price feed connection opened.'),
    onClose: () => console.log('gTrade price feed connection closed.'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      if (!isGains) return
      const currentTime = Date.now()
      if (currentTime - lastLogTime.current >= INTERVAL_TIME * 1000) {
        const data = processPriceData(JSON.parse(event.data))
        lastLogTime.current = currentTime
        setPrices({ ...prices, ...data })
      }
    },
  })

  const initiated = useRef(false)
  useEffect(() => {
    const acceptConnection =
      pathname === ROUTES.HOME.path || INCLUDE_PATH.some((path) => !!pathname.match(path)?.length)
    if (acceptConnection) {
      if (initiated.current) return
      initiated.current = true
      ;(async () => {
        async function fetchAndProcessPriceFeeds() {
          const pricesData = {} as UsdPrices
          const initialCache = await fetch('https://backend-pricing.eu.gains.trade/charts').then((res) => res.json())
          if (initialCache && initialCache.closes) {
            initialCache.closes.map((price: number, index: number) => {
              pricesData[`${ProtocolEnum.GNS}-` + index] = price
              pricesData[`${ProtocolEnum.GNS_POLY}-` + index] = price
            })
            setPrices(pricesData)
          }
        }

        if (isGains) {
          await fetchAndProcessPriceFeeds()
        }

        setIsReady(true)
      })()

      setIsReady(true)
    }
  }, [pathname, isGains])

  useEffect(() => {
    return () => {
      if (readyState === 1) {
        getWebSocket()?.close()
      }
      setIsReady(false)
    }
  }, [])

  return null
}

function processPriceData(data: number[]): Record<string, number> {
  if (!data || data.length < 2) return {}
  const result: Record<string, number> = {}
  for (let i = 0; i < data.length; i += 2) {
    const pairIndex = data[i]
    const price = data[i + 1]
    result[`${ProtocolEnum.GNS}-` + pairIndex] = price
    result[`${ProtocolEnum.GNS_POLY}-` + pairIndex] = price
  }
  return result
}
