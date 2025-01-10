import { PositionData, TraderData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Colors } from 'theme/types'
import { FONT_FAMILY } from 'utils/config/constants'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { ELEMENT_IDS } from 'utils/config/keys'

import { calcLiquidatePrice, calcOpeningPnL, calcOpeningROI } from './calculate'
import formatTokenPrices, { addressShorten, formatDuration, formatLeverage, formatNumber, formatPrice } from './format'
import { generateAvatar } from './generateAvatar'
import { getSymbolFromPair } from './transform'

export const generateTraderCanvas = ({
  address,
  protocol,
  type,
  stats,
  colors,
  logoImg,
  protocolImg,
}: {
  address: string
  protocol: ProtocolEnum
  type: TimeFrameEnum
  stats: TraderData | undefined
  colors: Colors
  logoImg: HTMLImageElement
  protocolImg: HTMLImageElement
}) => {
  const canvasWidth = 1220
  const canvasHeight = 640
  const rightWidth = 300
  const leftWidth = canvasWidth - rightWidth
  const chartPnlContainer = document.getElementById(ELEMENT_IDS.TRADER_CHART_PNL)
  const chartComponentContainers = chartPnlContainer?.getElementsByTagName('tr')
  const lineCanvases = chartComponentContainers?.[0]?.getElementsByTagName('canvas')
  const xAxises = chartComponentContainers?.[1]?.getElementsByTagName('canvas')

  // const canvas = document.getElementById('canvas-share') as HTMLCanvasElement
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const leftCanvas = document.createElement('canvas')
  leftCanvas.width = canvasWidth - rightWidth
  leftCanvas.height = canvasHeight
  const rightCanvas = document.createElement('canvas')
  rightCanvas.width = rightWidth
  rightCanvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  const leftCtx = leftCanvas.getContext('2d')
  const rightCtx = rightCanvas.getContext('2d')
  if (!ctx || !leftCtx || !rightCtx) return

  ctx.fillStyle = colors.neutral7
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // draw statistics
  const statsGap = canvasHeight / 3
  const titleStatsFontSize = 40
  const valueStatsFontSize = 56
  const titleAndValueGap = 20
  const titleStartY = statsGap / 2 - titleAndValueGap / 2 - titleStatsFontSize / 2
  rightCtx.textAlign = 'center'
  rightCtx.textBaseline = 'middle'
  rightCtx.fillStyle = colors.neutral2
  rightCtx.font = `${titleStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText('Trades', rightWidth / 2, titleStartY)
  rightCtx.fillText('Win Rate', rightWidth / 2, titleStartY + statsGap)
  rightCtx.fillText('Profit rate', rightWidth / 2, titleStartY + statsGap * 2)

  const valueStartY = titleStartY + titleStatsFontSize + titleAndValueGap
  rightCtx.fillStyle = colors.neutral1
  rightCtx.font = `700 ${valueStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText(stats?.totalTrade ? formatNumber(stats?.totalTrade, 0, 0) : '--', rightWidth / 2, valueStartY)
  rightCtx.fillText(
    stats?.winRate ? `${formatNumber(stats?.winRate, 1, 1)}%` : '--',
    rightWidth / 2,
    valueStartY + statsGap
  )
  rightCtx.fillText(
    stats?.profitRate ? `${formatNumber(stats?.profitRate, 1, 1)}%` : '--',
    rightWidth / 2,
    valueStartY + statsGap * 2
  )

  // draw avatar & address
  generateAvatarAddress({ address, colors, canvas: leftCtx })

  // draw protocol
  generateProtocol({ protocol, protocolImg, colors, canvas: leftCtx, width: leftWidth })

  // draw chart pnl
  const chartAreaOffsetY = 120
  const chartAreaHeight = 430
  const chartFooterHeight = 50
  leftCtx.fillStyle = colors.neutral5
  leftCtx.fillRect(0, chartAreaOffsetY, leftWidth, chartAreaHeight)
  // text
  leftCtx.font = `500 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'center'
  leftCtx.fillStyle = colors.neutral1
  leftCtx.textBaseline = 'top'
  let time = ''
  switch (type) {
    case TimeFrameEnum.A_WEEK:
      time = '7'
      break
    case TimeFrameEnum.TWO_WEEK:
      time = '14'
      break
    case TimeFrameEnum.A_MONTH:
      time = '30'
      break
    case TimeFrameEnum.TWO_MONTH:
      time = '60'
      break
    case TimeFrameEnum.ALL_TIME:
      time = 'all'
      break
    default:
      break
  }
  leftCtx.fillText(`PNL in ${time} days`, leftWidth / 2, chartAreaOffsetY + 36)

  leftCtx.font = `700 56px ${FONT_FAMILY}`
  leftCtx.textAlign = 'center'
  leftCtx.fillStyle = !stats
    ? colors.neutral1
    : stats.pnl > 0
    ? colors.green1
    : stats.pnl < 0
    ? colors.red2
    : colors.neutral1
  leftCtx.fillText(
    stats ? `$${formatNumber(stats?.pnl, 0, 0)}` : 'No Trading Data',
    leftWidth / 2,
    chartAreaOffsetY + 36 + 32 + 16
  )

  // chart line
  const chartAxisOffsetY = chartAreaOffsetY + chartAreaHeight - chartFooterHeight
  generateChartLine({
    lineCanvases,
    xAxises,
    chartAxisOffsetY,
    canvas: leftCtx,
    width: leftWidth,
    height: chartAreaHeight,
    isChartPnL: true,
  })

  // draw footer
  const footerContentMiddleOffset = canvasHeight - (canvasHeight - chartAreaOffsetY - chartAreaHeight) / 2
  generateFooter({ logoImg, colors, footerContentMiddleOffset, canvas: leftCtx, width: leftWidth })

  // draw line layout
  ctx.beginPath()
  ctx.strokeStyle = colors.neutral4
  ctx.lineWidth = 1
  ctx.moveTo(leftWidth, 0)
  ctx.lineTo(leftWidth, canvasHeight)
  ctx.moveTo(leftWidth, canvasHeight / 3)
  ctx.lineTo(canvasWidth, canvasHeight / 3)
  ctx.moveTo(leftWidth, (canvasHeight / 3) * 2)
  ctx.lineTo(canvasWidth, (canvasHeight / 3) * 2)
  ctx.stroke()

  // combine
  ctx.drawImage(rightCanvas, leftWidth, 0)
  ctx.drawImage(leftCanvas, 0, 0)

  return canvas
}

export const generatePositionCanvas = ({
  isOpening,
  stats,
  prices,
  colors,
  logoImg,
  protocolImg,
  chartId,
  symbolByIndexToken,
}: {
  isOpening: boolean
  stats: PositionData
  prices: UsdPrices
  colors: Colors
  logoImg: HTMLImageElement
  protocolImg: HTMLImageElement
  chartId?: string
  symbolByIndexToken?: string
}) => {
  const protocol = stats.protocol
  const address = stats.account
  const canvasWidth = 1220
  const canvasHeight = 640
  const rightWidth = 300
  const leftWidth = canvasWidth - rightWidth
  const chartPnlContainer = document.getElementById(ELEMENT_IDS.POSITION_CHART_PNL + chartId)
  const chartComponentContainers = chartPnlContainer?.getElementsByTagName('tr')
  const lineCanvases = chartComponentContainers?.[0]?.getElementsByTagName('canvas')
  const xAxises = chartComponentContainers?.[1]?.getElementsByTagName('canvas')

  // const canvas = document.getElementById('canvas-share') as HTMLCanvasElement
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const leftCanvas = document.createElement('canvas')
  leftCanvas.width = canvasWidth - rightWidth
  leftCanvas.height = canvasHeight
  const rightCanvas = document.createElement('canvas')
  rightCanvas.width = rightWidth
  rightCanvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  const leftCtx = leftCanvas.getContext('2d')
  const rightCtx = rightCanvas.getContext('2d')
  if (!ctx || !leftCtx || !rightCtx) return

  ctx.fillStyle = colors.neutral7
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // draw statistics
  const tokenSymbol = !stats.pair && symbolByIndexToken ? symbolByIndexToken : getSymbolFromPair(stats.pair)

  const statsGap = canvasHeight / 3
  const titleStatsFontSize = 32
  const valueStatsFontSize = 40
  const titleAndValueGap = 20
  const titleStartY = statsGap / 2 - titleAndValueGap / 2 - titleStatsFontSize / 2
  rightCtx.textAlign = 'center'
  rightCtx.textBaseline = 'middle'
  rightCtx.fillStyle = colors.neutral2
  rightCtx.font = `${titleStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText('Total Collateral', rightWidth / 2, titleStartY)
  rightCtx.fillText('PNL', rightWidth / 2, titleStartY + statsGap - 24)
  rightCtx.fillText('Paid Fee', rightWidth / 2, titleStartY + statsGap * 2)

  const valueStartY = titleStartY + titleStatsFontSize + titleAndValueGap
  rightCtx.fillStyle = colors.neutral1
  rightCtx.font = `700 ${valueStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText('$' + formatNumber(stats?.collateral, 0, 0), rightWidth / 2, valueStartY)
  const latestPnL = isOpening ? calcOpeningPnL(stats, prices[tokenSymbol]) : stats.pnl
  const latestROI = isOpening ? calcOpeningROI(stats, latestPnL) : stats.roi
  rightCtx.fillStyle = !stats
    ? colors.neutral1
    : latestPnL > 0
    ? colors.green1
    : latestPnL < 0
    ? colors.red2
    : colors.neutral1
  rightCtx.fillText(
    `${latestPnL < 0 ? '-' : ''}$` + formatNumber(Math.abs(latestPnL), 0),
    rightWidth / 2,
    valueStartY + statsGap - 24
  )
  rightCtx.font = `700 ${titleStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText(formatNumber(latestROI, 2) + '%', rightWidth / 2, valueStartY + statsGap + 32)
  rightCtx.fillStyle = colors.red2
  rightCtx.font = `700 ${valueStatsFontSize}px ${FONT_FAMILY}`
  rightCtx.fillText('-$' + formatNumber(stats?.fee, 1), rightWidth / 2, valueStartY + statsGap * 2)

  // draw avatar & address
  generateAvatarAddress({ address, colors, canvas: leftCtx })

  // draw protocol
  generateProtocol({ protocol, protocolImg, colors, canvas: leftCtx, width: leftWidth })

  // draw chart pnl
  const chartAreaOffsetY = 120
  const chartAreaHeight = 430
  const chartFooterHeight = 50
  leftCtx.fillStyle = colors.neutral5
  leftCtx.fillRect(0, chartAreaOffsetY, leftWidth, chartAreaHeight)

  // text
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(`Position`, 32, chartAreaOffsetY + 16)

  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = stats?.isLong ? colors.green1 : colors.red2
  leftCtx.fillText(stats?.isLong ? 'L' : 'S', 32, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  leftCtx.fillText('|', 60, chartAreaOffsetY + 52)
  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.fillStyle = colors.neutral1
  leftCtx.fillText(tokenSymbol, 60 + 24, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  const symbolWidth = leftCtx.measureText(tokenSymbol).width
  leftCtx.fillText('|', 60 + 24 + symbolWidth + 16, chartAreaOffsetY + 52)
  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.fillStyle = colors.neutral1
  generateTokenPrice({
    value: stats.averagePrice,
    canvas: leftCtx,
    x: 60 + 24 + symbolWidth + 16 + 24,
    y: chartAreaOffsetY + 52,
  })

  const sizeX = leftWidth / 2 - 64
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(`Size`, sizeX, chartAreaOffsetY + 16)
  const positionSize = formatNumber(stats.maxSizeNumber ?? stats.size, 0)
  const sizeWidth = leftCtx.measureText(positionSize).width
  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral1
  leftCtx.fillText(positionSize, sizeX, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  leftCtx.fillText('|', sizeX + sizeWidth + 16, chartAreaOffsetY + 52)
  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral1
  leftCtx.fillText(
    `${formatLeverage(stats?.marginMode, stats?.leverage)}`,
    sizeX + sizeWidth + 16 + 24,
    chartAreaOffsetY + 52
  )

  const durationX = leftWidth - 190
  leftCtx.font = `400 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(isOpening ? 'Liq. Price' : 'Duration', durationX, chartAreaOffsetY + 16)
  leftCtx.font = `700 32px ${FONT_FAMILY}`
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral1
  if (isOpening) {
    const liquidationPrice = calcLiquidatePrice(stats)
    generateTokenPrice({
      value: liquidationPrice ?? 0,
      canvas: leftCtx,
      x: durationX,
      y: chartAreaOffsetY + 52,
    })
  } else {
    leftCtx.fillText(formatDuration(stats.durationInSecond), durationX, chartAreaOffsetY + 52)
  }

  // chart line
  const chartAxisOffsetY = chartAreaOffsetY + chartAreaHeight - chartFooterHeight
  generateChartLine({
    lineCanvases,
    xAxises,
    chartAxisOffsetY,
    canvas: leftCtx,
    width: leftWidth,
    height: chartAreaHeight,
  })

  // draw footer
  const footerContentMiddleOffset = canvasHeight - (canvasHeight - chartAreaOffsetY - chartAreaHeight) / 2
  generateFooter({ logoImg, colors, footerContentMiddleOffset, canvas: leftCtx, width: leftWidth })

  // draw line layout
  ctx.beginPath()
  ctx.strokeStyle = colors.neutral4
  ctx.lineWidth = 1
  ctx.moveTo(leftWidth, 0)
  ctx.lineTo(leftWidth, canvasHeight)
  ctx.moveTo(leftWidth, canvasHeight / 3)
  ctx.lineTo(canvasWidth, canvasHeight / 3)
  ctx.moveTo(leftWidth, (canvasHeight / 3) * 2)
  ctx.lineTo(canvasWidth, (canvasHeight / 3) * 2)
  ctx.stroke()

  // combine
  ctx.drawImage(rightCanvas, leftWidth, 0)
  ctx.drawImage(leftCanvas, 0, 0)

  return canvas
}

export const generateAvatarAddress = ({
  address,
  canvas,
  colors,
}: {
  address: string
  canvas: CanvasRenderingContext2D
  colors: Colors
}) => {
  const avatarCenterX = 60
  const avatarCenterY = 60
  const avatarSize = 64
  const angle = (70 * Math.PI) / 180
  const gradientX = avatarCenterX - avatarSize / 2
  const gradientY = avatarCenterY - avatarSize / 2
  const { emoji, bg } = generateAvatar(address)
  const avatarGradient = canvas.createLinearGradient(
    gradientX,
    gradientY,
    gradientX + Math.cos(angle) + avatarSize,
    gradientY + Math.sin(angle) + avatarSize
  )
  avatarGradient.addColorStop(0.5, `${bg}50`)
  avatarGradient.addColorStop(1, `${bg}50`)
  avatarGradient.addColorStop(0, bg)
  avatarGradient.addColorStop(0.51, bg)
  canvas.fillStyle = avatarGradient
  canvas.arc(avatarCenterX, avatarCenterY, avatarSize / 2, 0, 360)
  canvas.fill()
  canvas.font = `40px ${FONT_FAMILY}`
  canvas.textAlign = 'center'
  canvas.textBaseline = 'middle'
  canvas.fillText(emoji, avatarCenterX + 1, avatarCenterY + 3) // wierd

  const addressOffsetX = avatarCenterX + avatarSize / 2 + 24
  const addressOffsetY = avatarCenterY
  canvas.textBaseline = 'top'
  canvas.font = `700 48px ${FONT_FAMILY}`
  canvas.textAlign = 'left'
  canvas.textBaseline = 'middle'
  canvas.fillStyle = colors.neutral1
  canvas.fillText(addressShorten(address), addressOffsetX, addressOffsetY)
}

// TODO: Check when add new protocol
const PROTOCOL_CONFIG_MAPPING: { [key in ProtocolEnum]?: { text: string; textWidth: number } } = {
  [ProtocolEnum.MUX_ARB]: { text: 'MUX', textWidth: 72 },
  [ProtocolEnum.LEVEL_BNB]: { text: 'Level', textWidth: 117 },
  [ProtocolEnum.LEVEL_ARB]: { text: 'Level', textWidth: 117 },
  [ProtocolEnum.GNS]: { text: 'gTrade', textWidth: 117 },
  [ProtocolEnum.GNS_POLY]: { text: 'gTrade', textWidth: 117 },
  [ProtocolEnum.GNS_BASE]: { text: 'gTrade', textWidth: 117 },
  [ProtocolEnum.GNS_APE]: { text: 'gTrade', textWidth: 117 },
  [ProtocolEnum.GMX]: { text: 'GMX (ARB)', textWidth: 168 },
  [ProtocolEnum.GMX_AVAX]: { text: 'GMX (AVAX)', textWidth: 168 },
  [ProtocolEnum.GMX_V2]: { text: 'GMX V2', textWidth: 117 },
  [ProtocolEnum.GMX_V2_AVAX]: { text: 'GMX V2 (AVAX)', textWidth: 328 },
  [ProtocolEnum.KWENTA]: { text: 'Kwenta', textWidth: 117 },
  [ProtocolEnum.POLYNOMIAL]: { text: 'Polynomial', textWidth: 168 },
  [ProtocolEnum.POLYNOMIAL_L2]: { text: 'Polynomial L2', textWidth: 328 },
  [ProtocolEnum.EQUATION_ARB]: { text: 'Equation', textWidth: 141 },
  [ProtocolEnum.BLOOM_BLAST]: { text: 'Bloom', textWidth: 117 },
  [ProtocolEnum.APOLLOX_BNB]: { text: 'ApolloX (BNB)', textWidth: 288 },
  [ProtocolEnum.APOLLOX_BASE]: { text: 'ApolloX (Base)', textWidth: 288 },
  [ProtocolEnum.AVANTIS_BASE]: { text: 'Avantis', textWidth: 141 },
  [ProtocolEnum.TIGRIS_ARB]: { text: 'Tigris', textWidth: 117 },
  [ProtocolEnum.LOGX_BLAST]: { text: 'LogX', textWidth: 117 },
  [ProtocolEnum.LOGX_MODE]: { text: 'LogX', textWidth: 117 },
  [ProtocolEnum.MYX_ARB]: { text: 'MYX (ARB)', textWidth: 328 },
  [ProtocolEnum.MYX_OPBNB]: { text: 'MYX (opBNB)', textWidth: 328 },
  [ProtocolEnum.MYX_LINEA]: { text: 'MYX (Linea)', textWidth: 328 },
  [ProtocolEnum.HMX_ARB]: { text: 'HMX', textWidth: 72 },
  [ProtocolEnum.DEXTORO]: { text: 'DexToro', textWidth: 141 },
  [ProtocolEnum.CYBERDEX]: { text: 'CyberDEX', textWidth: 156 },
  [ProtocolEnum.VELA_ARB]: { text: 'Vela', textWidth: 117 },
  [ProtocolEnum.SYNTHETIX_V3_ARB]: { text: 'Synthetix V3 (ARB)', textWidth: 328 },
  [ProtocolEnum.SYNTHETIX_V3]: { text: 'Synthetix V3 (Base)', textWidth: 328 },
  [ProtocolEnum.SYNTHETIX]: { text: 'Synthetix', textWidth: 288 },
  [ProtocolEnum.COPIN]: { text: 'Copin', textWidth: 117 },
  [ProtocolEnum.KTX_MANTLE]: { text: 'KTX', textWidth: 72 },
  [ProtocolEnum.YFX_ARB]: { text: 'YFX', textWidth: 72 },
  [ProtocolEnum.KILOEX_OPBNB]: { text: 'KiloEx (opBNB)', textWidth: 328 },
  [ProtocolEnum.KILOEX_BNB]: { text: 'KiloEx (BNB)', textWidth: 328 },
  [ProtocolEnum.KILOEX_BASE]: { text: 'KiloEx (Base)', textWidth: 328 },
  [ProtocolEnum.KILOEX_MANTA]: { text: 'KiloEx (Manta)', textWidth: 328 },
  [ProtocolEnum.ROLLIE_SCROLL]: { text: 'Rollie (Scroll)', textWidth: 328 },
  [ProtocolEnum.PERENNIAL_ARB]: { text: 'Perennial', textWidth: 168 },
  [ProtocolEnum.MUMMY_FANTOM]: { text: 'Mummy Finance', textWidth: 310 },
  [ProtocolEnum.MORPHEX_FANTOM]: { text: 'Morphex', textWidth: 156 },
  [ProtocolEnum.HYPERLIQUID]: { text: 'Hyperliquid', textWidth: 268 },
  [ProtocolEnum.SYNFUTURE_BASE]: { text: 'Synfutures', textWidth: 288 },
  [ProtocolEnum.DYDX]: { text: 'dYdX', textWidth: 117 },
  [ProtocolEnum.BSX_BASE]: { text: 'BSX', textWidth: 117 },
  [ProtocolEnum.UNIDEX_ARB]: { text: 'UniDex', textWidth: 156 },
  [ProtocolEnum.VERTEX_ARB]: { text: 'Vertex', textWidth: 156 },
  [ProtocolEnum.LINEHUB_LINEA]: { text: 'Linehub', textWidth: 156 },
  [ProtocolEnum.FOXIFY_ARB]: { text: 'Foxify', textWidth: 156 },
  [ProtocolEnum.BMX_BASE]: { text: 'BMX Classic', textWidth: 328 },
  [ProtocolEnum.DEPERP_BASE]: { text: 'Deperp', textWidth: 156 },
  [ProtocolEnum.HORIZON_BNB]: { text: 'Horizon', textWidth: 168 },
  [ProtocolEnum.IDEX]: { text: 'IDEX', textWidth: 156 },
  [ProtocolEnum.HOLDSTATION_ZKSYNC]: { text: 'Holdstation', textWidth: 310 },
  [ProtocolEnum.ZENO_METIS]: { text: 'Zeno', textWidth: 117 },
  [ProtocolEnum.SYMMIO_BASE]: { text: 'Symmio', textWidth: 172 },
  [ProtocolEnum.INTENTX_BASE]: { text: 'IntentX', textWidth: 172 },
  [ProtocolEnum.BASED_BASE]: { text: 'Based', textWidth: 156 },
  [ProtocolEnum.DERIVE]: { text: 'Derive', textWidth: 172 },
  [ProtocolEnum.FULCROM_CRONOS]: { text: 'Fulcrom', textWidth: 172 },
  [ProtocolEnum.JOJO_BASE]: { text: 'JOJO', textWidth: 172 },
  [ProtocolEnum.ELFI_ARB]: { text: 'ELFi', textWidth: 172 },
  [ProtocolEnum.JUPITER]: { text: 'Jupiter', textWidth: 288 },
  [ProtocolEnum.PERPETUAL_OP]: { text: 'Perpetual V2', textWidth: 328 },
}
export const generateProtocol = ({
  protocol,
  protocolImg,
  canvas,
  colors,
  width,
}: {
  protocol: ProtocolEnum
  protocolImg: HTMLImageElement
  canvas: CanvasRenderingContext2D
  colors: Colors
  width: number
}) => {
  const avatarCenterY = 60
  let protocolTextWidth = 72
  let protocolText = 'GMX'
  const config = PROTOCOL_CONFIG_MAPPING[protocol]
  if (config) {
    protocolTextWidth = config.textWidth
    protocolText = config.text
  }
  // protocol text
  const protocolTextOffsetLeft = width - protocolImg.width - protocolTextWidth
  canvas.font = `700 32px ${FONT_FAMILY}`
  canvas.textAlign = 'left'
  canvas.fillStyle = colors.neutral1
  canvas.fillText(protocolText, protocolTextOffsetLeft, avatarCenterY)

  // protocol img
  const protocolImgSize = protocolImg.width
  const protocolImgOffsetLeft = protocolTextOffsetLeft - 8 - protocolImgSize
  canvas.drawImage(
    protocolImg,
    protocolImgOffsetLeft,
    avatarCenterY - protocolImgSize / 2,
    protocolImgSize,
    protocolImgSize
  )
  // sub text
  const subProtocolTextOffsetRight = protocolImgOffsetLeft - 16
  canvas.font = `700 24px ${FONT_FAMILY}`
  canvas.textAlign = 'right'
  canvas.fillStyle = colors.neutral1
  canvas.fillText('Trade on', subProtocolTextOffsetRight, avatarCenterY)
}

export const generateChartLine = ({
  lineCanvases,
  xAxises,
  canvas,
  width,
  height,
  chartAxisOffsetY,
  isChartPnL,
}: {
  lineCanvases: HTMLCollectionOf<HTMLCanvasElement> | undefined
  xAxises: HTMLCollectionOf<HTMLCanvasElement> | undefined
  canvas: CanvasRenderingContext2D
  width: number
  height: number
  chartAxisOffsetY: number
  isChartPnL?: boolean
}) => {
  if (lineCanvases) {
    for (const _canvas of lineCanvases) {
      const desWidth = width - 32
      let desHeight = 0
      if (isChartPnL) {
        desHeight = height - 150
      } else {
        const widthHeightRatio = _canvas.width / _canvas.height
        desHeight = desWidth / widthHeightRatio
      }
      const chartLineOffsetY = chartAxisOffsetY - desHeight
      canvas.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height, 16, chartLineOffsetY, desWidth, desHeight)
    }
  }
  if (xAxises) {
    for (const _canvas of xAxises) {
      const widthHeightRatio = _canvas.width / _canvas.height
      const desWidth = width - 32
      const desHeight = desWidth / widthHeightRatio
      canvas.font = `400 16px ${FONT_FAMILY}`
      canvas.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height, 16, chartAxisOffsetY, desWidth, desHeight)
    }
  }
}

export const generateFooter = ({
  logoImg,
  canvas,
  colors,
  width,
  footerContentMiddleOffset,
}: {
  logoImg: HTMLImageElement
  canvas: CanvasRenderingContext2D
  colors: Colors
  width: number
  footerContentMiddleOffset: number
}) => {
  canvas.drawImage(logoImg, width - 180 - 24, footerContentMiddleOffset - 42 / 2, 182, 42)
  // canvas.font = '700 24px ${FONT_FAMILY}'
  // canvas.textAlign = 'center'
  // canvas.textBaseline = 'middle'
  // canvas.fillStyle = colors.neutral3
  // canvas.fillText(`Join Us: ${LINKS.telegram}`, width / 2, footerContentMiddleOffset)
}

export const generateTokenPrice = ({
  value,
  canvas,
  x,
  y,
}: {
  value: number
  canvas: CanvasRenderingContext2D
  x: number
  y: number
}) => {
  const { formattedNumber, integerPart, zeroPart, decimalPart } = formatTokenPrices({
    value,
  })
  if (value < 1 && zeroPart.length > 3 && Number(decimalPart) > 0) {
    canvas.fillText(Number(integerPart).toFixed(1), x, y)
    canvas.font = `700 24px ${FONT_FAMILY}`
    canvas.fillText(`${zeroPart.length}`, x + 48, y + 16)
    canvas.font = `700 32px ${FONT_FAMILY}`
    canvas.fillText(formatNumber(decimalPart, 2), x + 48 + 12, y)
  } else {
    canvas.fillText(formattedNumber && formattedNumber > 0 ? formatPrice(formattedNumber, 2, 2) : '--', x, y)
  }
}
