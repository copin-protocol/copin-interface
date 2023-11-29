import * as d3 from 'd3'

import { generateAvatar } from 'utils/helpers/generateAvatar'

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot
export function applyAttr(selection: any, name: string, value: any) {
  if (value != null) selection.attr(name, value)
}

const idGenerator = () => {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return 'a' + S4() + S4()
}

const hover = (tip: any, pos: number[], text: string[], url: string) => {
  const side_padding = 10
  const vertical_padding = 8
  const vertical_offset = 32

  // Empty it out
  tip.selectAll('*').remove()

  // Append the text
  tip
    .style('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
    .style('font-size', '12')
    .attr('transform', `translate(${pos[0]}, ${pos[1] + 7})`)
    .selectAll('text')
    .data(text)
    .join('text')
    .attr('y', (d: any, i: number) => (i - (text.length - 1)) * 15 - vertical_offset)
    .append('svg:a')
    .attr('xlink:href', url)
    .attr('target', '_blank')
    .text((d: any) => d)

  const bbox = tip.node().getBBox()

  // Add a rectangle (as background)
  tip
    .append('rect')
    .attr('y', bbox.y - vertical_padding)
    .attr('x', bbox.x - side_padding)
    .attr('width', bbox.width + side_padding * 2)
    .attr('height', bbox.height + vertical_padding * 2)
    .style('fill', 'white')
    .style('stroke', '#ccc')
    .lower()
}

function Scatterplot(
  data: any[],
  {
    x = ([x]: any) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]: any) => y, // given d in data, returns the (quantitative) y-value
    r = 3, // (fixed) radius of dots, in pixels
    title, // given d in data, returns the title
    url, // given d in data, returns the url
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = r * 2, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = inset, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    fill = 'none', // fill color for dots
    stroke = 'currentColor', // stroke color for the dots
    strokeWidth = 2, // stroke width for dots
    onSelect,
    onDeselect,
  } = {} as any
) {
  // Compute values.
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  // const T = title == null ? null : d3.map(data, title);
  const I = d3.range(X.length).filter((i) => !isNaN(X[i] as any) && !isNaN(Y[i] as any))

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X as any)
  if (yDomain === undefined) yDomain = d3.extent(Y as any)

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange)
  const yScale = yType(yDomain, yRange)
  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat)
  const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat)

  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('y2', marginTop + marginBottom - height)
        .attr('stroke-opacity', 0.2)
    )
    .call((g) =>
      g
        .append('text')
        .attr('font-size', 13)
        .attr('x', width)
        .attr('y', marginBottom - 4)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(xLabel)
    )

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('x2', width - marginLeft - marginRight)
        .attr('stroke-opacity', 0.2)
    )
    .call((g) =>
      g
        .append('text')
        .attr('font-size', 13)
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(yLabel)
    )

  const dotParent = svg.append('g').attr('class', 'dot-parent').attr('fill', fill)

  dotParent
    .selectAll('rect')
    .data(I)
    .join('rect')
    .attr('x', (i) => xScale(X[i]) - 10)
    .attr('y', (i) => yScale(Y[i]) - 10)
    .attr('rx', 20)
    .attr('width', 20)
    .attr('height', 20)
    .attr('id', (i) => `avt-bg${i}`)
    .attr('cursor', 'pointer')
    .style('fill', (i: number) => generateAvatar(title(data[i])).bg)
  dotParent
    .selectAll('text')
    .data(I)
    .join('text')
    .attr('x', (i) => xScale(X[i]) - 8)
    .attr('y', (i) => yScale(Y[i]) + 6)
    .attr('id', (i) => `avt-emoji${i}`)
    .attr('fill', 'white')
    .attr('cursor', 'pointer')
    .text((i: number) => generateAvatar(title(data[i])).emoji)

  svg.style('overflow', 'visible') // to avoid clipping at the edges
  // Set pointer events to visibleStroke if the fill is none (e.g., if its a line)
  svg.selectAll('path').each(function () {
    // For line charts, set the pointer events to be visible stroke
    if (d3.select(this).attr('fill') === null || d3.select(this).attr('fill') === 'none') {
      d3.select(this).style('pointer-events', 'visibleStroke')
    }
  })

  const tip = svg
    .selectAll('.chart-tooltip')
    .data([1])
    .join('g')
    .attr('class', 'chart-tooltip')
    .style('text-anchor', 'middle')

  // Add a unique id to the chart for styling
  const id = idGenerator()
  // Add the event listeners
  svg.classed(id, true) // using a class selector so that it doesn't overwrite the ID

  const select = (i: number) => {
    dotParent.selectAll('circle').remove()
    dotParent.append('circle').attr('cx', xScale(X[i])).attr('cy', yScale(Y[i])).attr('r', '12').attr('fill', 'white')
    // Raise it
    dotParent.selectAll(`#avt-bg${i}`).raise()
    dotParent.selectAll(`#avt-emoji${i}`).raise()
  }
  const deselect = (i: number) => {
    tip.selectAll('*').remove()
    dotParent.selectAll('circle').remove()
    // Lower it!
    dotParent.selectAll(`#avt-bg${i}`).lower()
    dotParent.selectAll(`#avt-emoji${i}`).lower()
  }

  dotParent.selectAll('text').each(function (_: any, i: number) {
    // Get the text out of the title, set it as an attribute on the parent, and remove it
    const dot = d3.select(this) // title element that we want to remove

    // Mouse events
    dot
      .on('click', function (event) {
        event.stopPropagation()
        tip.attr('clicked', true)
      })
      .on('pointerenter', function (event) {
        onSelect(i)
        tip.attr('clicked', false)
        const text = title(data[i])
        const pointer = [event.offsetX, event.offsetY]
        if (text) tip.call(hover, pointer, text.split('\n'), url(data[i]))
        else tip.selectAll('*').remove()
        // Keep within the parent horizontally
        const tipSize = (tip as any).node().getBBox()
        if (pointer[0] + tipSize.x < 0) tip.attr('transform', `translate(${tipSize.width / 2}, ${pointer[1] + 7})`)
        else if (pointer[0] + tipSize.width / 2 > Number(svg.attr('width')))
          tip.attr('transform', `translate(${Number(svg.attr('width')) - tipSize.width / 2}, ${pointer[1] + 7})`)
      })
      .on('pointerout', function (event) {
        if (tip.attr('clicked') != 'true') {
          onDeselect()
        }
      })
  })

  svg.on('click', function (event) {
    tip.attr('clicked', false)
    onDeselect()
  })

  return { plot: svg.node(), select, deselect }
}

export default Scatterplot
