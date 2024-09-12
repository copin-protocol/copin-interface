import React from 'react'

import { themeColors } from 'theme/colors'

import { ChartingLibraryWidgetOptions, IChartingLibraryWidget } from '../../../../public/static/charting_library'
import { widget as TVWidget } from '../../../../public/static/charting_library/charting_library.esm'

interface Props {
  container: string | HTMLElement
  options: ChartingLibraryWidgetOptions
}

export function useChart(opts: ChartingLibraryWidgetOptions) {
  const [chart, setChart] = React.useState<IChartingLibraryWidget | undefined>(undefined)

  React.useEffect(() => {
    if (!opts.container) {
      return
    }

    const chart: IChartingLibraryWidget = new TVWidget(opts)

    chart.onChartReady(() => {
      chart.activeChart().getSeries().setChartStyleProperties(1, {
        upColor: themeColors.green1,
        downColor: themeColors.red1,
        borderUpColor: themeColors.green1,
        borderDownColor: themeColors.red1,
        wickUpColor: themeColors.green1,
        wickDownColor: themeColors.red1,
      })

      chart.applyOverrides({
        'paneProperties.background': themeColors.neutral8,
        'paneProperties.backgroundType': 'solid',
        'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
        'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
      })

      setChart(chart)
    })

    return () => {
      chart.remove()
      setChart(undefined)
    }
  }, [opts])

  return chart
}
