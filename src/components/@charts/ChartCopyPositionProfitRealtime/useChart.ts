import React from 'react'

import { themeColors } from 'theme/colors'

import { ChartingLibraryWidgetOptions, IChartingLibraryWidget } from '../../../../public/static/charting_library'
import { widget as TVWidget } from '../../../../public/static/charting_library/charting_library.esm'

function __DEBUG__(code: string, ...msgs: any[]) {
  return
  console.warn('CHART_DEBUGGER', code, ...msgs)
}

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

    __DEBUG__('X7', 'Create RealtimeChart')

    const chart: IChartingLibraryWidget = new TVWidget(opts)

    chart.onChartReady(() => {
      __DEBUG__('X8', 'RealtimeChart On Ready')
      chart.activeChart().getSeries().setChartStyleProperties(1, {
        upColor: themeColors.green1,
        downColor: themeColors.red1,
        borderUpColor: themeColors.green1,
        borderDownColor: themeColors.red1,
        wickUpColor: themeColors.green1,
        wickDownColor: themeColors.red1,
      })

      chart.applyOverrides({
        'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
        'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
      })

      setChart(chart)
      __DEBUG__('X9', 'set did chart render true')
    })

    return () => {
      __DEBUG__('X10', 'Reset chart')
      chart.remove()
      setChart(undefined)
    }
  }, [opts])

  return chart
}
