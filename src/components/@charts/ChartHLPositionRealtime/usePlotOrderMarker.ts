import React from 'react'

import { HlOrderData } from 'entities/hyperliquid'
import { themeColors } from 'theme/colors'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import { IChartingLibraryWidget, IOrderLineAdapter } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  orders?: HlOrderData[]
}
export function usePlotOrderMarker({ chart, orders }: Props) {
  const orderMarker = React.useRef<IOrderLineAdapter[]>([])

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
            const color = order.isLong
              ? order.reduceOnly
                ? themeColors.red2
                : themeColors.green1
              : order.reduceOnly
              ? themeColors.green1
              : themeColors.red2
            return activeChart
              ?.createOrderLine()
              ?.setPrice(order.priceNumber)
              ?.setText(`${order.orderType}`)
              ?.setQuantity(` $${formatNumber(order.sizeNumber, 0)} `)
              ?.setTooltip(
                `${order.orderType} | ${formatPrice(order.priceNumber)} | $${formatNumber(order.sizeNumber)}`
              )
              ?.setLineStyle(2)
              ?.setLineWidth(0.5)
              ?.setLineColor(color)
              ?.setBodyBorderColor(color)
              ?.setBodyBackgroundColor(themeColors.neutral1)
              ?.setQuantityBackgroundColor(themeColors.neutral8)
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
