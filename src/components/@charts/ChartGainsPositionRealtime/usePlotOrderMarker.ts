import dayjs from 'dayjs'
import React from 'react'

import { CopyOrderData } from 'entities/copyTrade'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { OnchainPositionData } from 'pages/MyProfile/OpeningPositions/schema'
import { themeColors } from 'theme/colors'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import { IChartingLibraryWidget, IExecutionLineAdapter } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  position?: OnchainPositionData
  orders?: CopyOrderData[]
}
export function usePlotOrderMarker({ chart, position, orders }: Props) {
  const orderMarker = React.useRef<IExecutionLineAdapter[]>([])
  const { getSymbolByIndexToken } = useMarketsConfig()

  const symbol = position?.indexToken
    ? getSymbolByIndexToken({ protocol: position.protocol, indexToken: position.indexToken })
    : 'UNKNOWN'

  React.useEffect(() => {
    let markers: IExecutionLineAdapter[] = []
    try {
      chart?.onChartReady(() => {
        const activeChart = chart?.activeChart()
        if (!activeChart || !position || !orders?.length || !activeChart.dataReady()) {
          return
        }

        markers = orders
          .map((order) => {
            return activeChart
              ?.createExecutionShape()
              .setText(`${order.isLong ? (order.isIncrease ? 'L' : 'S') : order.isIncrease ? 'S' : 'L'}`)
              .setTooltip(
                `${
                  order.isLong ? (order.isIncrease ? 'Long' : 'Short') : order.isIncrease ? 'Short' : 'Long'
                } | ${formatPrice(order.price)} | ${formatNumber(order.size)} ${symbol} | $${formatNumber(
                  order.size * order.price
                )}`
              )
              .setTextColor(
                order.isLong
                  ? order.isIncrease
                    ? themeColors.green1
                    : themeColors.red1
                  : order.isIncrease
                  ? themeColors.red1
                  : themeColors.green1
              )
              .setArrowColor('#0F0')
              .setArrowHeight(15)
              .setDirection(order.isLong ? (order.isIncrease ? 'buy' : 'sell') : order.isIncrease ? 'sell' : 'buy')
              .setTime(dayjs(order.createdAt).utc().unix())
              .setPrice(order.price)
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
  }, [chart, orders, position, symbol])
}
