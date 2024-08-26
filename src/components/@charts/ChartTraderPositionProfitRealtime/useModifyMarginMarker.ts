import dayjs from 'dayjs'
import React from 'react'

import { OrderData } from 'entities/trader'

import { EntityId, IChartingLibraryWidget } from '../../../../public/static/charting_library'

interface Props {
  chart?: IChartingLibraryWidget
  orders?: OrderData[]
}
export function useModifyMarginMarker({ chart, orders }: Props) {
  const orderLines = React.useRef<(EntityId | null)[]>([])

  React.useEffect(() => {
    const activeChart = chart?.activeChart()
    if (!activeChart || !orders?.length || !activeChart.dataReady()) {
      return
    }

    orderLines.current = orders
      .map((order) => {
        return activeChart?.createMultipointShape([{ time: dayjs(order.blockTime).utc().unix() }], {
          shape: 'brush',
          text: 'M',
        })
      })
      .filter(Boolean)

    return () => {
      orderLines.current
      orderLines.current?.forEach((line) => line && activeChart.removeEntity(line))
    }
  }, [chart, orders])
}
