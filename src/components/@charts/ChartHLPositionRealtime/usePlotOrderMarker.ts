import React from 'react'

import { HlOrderData } from 'entities/hyperliquid'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { themeColors } from 'theme/colors'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import { IChartingLibraryWidget, IOrderLineAdapter } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  orders?: HlOrderData[]
}
export function usePlotOrderMarker({ chart, orders }: Props) {
  const orderMarker = React.useRef<IOrderLineAdapter[]>([])
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair

  React.useEffect(() => {
    let markers: IOrderLineAdapter[] = []
    try {
      chart?.onChartReady(() => {
        const activeChart = chart?.activeChart()
        if (!activeChart || !orders?.length || !activeChart.dataReady()) {
          return
        }

        markers = orders
          .map((order) => {
            const hlDecimals = getHlSzDecimalsByPair?.(order.pair)
            const color = order.isLong
              ? order.reduceOnly
                ? themeColors.red2
                : themeColors.green1
              : order.reduceOnly
              ? themeColors.green1
              : themeColors.red2
            return activeChart
              ?.createOrderLine()
              ?.setPrice(order.isTrigger ? order.triggerPriceNumber : order.priceNumber)
              ?.setText(`${order.orderType}`)
              ?.setQuantity(order.sizeNumber ? `$${formatNumber(order.sizeNumber, 0)}` : 'N/A')
              ?.setTooltip(
                `${order.orderType}${order.triggerCondition ? ` | ${order.triggerCondition}` : ''} | ${formatPrice(
                  order.priceNumber,
                  2,
                  2,
                  { hlDecimals }
                )} | ${order.sizeNumber ? `$${formatNumber(order.sizeNumber, 0)}` : 'N/A'}`
              )
              ?.setLineStyle(2)
              ?.setLineWidth(0.5)
              ?.setLineColor(color)
              ?.setBodyTextColor(themeColors.neutral6)
              ?.setBodyBorderColor(color)
              ?.setBodyBackgroundColor(themeColors.neutral1)
              ?.setQuantityBackgroundColor(themeColors.neutral5)
              ?.setQuantityBorderColor(color)
          })
          .filter(Boolean)

        orderMarker.current = markers
      })
    } catch (e) {}

    return () => {
      try {
        chart?.onChartReady(() => {
          markers.forEach((marker) => marker?.remove())
        })
      } catch {}
    }
  }, [chart, orders])
}
