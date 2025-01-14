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
  const liquidationLine = React.useRef<IPositionLineAdapter>()

  const side = position?.isLong ? 'LONG' : 'SHORT'
  const openedAt = dayjs(position?.openBlockTime).valueOf()
  const symbol = position ? getSymbolFromPair(position.pair) : 'UNKNOWN'
  const entry = getPriceTradingView(symbol, position?.averagePrice)
  const size = position?.size
  const liquidationPrice = position?.liquidationPrice

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
    let liquidLine = liquidationLine.current
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
            .setText(` ${side} `)
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

        if (liquidationPrice) {
          liquidLine = activeChart.createPositionLine()

          const color = themeColors.red1

          liquidLine
            .setText(`Liq. Price`)
            .setPrice(liquidationPrice)
            .setQuantity(`N/A`)
            .setLineWidth(0.5)
            .setLineColor(color)
            .setBodyBackgroundColor(color)
            .setBodyTextColor('#FFFFFF')
            .setBodyBorderColor(color)
            .setQuantityBackgroundColor('#E6DAFE')
            .setQuantityTextColor('#000000')
            .setQuantityBorderColor(color)
        }

        positionLine.current = line
        liquidationLine.current = liquidLine
      })
    } catch (e) {}

    return () => {
      try {
        chart?.onChartReady(() => {
          line?.remove()
          liquidLine?.remove()
        })
      } catch {}
    }
  }, [chart, entry, liquidationPrice, position?.isLong, position?.liquidationPrice, side, size, symbol])

  return {
    positionLine,
    liquidationLine,
  }
}
