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
      const activeChart = chart?.activeChart()
      if (!activeChart || !orders?.length || !activeChart.dataReady()) {
        return
      }

      markers = orders
        .map((order) => {
          return activeChart
            ?.createExecutionShape()
            ?.setText(
              `${
                order.isLong
                  ? order.type === OrderTypeEnum.INCREASE
                    ? 'B'
                    : 'S'
                  : order.type === OrderTypeEnum.INCREASE
                  ? 'S'
                  : 'B'
              }`
            )
            ?.setTooltip(
              `${
                order.isLong
                  ? order.type === OrderTypeEnum.INCREASE
                    ? 'Long'
                    : 'Short'
                  : order.type === OrderTypeEnum.INCREASE
                  ? 'Short'
                  : 'Long'
              } | ${formatPrice(order.priceNumber)} | $${formatNumber(order.sizeDeltaNumber)}`
            )
            ?.setTextColor(
              order.isLong
                ? order.type === OrderTypeEnum.INCREASE
                  ? themeColors.green1
                  : themeColors.red1
                : order.type === OrderTypeEnum.INCREASE
                ? themeColors.red1
                : themeColors.green1
            )
            .setArrowColor('#0F0')
            .setArrowHeight(15)
            .setDirection(
              order.isLong
                ? order.type === OrderTypeEnum.INCREASE
                  ? 'buy'
                  : 'sell'
                : order.type === OrderTypeEnum.INCREASE
                ? 'sell'
                : 'buy'
            )
            .setTime(dayjs(order.blockTime).utc().unix())
            .setPrice(order.priceNumber)
        })
        .filter(Boolean)

      orderMarker.current = markers
    } catch (e) {}

    return () => {
      markers.forEach((marker) => marker?.remove())
    }
  }, [chart, orders])
}
