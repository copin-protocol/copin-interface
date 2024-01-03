import * as d3 from 'd3'

import { DrawChartData } from 'entities/chart'
import { themeColors } from 'theme/colors'

const patternify = (container: any, params: any) => {
  const selector = params.selector
  const elementTag = params.tag
  const data = params.data || [selector]

  // Pattern in action
  let selection = container.selectAll('.' + selector).data(data, (d: any, i: number) => {
    if (typeof d === 'object') {
      if (d.id) {
        return d.id
      }
    }
    return i
  })
  selection.exit().remove()
  selection = selection.enter().append(elementTag).merge(selection)
  selection.attr('class', selector)
  return selection
}

function BrushBar(
  prices: DrawChartData[],
  {
    width,
    height,
    label,
    onChange,
    disabled,
  }: {
    width: number
    height: number
    label: string
    disabled?: boolean
    onChange: (params: { from: Date; to: Date }) => void
  }
) {
  const COLOR = themeColors.neutral3
  // const BRUSH_BACKGROUND = '#4eaefd21'
  const BACKGROUND_COLOR = '#171B2B'
  const formatTime = d3.timeFormat('%Y/%m')

  // const dateFormat = d3.timeParse('%Y-%m-%d')

  const margin = { top: 4, right: 4, bottom: 24, left: 4 },
    w = width - margin.left - margin.right,
    h = height - margin.top - margin.bottom

  const wrapper = d3
    .create('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', `max-width: 100%; height: auto; height: intrinsic; background: ${BACKGROUND_COLOR}`)

  wrapper
    .append('text')
    .attr('font-size', 12)
    .attr('fill', COLOR)
    .attr('x', w + 8)
    .attr('y', 20)
    .text(label)

  const svg = wrapper.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const dates = prices.map((p) => p.time)

  let d0: number[]
  let duration: number
  // const xmin = d3.min(prices.map((r) => r.time))
  // const xmax = d3.max(prices.map((r) => r.time))
  const xScale = d3
    .scaleLinear()
    .domain([0, prices.length - 1])
    .range([0, w])
  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickPadding(0)
    .tickSizeOuter(0)
    .tickSizeInner(0)
    .tickFormat(function (i: any) {
      const d = dates[i]
      return d ? formatTime(d) : ''
    })

  svg
    .append('rect')
    .attr('id', 'rect')
    .attr('width', w)
    .attr('height', h)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('clip-path', 'url(#clip)')

  const gX = svg
    .append('g')
    .attr('class', 'axis x-axis') //Assign "axis" class
    .attr('transform', 'translate(0,' + (h + 8) + ')')
    .call(xAxis)

  gX.select('.domain').attr('stroke-width', '0')
  gX.selectAll('.tick').attr('color', themeColors.neutral3).attr('font-size', '12px')

  // gX.selectAll('.tick text').call(wrap, xBand.bandwidth())

  const ymin = d3.min(prices.map((r) => r.close))
  const ymax = d3.max(prices.map((r) => r.close))
  const yScale = d3
    .scaleLinear()
    .domain([ymin, ymax] as any[])
    .range([h, 0])
    .nice()
  // const yAxis = d3.axisRight(yScale).tickPadding(0)

  // const gY = svg.append('g').attr('transform', `translate(${w},0)`).attr('class', 'axis y-axis').call(yAxis)

  const chartBody = svg.append('g').attr('class', 'chartBody').attr('clip-path', 'url(#clip)')

  const line = d3
    .line()
    .x((d: any, i) => xScale(i))
    .y((d: any) => yScale(d.close))

  svg
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', themeColors.neutral3)
    .attr('stroke-width', 1.5)
    .attr('d', line(prices as any))

  svg
    .append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', w)
    .attr('height', h + margin.top + margin.bottom)
    .attr('y', -margin.top)

  const getDateIndexForward = (date: Date) => {
    for (let i = 0; i <= dates.length - 1; i++) {
      if (date.getTime() <= dates[i].getTime()) return i
    }
    return null
  }
  const getDateIndexBackward = (date: Date) => {
    for (let i = dates.length - 1; i >= 0; i--) {
      if (date.getTime() >= dates[i].getTime()) return i
    }
    return null
  }
  const getSelection = (from: Date, to: Date) => {
    const fromIndex = getDateIndexForward(from)
    const toIndex = getDateIndexBackward(to)
    return [fromIndex, toIndex]
  }
  let from: Date, to: Date, originFrom: Date, originTo: Date

  const brushX = d3
    .brushX()
    .extent([
      [0, 0],
      [w, h],
    ])
    .filter((event: any) => !event.altKey && !event.metaKey && !event.ctrlKey)
    .on('start', brushStarted)
    .on('end', brushEnded)
    .on('brush', brushed) as any
  const brush = svg.append('g').attr('class', 'brush').call(brushX).attr('clip-path', 'url(#clip)')

  const middleHandlerWidth = 10,
    middleHandlerStroke = '#FFF',
    middleHandlerFill = themeColors.primary1

  brush.select('.selection').attr('stroke-width', '0').attr('fill', middleHandlerFill)

  const handle = patternify(brush, {
    tag: 'g',
    selector: 'custom-handle',
    data: [
      {
        left: true,
      },
      {
        left: false,
      },
    ],
  })
    .attr('cursor', 'ew-resize')
    .attr('pointer-events', 'all')

  patternify(handle, {
    tag: 'rect',
    selector: 'custom-handle-rect',
    data: (d: any) => [d],
  })
    .attr('width', '10px')
    .attr('height', h)
    .attr('fill', middleHandlerFill)
    .attr('x', -5)
    .attr('y', -h / 2)
    .attr('pointer-events', 'none')

  patternify(handle, {
    tag: 'rect',
    selector: 'custom-handle-rect-line-left',
    data: (d: any) => [d],
  })
    .attr('width', 0.5)
    .attr('height', 10)
    .attr('fill', middleHandlerStroke)
    .attr('stroke', middleHandlerStroke)
    .attr('y', -5)
    .attr('x', -middleHandlerWidth / 2 + 3)
    .attr('pointer-events', 'none')

  patternify(handle, {
    tag: 'rect',
    selector: 'custom-handle-rect-line-right',
    data: (d: any) => [d],
  })
    .attr('width', 0.5)
    .attr('height', 10)
    .attr('fill', middleHandlerStroke)
    .attr('stroke', middleHandlerStroke)
    .attr('y', -5)
    .attr('x', -middleHandlerWidth / 2 + middleHandlerWidth - 3)
    .attr('pointer-events', 'none')

  handle.attr('display', 'none')

  function setDuration(d: Date[]) {
    const from = new Date(d[0])
    const to = new Date(d[1])
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    duration = Math.floor((to.getTime() - from.getTime()) / (24 * 3600 * 1000))
  }

  function drawBrush(s: number[]) {
    const d1 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)].map((i: number) => {
      return prices[i].time
    })
    setDuration(d1)

    handle.attr('display', null).attr('transform', function (_: any, i: number) {
      return 'translate(' + (s[i] - 2) + ',' + h / 2 + ')'
    })
  }

  function brushStarted() {
    // if (event.selection) {
    //   startSelection = event.selection[0]
    // }
  }

  function brushEnded(event: any) {
    if (!event.selection || !event.mode) {
      // handle.attr("display", "none");

      // output({
      //   range: [0, 0],
      // });
      return
    }
    if (event.sourceEvent && event.sourceEvent.type === 'brush') return

    const s = event.selection

    d0 = s.map(xScale.invert)
    d0 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)]
    const d1 = d0.map((i: number) => prices[i].time)

    setDuration(d1)
    // console.log(d0, d1)
    drawBrush(s)
    from = d1[0]
    to = d1[1]
    onChange({ from, to })
  }

  function brushed(event: any) {
    if (event.sourceEvent && event.sourceEvent.type === 'brush') return
    const s = event.selection
    d0 = event.selection.map(xScale.invert)
    d0 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)]
    drawBrush(s)
  }

  const select = (from: Date, to: Date) => {
    originFrom = from
    originTo = to
    const [fromIndex, toIndex] = getSelection(from, to)
    if (fromIndex == null || toIndex == null) return null
    // const selection = [xScale(fromIndex), xScale(toIndex)]

    brush.call(brushX.move, [fromIndex, toIndex].map(xScale))
    return wrapper.node()
  }
  return { node: wrapper.node(), select }
}

export default BrushBar
