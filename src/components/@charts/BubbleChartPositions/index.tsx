import * as d3 from 'd3'

import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export type BubbleChartData = {
  id: string
  value: number
  token: string
  leverage: number
  title: string
  isLong: boolean
  protocol: ProtocolEnum
}

function shuffle(array: BubbleChartData[]) {
  let currentIndex = array.length,
    randomIndex
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

function findMax(array: BubbleChartData[]) {
  let maxVal = 0
  let maxIndex = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i].value > maxVal) {
      maxVal = array[i].value
      maxIndex = i
    }
  }
  return maxIndex
}

const BubbleChart = (
  data: BubbleChartData[],
  {
    onSelect,
    width = 500, // outer width, in pixels
    height = 500, // outer height, in pixels
  }: any
) => {
  const margin = 1 // to avoid clipping the root circle stroke

  const FONT_SIZE = Math.floor(Math.min(width, height) / 40)

  const svg = d3
    .create('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('viewBox', [-margin, -margin, width, height])
    .attr('style', `max-width: 100%; height: auto; font-size: ${FONT_SIZE}px;`)
    .attr('text-anchor', 'middle')

  // const shuffleData = shuffle([...data])

  // Create the pack layout.
  const pack = d3
    .pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3)

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  // @ts-ignore
  const root = pack(d3.hierarchy({ children: data }).sum((d) => d.value))

  const maxIndex = findMax(data)
  const maxR = root.leaves()[maxIndex].r

  const g = svg.append('g')

  const longDefs = g.append('defs')

  //Create a radial Sun-like gradient
  longDefs
    .append('radialGradient')
    .attr('id', 'long-gradient')
    .attr('cx', '20%') //not really needed, since 50% is the default
    .attr('cy', '20%') //not really needed, since 50% is the default
    .attr('r', '100%') //not really needed, since 50% is the default
    .selectAll('stop')
    .data([
      { offset: '0%', color: '#82E871' },
      { offset: '60%', color: '#49D657' },
      { offset: '100%', color: '#37BC44' },
    ])
    .enter()
    .append('stop')
    .attr('offset', function (d) {
      return d.offset
    })
    .attr('stop-color', function (d) {
      return d.color
    })

  const shortDefs = g.append('defs')

  //Create a radial Sun-like gradient
  shortDefs
    .append('radialGradient')
    .attr('id', 'short-gradient')
    .attr('cx', '20%') //not really needed, since 50% is the default
    .attr('cy', '20%') //not really needed, since 50% is the default
    .attr('r', '100%') //not really needed, since 50% is the default
    .selectAll('stop')
    .data([
      { offset: '0%', color: themeColors.red1 },
      { offset: '60%', color: '#EB3A4A' },
      { offset: '100%', color: themeColors.red3 },
    ])
    .enter()
    .append('stop')
    .attr('offset', function (d) {
      return d.offset
    })
    .attr('stop-color', function (d) {
      return d.color
    })

  // Place each (leaf) node according to the layout’s x and y values.
  const node = g
    .selectAll('.node')
    .data(root.leaves(), (d: any) => d.data.id)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('cursor', 'pointer')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .on('click', (e, d) => onSelect(d.data))
    .on('mouseover', function () {
      d3.select(this)
        .transition()
        .duration(360)
        .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(0.9)`)
    })
    .on('mouseout', function () {
      d3.select(this)
        .transition()
        .duration(360)
        .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(1)`)
    })

  // Add a title.
  // @ts-ignore
  // node.append('title').text((d) => `${d.data.id}: ${format(d.value)}`)

  // Add a filled circle.
  node
    .append('circle')
    // .transition()
    // .duration(600)
    // @ts-ignore
    .style('fill', (d) => (d.data.isLong ? 'url(#long-gradient)' : 'url(#short-gradient)'))
    .attr('r', (d) => d.r)

  // Add a label.
  const text = node
    .append('text')
    .attr('clip-path', (d) => `circle(${d.r})`)
    .attr('font-size', (d) => `${Math.min((d.r * FONT_SIZE) / maxR, FONT_SIZE)}px`)

  text
    // .selectAll()
    // @ts-ignore
    .append('tspan')
    .attr('class', 'title')
    // .transition()
    // .delay(600)
    .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
    .attr('x', 0)
    .attr('y', '-1em')
    .attr('fill-opacity', 0.7)
    // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
    // @ts-ignore
    .text((d) => d.data.title)

  text
    // .selectAll()
    // @ts-ignore
    .append('tspan')
    .attr('class', 'title')
    // .transition()
    // .delay(600)
    .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
    .attr('font-weight', 'bold')
    .attr('x', 0)
    .attr('y', '0.5em')
    // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
    // @ts-ignore
    .text((d) => d.data.token)

  // Add a tspan for the node’s value.
  text
    .append('tspan')
    .attr('class', 'desc')
    // .transition()
    // .delay(600)
    .attr('x', 0)
    .attr('y', '2em')
    // @ts-ignore
    // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 1.6}em`)
    .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
    .attr('fill-opacity', 0.7)
    // @ts-ignore
    .text((d) => `$${compactNumber(d.value)} | ${formatNumber(d.data.leverage, 1, 1)}x`)

  svg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ] as any)
      .scaleExtent([1, 100])
      .on('zoom', zoomed) as any
  )

  function zoomed({ transform }: any) {
    g.attr('transform', transform)
  }

  const onDataUpdated = (data: BubbleChartData[]) => {
    const newRoot = pack(d3.hierarchy({ children: data }).sum((d: any) => d.value) as any)

    const maxIndex = findMax(data)
    const maxR = newRoot.leaves()[maxIndex].r

    const node = g.selectAll('.node').data(newRoot.leaves(), (d: any) => {
      return d.data.id
    })

    // capture the enter selection
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      .on('click', (e, d) => onSelect(d.data))
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(360)
          .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(0.9)`)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(360)
          .attr('transform', (d: any) => `translate(${d.x},${d.y}) scale(1)`)
      })

    // re-use enter selection for titles
    // nodeEnter.append('title').text((d: any) => `${d.data.id}: ${format(d.value)}`)

    // Add a label.
    const text = nodeEnter
      .append('text')
      .attr('clip-path', (d) => `circle(${d.r})`)
      .attr('font-size', (d) => `${Math.min((d.r * FONT_SIZE) / maxR, FONT_SIZE)}px`)

    // re-use enter selection for circles
    nodeEnter
      .append('circle')
      // .transition()
      // .duration(600)
      // @ts-ignore
      .style('fill', (d: any) => (d.data.isLong ? 'url(#long-gradient)' : 'url(#short-gradient)'))
      .attr('r', (d: any) => d.r)

    // Add a tspan for each CamelCase-separated word.
    text
      // .selectAll()
      // @ts-ignore
      .append('tspan')
      .attr('class', 'title')
      .attr('font-weight', 'bold')
      // .transition()
      // .delay(600)
      .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
      .attr('x', 0)
      .attr('y', '-1em')
      .attr('fill-opacity', 0.7)
      // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      // @ts-ignore
      .text((d) => d.data.title)

    text
      // .selectAll()
      // @ts-ignore
      .append('tspan')
      .attr('class', 'title')
      // .transition()
      // .delay(600)
      .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
      .attr('font-weight', 'bold')
      .attr('x', 0)
      .attr('y', '0.5em')
      // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      // @ts-ignore
      .text((d) => d.data.token)

    // Add a tspan for the node’s value.
    text
      .append('tspan')
      .attr('class', 'desc')
      // .transition()
      // .delay(600)
      .attr('x', 0)
      .attr('y', '2em')
      // @ts-ignore
      // .attr('y', (d, i, nodes) => `${i - nodes.length / 2 + 1.6}em`)
      .attr('fill', (d: any) => (d.data.isLong ? 'black' : 'white'))
      .attr('fill-opacity', 0.7)
      // @ts-ignore
      .text((d) => `$${compactNumber(d.value)} | ${formatNumber(d.data.leverage, 1, 1)}x`)

    node
      .select('circle')
      .transition()
      .duration(1000)
      .style('fill', (d: any) => (d.data.isLong ? 'url(#long-gradient)' : 'url(#short-gradient)'))
      .attr('r', (d: any) => d.r)

    node
      .transition()
      .attr('class', 'node')
      .attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

    node
      .select('text')
      .transition()
      .duration(1000)
      .attr('clip-path', (d) => `circle(${d.r})`)
      .attr('font-size', (d: any) => `${Math.min((d.r * FONT_SIZE) / maxR, FONT_SIZE)}px`)

    text.raise()

    node.exit().remove()
    return svg.node()
  }

  return {
    node: svg.node(),
    onDataUpdated,
  }
}

export default BubbleChart
