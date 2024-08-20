import dayjs from 'dayjs'
import { ISeriesApi, SeriesMarker, Time } from 'lightweight-charts'

import { PositionData } from 'entities/trader.d'
import { themeColors } from 'theme/colors'
import { formatNumber } from 'utils/helpers/format'

type RenderMarkerArgs = {
  listPositions: PositionData[]
  markerId: string | undefined
  timezone: number
  closedPos: PositionData[]
  series: ISeriesApi<'Candlestick'>
}

export default function renderChartPositionsMarker({
  listPositions,
  markerId,
  timezone,
  closedPos,
  series,
}: RenderMarkerArgs) {
  const increasePosMarkers = listPositions.map((position): SeriesMarker<Time> => {
    const isSelected = markerId && markerId.includes(position.id)
    return {
      id: `${position.id}-OPEN`,
      position: 'aboveBar',
      color: markerId && !isSelected ? themeColors.neutral3 : position.isLong ? themeColors.green1 : themeColors.red2,
      size: isSelected ? 1.85 : 1.35,
      shape: position.isLong ? 'arrowUp' : 'arrowDown',
      text: position.isLong ? 'L' : 'S',
      time: (dayjs(position.openBlockTime).utc().unix() - timezone) as Time,
    }
  })

  const closePosMarkers = closedPos.map((position): SeriesMarker<Time> => {
    const isSelected = markerId && markerId.includes(position.id)
    return {
      id: `${position.id}-CLOSE`,
      position: 'belowBar',
      color:
        markerId && !isSelected ? themeColors.neutral3 : position.isLiquidate ? themeColors.red2 : themeColors.neutral1,
      size: isSelected ? 1.75 : 1.5,
      shape: 'square',
      text: '$' + formatNumber(position.pnl),
      time: (dayjs(position.closeBlockTime).utc().unix() - timezone) as Time,
    }
  })

  const markers = [...increasePosMarkers, ...closePosMarkers].sort((a, b) => (a.time as number) - (b.time as number))
  series.setMarkers(markers)
}
