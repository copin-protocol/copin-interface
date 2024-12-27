import dayjs from 'dayjs'
import React from 'react'

import { OrderData } from 'entities/trader'
import { themeColors } from 'theme/colors'
import { OrderTypeEnum } from 'utils/config/enums'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import { IChartingLibraryWidget, IExecutionLineAdapter } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  orders?: OrderData[]
}
export function usePlotOrderMarker({ chart, orders }: Props) {
  const orderMarker = React.useRef<IExecutionLineAdapter[]>([])

  React.useEffect(() => {
    let markers: IExecutionLineAdapter[] = []
    try {
      chart?.onChartReady(() => {
        const activeChart = chart?.activeChart()
        if (!activeChart || !orders?.length || !activeChart.dataReady()) {
          return
        }

        markers = orders
          .map((order) => {
            const isIncrease = order.type === OrderTypeEnum.INCREASE || order.type === OrderTypeEnum.OPEN
            return activeChart
              ?.createExecutionShape()
              ?.setText(`${order.isLong ? (isIncrease ? 'B' : 'S') : isIncrease ? 'S' : 'B'}`)
              ?.setTooltip(
                `${order.isLong ? (isIncrease ? 'Long' : 'Short') : isIncrease ? 'Short' : 'Long'} | ${formatPrice(
                  order.priceNumber
                )} | $${formatNumber(order.sizeDeltaNumber)}`
              )
              ?.setTextColor(
                order.isLong
                  ? isIncrease
                    ? themeColors.green1
                    : themeColors.red1
                  : isIncrease
                  ? themeColors.red1
                  : themeColors.green1
              )
              .setArrowColor('#0F0')
              .setArrowHeight(15)
              .setDirection(order.isLong ? (isIncrease ? 'buy' : 'sell') : isIncrease ? 'sell' : 'buy')
              .setTime(dayjs(order.blockTime).utc().unix())
              .setPrice(order.priceNumber)
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
