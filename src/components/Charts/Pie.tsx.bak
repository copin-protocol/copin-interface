import * as d3 from 'd3'

const Pie = (
  data: any[],
  {
    width = 350, // outer width, in pixels
    height = 270, // outer height, in pixels
  }: any
) => {
  const GRAY = '#777E90'
  const LIGHT_GRAY = '#C0C0C9'
  const WHITE = '#FCFCFD'
  const BLACK = '#0B0E18'
  const svg = d3.create('svg').attr('height', height).attr('width', width)

  const radius = Math.min(width * 0.5, height * 0.5) / 2

  const outerScale = d3.scaleLinear().range([0, radius]).domain([0, 100])

  const arc = d3
    .arc()
    .innerRadius(radius / 4)
    .outerRadius((d: any) => outerScale(d.value) + radius / 4)
    .padRadius(0.25 * radius)
    .padAngle(2 / (0.65 * radius))

  const arcLabel = d3
    .arc()
    .innerRadius(radius * 1.7)
    .outerRadius(radius * 1.7)

  const pie = d3
    .pie()
    .sort(null)
    .value((d: any) => d.value)

  let arcs = pie(data)

  arcs = arcs.map((arc, i) => ({
    ...arc,
    startAngle: (i * 2 * Math.PI) / data.length,
    endAngle: ((i + 1) * 2 * Math.PI) / data.length,
  }))

  const chart = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

  chart
    .append('g')
    // .attr("stroke", "black")
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', (d: any) => d.data.color)
    .attr('d', arc as any)
    .append('title')
    .text((d: any) => `${d.data.name}: ${d.data.value.toLocaleString()}`)

  chart
    .append('g')
    .attr('stroke-width', '0.5')
    .attr('stroke', LIGHT_GRAY)
    .selectAll('path')
    .data(arcs.map((a) => ({ ...a, value: 100 })))
    .join('path')
    .attr('fill', 'none')
    .attr('d', arc as any)
  // chart
  //   .append('circle')
  //   .attr('fill', BLACK)
  //   .attr('r', radius / 4 + 0.5)
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  chart
    .append('circle')
    .attr('fill', 'none')
    .attr('opacity', '0.25')
    .attr('stroke', LIGHT_GRAY)
    .attr('stroke-width', '0.5')
    .attr('stroke-dasharray', '0 4 0')
    .attr('r', (4 * outerScale(100)) / 5 + radius / 4)
    .attr('cx', 0)
    .attr('cy', 0)
  chart
    .append('circle')
    .attr('fill', 'none')
    .attr('opacity', '0.25')
    .attr('stroke', LIGHT_GRAY)
    .attr('stroke-width', '0.5')
    .attr('stroke-dasharray', '0 4 0')
    .attr('r', (3 * outerScale(100)) / 5 + radius / 4)
    .attr('cx', 0)
    .attr('cy', 0)
  chart
    .append('circle')
    .attr('fill', 'none')
    .attr('opacity', '0.25')
    .attr('stroke', LIGHT_GRAY)
    .attr('stroke-width', '0.5')
    .attr('stroke-dasharray', '0 4 0')
    .attr('r', (2 * outerScale(100)) / 5 + radius / 4)
    .attr('cx', 0)
    .attr('cy', 0)
  chart
    .append('circle')
    .attr('fill', 'none')
    .attr('opacity', '0.25')
    .attr('stroke', LIGHT_GRAY)
    .attr('stroke-width', '0.5')
    .attr('stroke-dasharray', '0 4 0')
    .attr('r', outerScale(100) / 5 + radius / 4)
    .attr('cx', 0)
    .attr('cy', 0)

  chart
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('fill', GRAY)
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(arcs)
    .join('text')
    .attr('transform', (d: any) => `translate(${arcLabel.centroid(d)})`)
    .call((text: any) =>
      text
        .append('tspan')
        .attr('x', 0)
        .attr('y', 0)
        .text((d: any) => d.data.name)
    )

  return svg.node()
}

export default Pie
