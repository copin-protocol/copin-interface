import dayjs from 'dayjs'
import React, { useMemo } from 'react'

import { CopyOrderData } from 'entities/copyTrade'
import { OnchainPositionData } from 'pages/MyProfile/OpeningPositions/schema'
import { themeColors } from 'theme/colors'
import { PositionStatusEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcSLTPUsd } from 'utils/helpers/calculate'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import {
  IChartingLibraryWidget,
  IOrderLineAdapter,
  IPositionLineAdapter,
} from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  position?: OnchainPositionData
  orders?: CopyOrderData[]
}

export function usePlotPositionInformation({ chart, position, orders }: Props) {
  const positionLineRef = React.useRef<IPositionLineAdapter>()
  const slLineRef = React.useRef<IOrderLineAdapter>()
  const tpLineRef = React.useRef<IOrderLineAdapter>()

  const isOpening = position?.status === PositionStatusEnum.OPEN
  const side = position?.isLong ? 'LONG' : 'SHORT'
  const openedAt = dayjs(position?.createdAt).valueOf()
  const entry = position?.averagePrice
  const sizeDelta = useMemo(
    () =>
      isOpening
        ? position?.size / position?.averagePrice
        : orders?.filter((e) => e.isIncrease)?.reduce((sum, current) => sum + current.size, 0) ?? 0,
    [isOpening, position?.size, position?.averagePrice, orders]
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

        line = activeChart.createPositionLine()

        const color = position?.isLong ? themeColors.green1 : themeColors.red1

        line
          .setLineStyle(3)
          .setPrice(entry)
          .setQuantity(` $${formatNumber(position?.size)} `)
          .setLineWidth(0.5)
          .setLineColor(color)
          .setBodyBackgroundColor(color)
          .setBodyTextColor('#FFFFFF')
          .setBodyBorderColor(color)
          .setQuantityBackgroundColor('#E6DAFE')
          .setQuantityTextColor('#000000')
          .setQuantityBorderColor(color)

        line.setText(` ${side} `)

        positionLineRef.current = line

        if (position?.sl) {
          slLine = activeChart?.createOrderLine()
          const stopLossUsd = calcSLTPUsd(sizeDelta, position.sl, position.averagePrice)

          slLine
            .setLineStyle(1)
            .setLineColor(themeColors.orange1)
            .setPrice(position?.sl)
            .setText(
              `SL: -$${formatNumber(stopLossUsd, 2)}${position.sl ? ' - Est. Price: ' + formatPrice(position.sl) : ''}`
            )
            .setQuantity(`${formatNumber(sizeDelta)} ${symbol} `)
            .setQuantityBackgroundColor(themeColors.orange1)
            .setQuantityTextColor('#FFFFFF')
            .setQuantityBorderColor(themeColors.orange1)
            .setBodyBorderColor(themeColors.orange1)
            .setBodyBackgroundColor('#000000')
            .setBodyTextColor('#FFFFFF')
          slLineRef.current = slLine
        }

        if (position?.tp) {
          tpLine = activeChart?.createOrderLine()
          const takeProfitUsd = calcSLTPUsd(sizeDelta, position.tp, position.averagePrice)

          tpLine
            .setLineStyle(1)
            .setLineColor(themeColors.green1)
            .setPrice(position?.tp)
            .setText(
              `TP: $${formatNumber(takeProfitUsd, 2)}${position.tp ? ' - Est. Price: ' + formatPrice(position.tp) : ''}`
            )
            .setQuantity(`${formatNumber(sizeDelta)} ${symbol} `)
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
    position?.averagePrice,
    position?.isLong,
    position?.size,
    position?.sl,
    position?.tp,
    side,
    sizeDelta,
    symbol,
  ])

  return {
    positionLine: positionLineRef,
  }
}
