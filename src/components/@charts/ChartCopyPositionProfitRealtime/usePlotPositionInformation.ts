import dayjs from 'dayjs'
import React, { useMemo } from 'react'

import { CopyOrderData, CopyPositionData } from 'entities/copyTrade'
import { themeColors } from 'theme/colors'
import { PositionStatusEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcSLTPUsd } from 'utils/helpers/calculate'
import { formatNumber } from 'utils/helpers/format'

import {
  IChartingLibraryWidget,
  IOrderLineAdapter,
  IPositionLineAdapter,
} from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  position?: CopyPositionData
  orders?: CopyOrderData[]
}

export function usePlotPositionInformation({ chart, position, orders }: Props) {
  const positionLineRef = React.useRef<IPositionLineAdapter>()
  const slLineRef = React.useRef<IOrderLineAdapter>()
  const tpLineRef = React.useRef<IOrderLineAdapter>()

  const isOpening = position?.status === PositionStatusEnum.OPEN
  const side = position?.isLong ? 'LONG' : 'SHORT'
  const openedAt = dayjs(position?.createdAt).valueOf()
  const entry = position?.entryPrice
  const sizeDelta = useMemo(
    () =>
      isOpening
        ? Number(position?.sizeDelta)
        : orders?.filter((e) => e.isIncrease)?.reduce((sum, current) => sum + current.size, 0) ?? 0,
    [orders, position?.sizeDelta, isOpening]
  )
  const symbol = position ? TOKEN_TRADE_SUPPORT[position?.protocol][position?.indexToken]?.symbol : 'UNKNOWN'

  React.useEffect(() => {
    try {
      chart?.onChartReady(() => {
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
      })
    } catch (e) {}
  }, [chart, openedAt])

  React.useEffect(() => {
    let line = positionLineRef.current
    let slLine = slLineRef.current
    let tpLine = tpLineRef.current

    try {
      chart?.onChartReady(() => {
        const activeChart = chart?.activeChart()
        if (!activeChart || !entry || !symbol || !sizeDelta) {
          return
        }

        if (!line) {
          line = activeChart.createPositionLine()

          const color = position?.isLong ? themeColors.green1 : themeColors.red1

          line
            .setLineStyle(3)
            .setPrice(entry)
            .setQuantity(` ${formatNumber(sizeDelta)} ${symbol} `)
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

        positionLineRef.current = line

        if (!slLine && position.latestStopLossId && position.stopLossAmount) {
          slLine = activeChart?.createOrderLine()
          const stopLossUsd = calcSLTPUsd(position.stopLossAmount, position.stopLossPrice, position.entryPrice)

          slLine
            .setLineStyle(1)
            .setLineColor(themeColors.orange1)
            .setPrice(position?.stopLossPrice)
            .setText(
              `SL: -$${formatNumber(stopLossUsd, 2)}${
                position.stopLossPrice ? ' - Est. Price: ' + formatNumber(position.stopLossPrice) : ''
              }`
            )
            .setQuantity(`${formatNumber(position.stopLossAmount)} ${symbol} `)
            .setQuantityBackgroundColor(themeColors.orange1)
            .setQuantityTextColor('#FFFFFF')
            .setQuantityBorderColor(themeColors.orange1)
            .setBodyBorderColor(themeColors.orange1)
            .setBodyBackgroundColor('#000000')
            .setBodyTextColor('#FFFFFF')
          slLineRef.current = slLine
        }

        if (!tpLine && position.latestTakeProfitId && position.takeProfitAmount) {
          tpLine = activeChart?.createOrderLine()
          const takeProfitUsd = calcSLTPUsd(position.takeProfitAmount, position.takeProfitPrice, position.entryPrice)

          tpLine
            .setLineStyle(1)
            .setLineColor(themeColors.green1)
            .setPrice(position?.takeProfitPrice)
            .setText(
              `TP: $${formatNumber(takeProfitUsd, 2)}${
                position.takeProfitPrice ? ' - Est. Price: ' + formatNumber(position.takeProfitPrice) : ''
              }`
            )
            .setQuantity(`${formatNumber(position.takeProfitAmount)} ${symbol} `)
            .setQuantityBackgroundColor(themeColors.green1)
            .setQuantityTextColor('#FFFFFF')
            .setQuantityBorderColor(themeColors.green1)
            .setBodyBorderColor(themeColors.green1)
            .setBodyBackgroundColor('#000000')
            .setBodyTextColor('#FFFFFF')
          tpLineRef.current = tpLine
        }
      })
    } catch (e) {}

    return () => {
      try {
        chart?.onChartReady(() => {
          line?.remove()
          slLine?.remove()
          tpLine?.remove()
        })
      } catch {}
    }
  }, [
    chart,
    entry,
    position?.entryPrice,
    position?.isLong,
    position?.latestStopLossId,
    position?.latestTakeProfitId,
    position?.stopLossAmount,
    position?.stopLossPrice,
    position?.takeProfitAmount,
    position?.takeProfitPrice,
    side,
    sizeDelta,
    symbol,
  ])

  return {
    positionLine: positionLineRef,
  }
}
