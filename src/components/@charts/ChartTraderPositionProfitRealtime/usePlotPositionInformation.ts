import dayjs from 'dayjs'
import React from 'react'

import { PositionData } from 'entities/trader'
import { themeColors } from 'theme/colors'
import { getPriceTradingView } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { IChartingLibraryWidget, IPositionLineAdapter } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  position?: PositionData
}

export function usePlotPositionInformation({ chart, position }: Props) {
  const positionLine = React.useRef<IPositionLineAdapter>()

  const side = position?.isLong ? 'LONG' : 'SHORT'
  const openedAt = dayjs(position?.openBlockTime).valueOf()
  const symbol = position ? getSymbolFromPair(position.pair) : 'UNKNOWN'
  const entry = getPriceTradingView(symbol, position?.averagePrice)
  const size = position?.size

  /**
   * BUY ARROW
   */
  React.useEffect(() => {
    try {
      const activeChart = chart?.activeChart()
      if (!activeChart || !openedAt || !activeChart.dataReady()) {
        return
      }

      activeChart
        .createExecutionShape()
        .setText('')
        .setTime(openedAt)
        .setArrowHeight(32)
        .setArrowSpacing(20)
        .setArrowColor('#E6DAFE')
        .setDirection('buy')
    } catch (e) {}
  }, [chart, openedAt])
  /**
   * Position Line (PNL + SIZE)
   */
  React.useEffect(() => {
    let line = positionLine.current
    try {
      chart?.onChartReady(() => {
        const activeChart = chart?.activeChart()
        if (!activeChart || !entry || !symbol || !size) {
          return
        }

        if (!line) {
          line = activeChart.createPositionLine()

          const color = position?.isLong ? themeColors.green1 : themeColors.red1

          line
            .setPrice(entry)
            .setQuantity(` $${formatNumber(size, 0)} `)
            .setLineWidth(0.5)
            .setLineColor(color)
            .setBodyBackgroundColor(color)
            .setBodyTextColor('#FFFFFF')
            .setBodyBorderColor(color)
            .setQuantityBackgroundColor('#E6DAFE')
            .setQuantityTextColor('#000000')
            .setQuantityBorderColor(color)
        }

        line.setText(` ${side} `)

        positionLine.current = line
      })
    } catch (e) {}

    return () => {
      try {
        chart?.onChartReady(() => {
          line?.remove()
        })
      } catch {}
    }
  }, [chart, entry, position?.isLong, side, size, symbol])

  return {
    positionLine,
  }
}
