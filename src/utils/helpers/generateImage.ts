import { PositionData, TraderData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Colors } from 'theme/types'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { ELEMENT_IDS } from 'utils/config/keys'
import { getTokenTradeSupport } from 'utils/config/trades'

import { calcLiquidatePrice, calcOpeningPnL, calcOpeningROI } from './calculate'
import formatTokenPrices, { addressShorten, formatDuration, formatNumber, formatPrice } from './format'
import { generateAvatar } from './generateAvatar'

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
  rightCtx.font = `${titleStatsFontSize}px Anuphan`
  rightCtx.fillText('Trades', rightWidth / 2, titleStartY)
  rightCtx.fillText('Win Rate', rightWidth / 2, titleStartY + statsGap)
  rightCtx.fillText('Profit rate', rightWidth / 2, titleStartY + statsGap * 2)

  const valueStartY = titleStartY + titleStatsFontSize + titleAndValueGap
  rightCtx.fillStyle = colors.neutral1
  rightCtx.font = `700 ${valueStatsFontSize}px Anuphan`
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
  leftCtx.font = '500 32px Anuphan'
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

  leftCtx.font = '700 56px Anuphan'
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
}: {
  isOpening: boolean
  stats: PositionData
  prices: UsdPrices
  colors: Colors
  logoImg: HTMLImageElement
  protocolImg: HTMLImageElement
  chartId?: string
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
  const statsGap = canvasHeight / 3
  const titleStatsFontSize = 32
  const valueStatsFontSize = 40
  const titleAndValueGap = 20
  const titleStartY = statsGap / 2 - titleAndValueGap / 2 - titleStatsFontSize / 2
  rightCtx.textAlign = 'center'
  rightCtx.textBaseline = 'middle'
  rightCtx.fillStyle = colors.neutral2
  rightCtx.font = `${titleStatsFontSize}px Anuphan`
  rightCtx.fillText('Total Collateral', rightWidth / 2, titleStartY)
  rightCtx.fillText('PNL', rightWidth / 2, titleStartY + statsGap - 24)
  rightCtx.fillText('Paid Fee', rightWidth / 2, titleStartY + statsGap * 2)

  const valueStartY = titleStartY + titleStatsFontSize + titleAndValueGap
  rightCtx.fillStyle = colors.neutral1
  rightCtx.font = `700 ${valueStatsFontSize}px Anuphan`
  rightCtx.fillText('$' + formatNumber(stats?.collateral, 0, 0), rightWidth / 2, valueStartY)
  const latestPnL = isOpening ? calcOpeningPnL(stats, prices[stats.indexToken]) : stats.pnl
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
  rightCtx.font = `700 ${titleStatsFontSize}px Anuphan`
  rightCtx.fillText(formatNumber(latestROI, 2) + '%', rightWidth / 2, valueStartY + statsGap + 32)
  rightCtx.fillStyle = colors.red2
  rightCtx.font = `700 ${valueStatsFontSize}px Anuphan`
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
  leftCtx.font = '400 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(`Position`, 32, chartAreaOffsetY + 16)

  leftCtx.font = '700 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = stats?.isLong ? colors.green1 : colors.red2
  leftCtx.fillText(stats?.isLong ? 'L' : 'S', 32, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = '400 32px Anuphan'
  leftCtx.fillText('|', 60, chartAreaOffsetY + 52)
  leftCtx.font = '700 32px Anuphan'
  leftCtx.fillStyle = colors.neutral1
  const tokenSymbol = getTokenTradeSupport(stats.protocol)?.[stats.indexToken]?.symbol ?? ''
  leftCtx.fillText(tokenSymbol, 60 + 24, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = '400 32px Anuphan'
  const symbolWidth = leftCtx.measureText(tokenSymbol).width
  leftCtx.fillText('|', 60 + 24 + symbolWidth + 16, chartAreaOffsetY + 52)
  leftCtx.font = '700 32px Anuphan'
  leftCtx.fillStyle = colors.neutral1
  generateTokenPrice({
    value: stats.averagePrice,
    canvas: leftCtx,
    x: 60 + 24 + symbolWidth + 16 + 24,
    y: chartAreaOffsetY + 52,
  })

  const sizeX = leftWidth / 2 - 64
  leftCtx.font = '400 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(`Size`, sizeX, chartAreaOffsetY + 16)
  const positionSize = formatNumber(stats.maxSizeNumber ?? stats.size, 0)
  const sizeWidth = leftCtx.measureText(positionSize).width
  leftCtx.font = '700 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral1
  leftCtx.fillText(positionSize, sizeX, chartAreaOffsetY + 52)
  leftCtx.fillStyle = colors.neutral3
  leftCtx.font = '400 32px Anuphan'
  leftCtx.fillText('|', sizeX + sizeWidth + 16, chartAreaOffsetY + 52)
  leftCtx.font = '700 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral1
  leftCtx.fillText(`${formatNumber(stats.leverage, 1, 1)}x`, sizeX + sizeWidth + 16 + 24, chartAreaOffsetY + 52)

  const durationX = leftWidth - 190
  leftCtx.font = '400 32px Anuphan'
  leftCtx.textAlign = 'left'
  leftCtx.fillStyle = colors.neutral2
  leftCtx.textBaseline = 'top'
  leftCtx.fillText(isOpening ? 'Liq. Price' : 'Duration', durationX, chartAreaOffsetY + 16)
  leftCtx.font = '700 32px Anuphan'
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
  canvas.font = '40px Anuphan'
  canvas.textAlign = 'center'
  canvas.textBaseline = 'middle'
  canvas.fillText(emoji, avatarCenterX + 1, avatarCenterY + 3) // wierd

  const addressOffsetX = avatarCenterX + avatarSize / 2 + 24
  const addressOffsetY = avatarCenterY
  canvas.textBaseline = 'top'
  canvas.font = '700 48px Anuphan'
  canvas.textAlign = 'left'
  canvas.textBaseline = 'middle'
  canvas.fillStyle = colors.neutral1
  canvas.fillText(addressShorten(address), addressOffsetX, addressOffsetY)
}

// TODO: Check when add new protocol
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
  switch (protocol) {
    case ProtocolEnum.MUX_ARB:
      protocolTextWidth = 72
      protocolText = 'MUX'
      break
    case ProtocolEnum.LEVEL_BNB:
    case ProtocolEnum.LEVEL_ARB:
      protocolTextWidth = 117
      protocolText = 'Level'
      break
    case ProtocolEnum.GNS:
    case ProtocolEnum.GNS_POLY:
    case ProtocolEnum.GNS_BASE:
      protocolTextWidth = 117
      protocolText = 'gTrade'
      break
    case ProtocolEnum.GMX:
    case ProtocolEnum.GMX_V2:
      protocolTextWidth = 72
      protocolText = 'GMX'
      break
    case ProtocolEnum.KWENTA:
      protocolTextWidth = 117
      protocolText = 'Kwenta'
      break
    case ProtocolEnum.POLYNOMIAL:
      protocolTextWidth = 168
      protocolText = 'Polynomial'
      break
    case ProtocolEnum.EQUATION_ARB:
      protocolTextWidth = 141
      protocolText = 'Equation'
      break
    case ProtocolEnum.BLOOM_BLAST:
      protocolTextWidth = 117
      protocolText = 'Bloom'
      break
    case ProtocolEnum.APOLLOX_BNB:
      protocolTextWidth = 141
      protocolText = 'ApolloX'
      break
    case ProtocolEnum.AVANTIS_BASE:
      protocolTextWidth = 141
      protocolText = 'Avantis'
      break
    case ProtocolEnum.TIGRIS_ARB:
      protocolTextWidth = 117
      protocolText = 'Tigris'
      break
    case ProtocolEnum.LOGX_BLAST:
    case ProtocolEnum.LOGX_MODE:
      protocolTextWidth = 117
      protocolText = 'LogX'
      break
    case ProtocolEnum.MYX_ARB:
      protocolTextWidth = 72
      protocolText = 'MYX'
      break
    case ProtocolEnum.HMX_ARB:
      protocolTextWidth = 72
      protocolText = 'HMX'
      break
    case ProtocolEnum.DEXTORO:
      protocolTextWidth = 141
      protocolText = 'DexToro'
      break
    case ProtocolEnum.CYBERDEX:
      protocolTextWidth = 156
      protocolText = 'CyberDEX'
      break
    case ProtocolEnum.VELA_ARB:
      protocolTextWidth = 117
      protocolText = 'Vela'
      break
    case ProtocolEnum.SYNTHETIX_V3:
      protocolTextWidth = 288
      protocolText = 'Synthetix V3'
      break
    case ProtocolEnum.COPIN:
      protocolTextWidth = 117
      protocolText = 'Copin'
      break
    case ProtocolEnum.KTX_MANTLE:
      protocolTextWidth = 72
      protocolText = 'KTX'
      break
    case ProtocolEnum.YFX_ARB:
      protocolTextWidth = 72
      protocolText = 'YFX'
      break
    case ProtocolEnum.KILOEX_OPBNB:
      protocolTextWidth = 310
      protocolText = 'KiloEx (opBNB)'
      break
    case ProtocolEnum.ROLLIE_SCROLL:
      protocolTextWidth = 328
      protocolText = 'Rollie (Scroll)'
      break
    case ProtocolEnum.PERENNIAL_ARB:
      protocolTextWidth = 168
      protocolText = 'Perennial'
      break
    case ProtocolEnum.MUMMY_FANTOM:
      protocolTextWidth = 310
      protocolText = 'Mummy Finance'
      break
    case ProtocolEnum.MORPHEX_FANTOM:
      protocolTextWidth = 156
      protocolText = 'Morphex'
      break
    case ProtocolEnum.HYPERLIQUID:
      protocolTextWidth = 268
      protocolText = 'Hyperliquid'
      break
    case ProtocolEnum.SYNFUTURE_BASE:
      protocolTextWidth = 288
      protocolText = 'Synfutures'
      break
    case ProtocolEnum.DYDX:
      protocolTextWidth = 117
      protocolText = 'dYdX'
      break
    case ProtocolEnum.BSX_BASE:
      protocolTextWidth = 117
      protocolText = 'BSX'
      break
    case ProtocolEnum.UNIDEX_ARB:
      protocolTextWidth = 156
      protocolText = 'UniDex'
      break
    case ProtocolEnum.VERTEX_ARB:
      protocolTextWidth = 156
      protocolText = 'Vertex'
      break
    default:
      break
  }
  // protocol text
  const protocolTextOffsetLeft = width - protocolImg.width - protocolTextWidth
  canvas.font = '700 32px Anuphan'
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
  canvas.font = '700 24px Anuphan'
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
      canvas.font = '400 16px Anuphan'
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
  // canvas.font = '700 24px Anuphan'
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
    canvas.font = '700 24px Anuphan'
    canvas.fillText(`${zeroPart.length}`, x + 48, y + 16)
    canvas.font = '700 32px Anuphan'
    canvas.fillText(formatNumber(decimalPart, 2), x + 48 + 12, y)
  } else {
    canvas.fillText(formattedNumber && formattedNumber > 0 ? formatPrice(formattedNumber, 2, 2) : '--', x, y)
  }
}
