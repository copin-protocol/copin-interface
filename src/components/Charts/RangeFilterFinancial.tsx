import * as d3 from 'd3'

import { DrawChartData } from 'entities/chart'

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

function RangeFilterFinancial(
  prices: DrawChartData[],
  {
    width,
    height,
    label,
    onChange,
  }: { width: number; height: number; label: string; onChange: (params: { from: Date; to: Date }) => void }
) {
  const PRIMARY = '#4EAEFD'
  const RED = '#FA5547'
  const GREEN = '#38D060'
  const COLOR = '#777E90'
  // const BRUSH_BACKGROUND = '#4eaefd21'
  const BACKGROUND_COLOR = '#171B2B'
  const OFFSET = 8
  const MIN_DURATION = 1
  const btnWidth = 64
  const btnHeight = 32
  const btnOffset = 8
  const formatTime = d3.timeFormat('%Y/%m/%d')

  // const dateFormat = d3.timeParse('%Y-%m-%d')

  const margin = { top: 30, right: 65, bottom: 30, left: 0 },
    w = width - margin.left - margin.right,
    h = height - margin.top - margin.bottom

  const middleHandlerWidth = 10,
    middleHandlerStroke = '#FFF',
    middleHandlerFill = PRIMARY

  const wrapper = d3
    .create('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', `max-width: 100%; height: auto; height: intrinsic; background: ${BACKGROUND_COLOR}`)

  wrapper
    .append('text')
    .attr('font-size', 11)
    .attr('fill', COLOR)
    .attr('x', w + 8)
    .attr('y', 20)
    .text(label)
  wrapper
    .append('text')
    .attr('font-size', 11)
    .attr('fill', COLOR)
    .attr('x', margin.left + 10)
    .attr('y', 20)
    .text('Ctrl + Mouse to zoom chart')

  const svg = wrapper.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  d3.select('body')
    .on('keydown', (event) => {
      if (event.key === 'Meta' || event.key === 'Ctrl' || event.key === 'Alt') {
        d3.select('.overlay').style('cursor', 'grab')
        d3.select('.selection').style('cursor', 'grab')
      }
    })
    .on('keyup', (event) => {
      if (event.key === 'Meta' || event.key === 'Ctrl' || event.key === 'Alt') {
        d3.select('.overlay').style('cursor', 'crosshair')
        d3.select('.selection').style('cursor', 'move')
      }
    })

  const dates = prices.map((p) => p.time)

  let d0: number[]
  let duration: number
  // const xmin = d3.min(prices.map((r) => r.time))
  // const xmax = d3.max(prices.map((r) => r.time))
  let xScale = d3
    .scaleLinear()
    .domain([-OFFSET, dates.length - 1 + OFFSET])
    .range([0, w])
  let xScaleZ = d3
    .scaleLinear()
    .domain([-OFFSET, dates.length - 1 + OFFSET])
    .range([0, w])
  const xDateScale = d3
    .scaleQuantize()
    .domain([0, dates.length])
    .range(dates as any)
  let xBand = d3
    .scaleBand()
    .domain(d3.range(-OFFSET, dates.length - 1 + OFFSET) as any[])
    .range([0, w])
    .padding(0.3)
  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickPadding(0)
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
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis)

  // gX.selectAll('.tick text').call(wrap, xBand.bandwidth())

  const ymin = d3.min(prices.map((r) => r.low))
  const ymax = d3.max(prices.map((r) => r.high))
  const yScale = d3
    .scaleLinear()
    .domain([ymin, ymax] as any[])
    .range([h, 0])
    .nice()
  const yAxis = d3.axisRight(yScale).tickPadding(0)

  const gY = svg.append('g').attr('transform', `translate(${w},0)`).attr('class', 'axis y-axis').call(yAxis)

  const chartBody = svg.append('g').attr('class', 'chartBody').attr('clip-path', 'url(#clip)')

  // draw high and low
  const stems = chartBody
    .selectAll('g.line')
    .data(prices)
    .enter()
    .append('line')
    .attr('class', 'stem')
    .attr('x1', (d, i) => xScale(i) - xBand.bandwidth() / 2)
    .attr('x2', (d, i) => xScale(i) - xBand.bandwidth() / 2)
    .attr('y1', (d) => yScale(d.high))
    .attr('y2', (d) => yScale(d.low))
    .attr('stroke', (d) => COLOR)

  // draw rectangles
  const candles = chartBody
    .selectAll('.candle')
    .data(prices)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
    .attr('class', 'candle')
    .attr('y', (d) => yScale(Math.max(d.open, d.close)))
    .attr('width', xBand.bandwidth())
    .attr('height', (d) =>
      d.open === d.close ? 1 : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
    )
    .attr('fill', (d) => (d.open > d.close ? BACKGROUND_COLOR : COLOR))
    .attr('stroke', (d) => COLOR)

  svg
    .append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', w)
    .attr('height', h + margin.top + margin.bottom)
    .attr('y', -margin.top)

  const extent = [
    [0, 0],
    [w, h],
  ]

  const zoom = d3
    .zoom()
    .scaleExtent([1, w / dates.length / 2])
    .translateExtent(extent as any)
    .extent(extent as any)
    .filter((event: any) => event.altKey || event.metaKey || event.ctrlKey)
    .on('zoom', zoomed)

  svg.call(zoom as any).on('wheel', (event) => event.preventDefault())

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
  let isShowBtn = false
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
    .attr('width', '1')
    .attr('height', height)
    .attr('fill', middleHandlerFill)
    // .attr("stroke", middleHandlerFill)
    .attr('y', -height / 2)
    .attr('pointer-events', 'none')

  patternify(handle, {
    tag: 'circle',
    selector: 'custom-handle-rect-middle',
    data: (d: any) => [d],
  })
    .attr('r', middleHandlerWidth)
    .attr('fill', middleHandlerFill)
    .attr('stroke-width', 2)
    .attr('stroke', middleHandlerStroke)
    // .attr('cy', -middleHandlerWidth)
    // .attr('cx', -middleHandlerWidth)
    .attr('pointer-events', 'none')

  // patternify(handle, {
  //   tag: 'rect',
  //   selector: 'custom-handle-rect-line-left',
  //   data: (d: any) => [d],
  // })
  //   .attr('width', 0.5)
  //   .attr('height', 10)
  //   .attr('fill', middleHandlerStroke)
  //   .attr('stroke', middleHandlerStroke)
  //   .attr('y', -5)
  //   .attr('x', -middleHandlerWidth / 2 + 3)
  //   .attr('pointer-events', 'none')

  // patternify(handle, {
  //   tag: 'rect',
  //   selector: 'custom-handle-rect-line-right',
  //   data: (d: any) => [d],
  // })
  //   .attr('width', 0.5)
  //   .attr('height', 10)
  //   .attr('fill', middleHandlerStroke)
  //   .attr('stroke', middleHandlerStroke)
  //   .attr('y', -5)
  //   .attr('x', -middleHandlerWidth / 2 + middleHandlerWidth - 3)
  //   .attr('pointer-events', 'none')

  handle.attr('display', 'none')

  function output(value: any) {
    const node: any = svg.node()
    node.value = value
    node.value.data = getData(node.value.range)
    // node.value.range = value.range.map((d) => dateScale.invert(d));
    node.dispatchEvent(new CustomEvent('input'))
  }

  function setDuration(d: Date[]) {
    const from = new Date(d[0])
    const to = new Date(d[1])
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    duration = Math.floor((to.getTime() - from.getTime()) / (24 * 3600 * 1000))
  }

  function getData(range: number[]) {
    const dataCandles = candles
      .attr('fill', (d) => (d.open > d.close ? BACKGROUND_COLOR : COLOR))
      .attr('stroke', (d) => COLOR)
      .filter((d, i) => {
        return i >= range[0] && i <= range[1]
      })
      .attr('fill', (d) => (d.open === d.close ? COLOR : d.open > d.close ? RED : GREEN))
      .attr('stroke', (d) => (d.open === d.close ? COLOR : d.open > d.close ? RED : GREEN))
      .nodes()
      .map((d: any) => d.__data__)
      .map((d: any) => d.values)
      .reduce((a, b) => a.concat(b), [])

    stems
      .attr('stroke', (d) => COLOR)
      .filter((d, i) => {
        return i >= range[0] && i <= range[1]
      })
      .attr('stroke', (d) => (d.open === d.close ? COLOR : d.open > d.close ? RED : GREEN))
      .nodes()
      .map((d: any) => d.__data__)
      .map((d: any) => d.values)
      .reduce((a, b) => a.concat(b), [])

    return dataCandles
  }

  function drawBtn(s: number[]) {
    const brushBg = svg
      .append('rect')
      .attr('class', 'brushbg')
      .attr('width', Math.abs(s[0] - s[1]))
      .attr('height', height)
      .attr('y', -margin.top)
      .attr('x', Math.min(s[0], s[1]))
      .attr('fill', PRIMARY)
      .attr('opacity', 0.15)
      .attr('clip-path', 'url(#clip)')

    brushBg.lower()

    if (isShowBtn && duration >= MIN_DURATION) {
      const applyBtn = svg
        .append('g')
        .attr('class', 'setbtn')
        .attr('cursor', 'pointer')
        .attr('clip-path', 'url(#clip)')
        .on('click', () => {
          if (from && to) onChange({ from, to })
        })

      applyBtn
        .append('rect')
        .attr('fill', PRIMARY)
        .attr('class', 'setbtn')
        .attr('width', btnWidth)
        .attr('height', btnHeight)
        .attr('x', Math.max(s[0], s[1]) - btnWidth - btnOffset)
        .attr('y', h + margin.bottom - btnHeight - btnOffset)
        .attr('rx', 6)
        .attr('clip-path', 'url(#clip)')

      applyBtn
        .append('text')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('fill', '#0B0E18')
        .attr('x', Math.max(s[0], s[1]) - btnWidth + 14 - btnOffset)
        .attr('y', h + margin.bottom - btnHeight / 2 + 5 - btnOffset)
        .text('Apply')
        .attr('clip-path', 'url(#clip)')

      applyBtn.raise()
    }
    if (isShowBtn) {
      const resetBtn = svg
        .append('g')
        .attr('class', 'setbtn')
        .attr('cursor', 'pointer')
        .on('click', () => {
          isShowBtn = false
          select(originFrom, originTo)
        })

      resetBtn
        .append('rect')
        .attr('fill', 'rgba(255, 255, 255, 0.1)')
        // .attr('stroke', 'white')
        .attr('width', btnHeight)
        .attr('height', btnHeight)
        .attr('x', w - btnHeight - 8)
        .attr('y', -20)
        .attr('rx', 6)

      resetBtn
        .append('text')
        .attr('font-size', 24)
        .attr('fill', 'white')
        .attr('x', w - btnHeight)
        .attr('y', 2)
        .text('↻')

      resetBtn.raise()
    }
  }

  function drawBrush(s: number[]) {
    const d1 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)].map(
      (i: number) => prices[i].time
    )
    setDuration(d1)
    d3.selectAll('.brushbg').remove()
    d3.selectAll('.setbtn').remove()
    d3.selectAll('.btndesc').remove()

    if (duration >= MIN_DURATION) {
      svg
        .append('text')
        .attr('class', 'btndesc')
        .attr('font-size', 11)
        .attr('font-weight', 'bold')
        .attr('fill', 'white')
        .attr('x', s[0] + 8)
        .attr('y', -8)
        .attr('clip-path', 'url(#clip)')
        .text(`${formatTime(d1[0])} - ${formatTime(d1[1])}`)

      svg
        .append('text')
        .attr('class', 'btndesc')
        .attr('font-size', 11)
        .attr('fill', 'white')
        .attr('x', s[0] + 8)
        .attr('y', 8)
        .attr('clip-path', 'url(#clip)')
        .text(`${duration} days`)
    }

    handle.attr('display', null).attr('transform', function (_: any, i: number) {
      return 'translate(' + (s[i] - 2) + ',' + h / 2 + ')'
    })
    output({
      range: d0,
    })
  }

  function drawChart() {
    d3.selectAll('.gridline').remove()
    gX.call(
      d3.axisBottom(xScaleZ).tickFormat(function (i: any) {
        const d = dates[i]
        return d ? formatTime(d) : ''
      })
    )

    const xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])))
    const xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])))
    const filtered = prices.filter((d) => d.time >= xmin && d.time <= xmax)
    if (filtered.length === 0) return
    const minP = Math.min(...filtered.map((d) => d.low))
    const maxP = Math.max(...filtered.map((d) => d.high))
    const buffer = Math.floor((maxP - minP) * 0.1)

    yScale.domain([minP - buffer, maxP + buffer])

    gY.call(d3.axisRight(yScale))

    d3.selectAll('g.y-axis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', -w)
      .attr('y2', 0)
      .attr('opacity', 0.1)
      .attr('stroke', COLOR) // line color

    d3.selectAll('g.x-axis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('x1', 0)
      .attr('y1', -h)
      .attr('x2', 0)
      .attr('y2', 0)
      .attr('opacity', 0.1)
      .attr('stroke', COLOR) // line color

    candles
      .attr('y', (d) => yScale(Math.max(d.open, d.close)))
      .attr('height', (d) =>
        d.open === d.close ? 1 : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
      )

    stems.attr('y1', (d) => yScale(d.high)).attr('y2', (d) => yScale(d.low))

    const bw = xBand.bandwidth()

    candles.attr('width', bw).attr('x', (d, i) => xScaleZ(i) - bw / 2)
    stems.attr('x1', (d, i) => xScaleZ(i) - bw / 2 + bw * 0.5)
    stems.attr('x2', (d, i) => xScaleZ(i) - bw / 2 + bw * 0.5)
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

    d0 = s.map(xScaleZ.invert)
    d0 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)]
    const d1 = d0.map((i: number) => prices[i].time)

    setDuration(d1)
    // console.log(d0, d1)

    isShowBtn = true
    drawChart()
    drawBrush(s)
    drawBtn(s)
    from = d1[0]
    to = d1[1]

    // console.log('from', from)
    // console.log('to', to)
  }

  function brushed(event: any) {
    if (event.sourceEvent && event.sourceEvent.type === 'brush') return
    const s = event.selection
    d0 = event.selection.map(xScaleZ.invert)
    d0 = [Math.max(Math.round(d0[0]), 0), Math.min(Math.round(d0[1]), prices.length - 1)]
    drawBrush(s)
  }

  function zoomed(event: any) {
    // d3.select('.overlay').style('cursor', 'grabbing')
    // d3Event.stopPropagation()
    const t = event.transform

    // const xScaleZ = t.rescaleX(xScale)
    const range = xScale.range().map(t.invertX, t)
    const domain: number[] = range.map(xScale.invert as any, xScale)
    xScaleZ = xScale.copy().domain([Math.max(-OFFSET, domain[0]), Math.min(dates.length - 1 + OFFSET, domain[1])])
    xBand = d3
      .scaleBand()
      .domain(d3.range(xScaleZ.domain()[0], xScaleZ.domain()[1]) as any[])
      .range([0, w])
      .padding(0.3)
    drawChart()
    // const hideTicksWithoutLabel = function () {
    //   d3.selectAll('.xAxis .tick text').each(function (d) {
    //     if (this.innerHTML === '') {
    //       this.parentNode.style.display = 'none'
    //     }
    //   })
    // }
    // hideTicksWithoutLabel()

    brush.call(brushX.move, [d0[0], d0[1]].map(xScaleZ))
    const s = d0?.map(xScaleZ)
    drawBtn(s)
    // gX.selectAll('.tick text').call(wrap, xBand.bandwidth())
  }
  function wrap(text: d3.Selection<any, any, any, any>, width: number) {
    text.each(function () {
      const text = d3.select(this),
        words = text.text().split(/\n+/).reverse(),
        lineHeight = 1.1, // ems
        y = text.attr('y'),
        dy = parseFloat(text.attr('dy'))
      let word,
        line: any[] = [],
        lineNumber = 0,
        tspan: any = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', dy + 'em')
      while ((word = words.pop())) {
        line.push(word)
        tspan.text(line.join('\n'))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join('\n'))
          line = [word]
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word)
        }
      }
    })
  }
  const select = (from: Date, to: Date) => {
    originFrom = from
    originTo = to
    const [fromIndex, toIndex] = getSelection(from, to)
    if (fromIndex == null || toIndex == null) return
    // const selection = [xScale(fromIndex), xScale(toIndex)]
    isShowBtn = false
    const offset = toIndex - fromIndex + 1
    xScale = xScale.domain([
      Math.max(fromIndex - offset, -OFFSET),
      Math.min(toIndex + offset, dates.length - 1 + OFFSET),
    ])
    xScaleZ = xScale.copy()

    xBand = d3
      .scaleBand()
      .domain(d3.range(xScaleZ.domain()[0], xScaleZ.domain()[1]) as any[])
      .range([0, w])
      .padding(0.3)

    const [xMin, xMax] = xScale.domain().map(xScale)

    const bandwidth = xBand.bandwidth()

    const scaleRatio = (xMax - xMin) / (32 * bandwidth)

    const w0 = xScale(0)
    const wN = xScale(dates.length - 1)

    zoom.scaleExtent([(toIndex - fromIndex + 1) / dates.length, scaleRatio]).translateExtent([
      [w0 - bandwidth * 16, 0],
      [wN + bandwidth * 16, h],
    ])

    drawChart()
    brush.call(brushX.move, [fromIndex, toIndex].map(xScaleZ))
  }
  return { plot: wrapper.node(), select }
}

export default RangeFilterFinancial
