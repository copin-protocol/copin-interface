import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useParsedProtocol } from 'hooks/store/useProtocols'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

const GAINS_TRADE_PRICE_FEED_URL = 'wss://backend-pricing.eu.gains.trade'

const INTERVAL_TIME = 1_000 // 1s
const INCLUDE_PATH = [
  ROUTES.OPEN_INTEREST.path_prefix,
  ROUTES.OPEN_INTEREST_POSITIONS.path,
  ROUTES.POSITION_DETAILS.path_prefix,
  ROUTES.TRADER_DETAILS.path_prefix,
  ROUTES.MY_MANAGEMENT.path,
  ROUTES.USER_DCP_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.MY_HISTORY.path,
]

export default function GainsTradeConnection() {
  const { setGainsPrices, setIsReady, gainsPrices } = useRealtimeUsdPricesStore()
  const { getSymbolByIndexToken } = useMarketsConfig()
  const { pathname } = useLocation()
  const lastLogTime = useRef(Date.now())
  const protocol = useParsedProtocol()
  const isGains =
    GAINS_TRADE_PROTOCOLS.some((protocol) => !!pathname.match(protocol)?.length) ||
    GAINS_TRADE_PROTOCOLS.includes(protocol)

  const { readyState, getWebSocket } = useWebSocket(GAINS_TRADE_PRICE_FEED_URL, {
    onOpen: () => console.log('gTrade price feed connection opened.'),
    onClose: () => console.log('gTrade price feed connection closed.'),
    shouldReconnect: (closeEvent: any) => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      try {
        if (!isGains) return
        const currentTime = Date.now()
        if (currentTime - lastLogTime.current >= INTERVAL_TIME) {
          const data = JSON.parse(event.data)

          if (!data || data.length < 2) return {}
          const pricesData: Record<string, number> = {}
          for (let i = 0; i < data.length; i += 2) {
            const pairIndex = data[i]
            const price = data[i + 1]
            const symbol = getSymbolByIndexToken({
              protocol: ProtocolEnum.GNS,
              indexToken: `${ProtocolEnum.GNS}-${pairIndex}`,
            })
            if (!symbol) return
            pricesData[symbol] = price
          }
          lastLogTime.current = currentTime
          setGainsPrices({ ...gainsPrices, ...pricesData })
        }
        return
      } catch (error) {
        return
        // console.log(error)
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
            initialCache.closes.forEach((price: number, index: number) => {
              const symbol = getSymbolByIndexToken({
                protocol: ProtocolEnum.GNS,
                indexToken: `${ProtocolEnum.GNS}-${index}`,
              })
              if (!symbol) return
              pricesData[symbol] = price
            })
            setGainsPrices({ ...gainsPrices, ...pricesData })
          }
        }

        if ((!gainsPrices || Object.values(gainsPrices).length === 0) && isGains) {
          await fetchAndProcessPriceFeeds()
        }

        setIsReady(true)
      })()

      setIsReady(true)
    }
  }, [pathname, protocol, isGains, getSymbolByIndexToken])

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
