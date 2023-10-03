import { ShareFat } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { shareTraderApi } from 'apis/storage'
import logoWithText from 'assets/images/logo.png'
import ToastBody from 'components/@ui/ToastBody'
import { ImageData } from 'entities/image'
import { TraderData } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { IconBox } from 'theme/base'
import { default as themeColors } from 'theme/colors'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { ELEMENT_IDS } from 'utils/config/keys'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateAvatar } from 'utils/helpers/generateAvatar'
import { generateParamsUrl, generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

export default function ShareProfile({
  address,
  protocol,
  stats,
}: {
  address: string
  protocol: ProtocolEnum
  stats: TraderData | undefined
}) {
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null

  const [isSocialMediaSharingOpen, setIsSocialMediaSharingOpen] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [image, setImage] = useState<ImageData | null>(null)

  const colors = themeColors(true)
  const protocolImg = new Image(32, 32)
  protocolImg.src = parseProtocolImage(protocol ?? 'KWENTA')
  const logoImg = new Image(182, 42)
  logoImg.src = logoWithText

  const handleShare = async () => {
    if (!stats) {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
    }
    try {
      // get Chart pnl
      setIsSocialMediaSharingOpen(true)
      setIsGeneratingLink(true)
      const canvasWidth = 1220
      const canvasHeight = 640
      const rightWidth = 300
      const leftWidth = canvasWidth - rightWidth
      const chartPnlContainer = document.getElementById(ELEMENT_IDS.TRADER_CHART_PNL)
      const chartComponentContainers = chartPnlContainer?.getElementsByTagName('tr')
      const lineCanvases = chartComponentContainers?.[0]?.getElementsByTagName('canvas')
      // const xAxises = chartComponentContainers?.[1]?.getElementsByTagName('canvas')

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
      rightCtx.fillText(formatNumber(stats?.totalTrade, 0, 0), rightWidth / 2, valueStartY)
      rightCtx.fillText(formatNumber(stats?.winRate, 1, 1) + '%', rightWidth / 2, valueStartY + statsGap)
      rightCtx.fillText(formatNumber(stats?.profitRate, 1, 1) + '%', rightWidth / 2, valueStartY + statsGap * 2)

      // draw avatar
      const avatarCenterX = 60
      const avatarCenterY = 60
      const avatarSize = 64
      const angle = (70 * Math.PI) / 180
      const gradientX = avatarCenterX - avatarSize / 2
      const gradientY = avatarCenterY - avatarSize / 2
      const { emoji, bg } = generateAvatar(address)
      const avatarGradient = leftCtx.createLinearGradient(
        gradientX,
        gradientY,
        gradientX + Math.cos(angle) + avatarSize,
        gradientY + Math.sin(angle) + avatarSize
      )
      avatarGradient.addColorStop(0.5, `${bg}50`)
      avatarGradient.addColorStop(1, `${bg}50`)
      avatarGradient.addColorStop(0, bg)
      avatarGradient.addColorStop(0.51, bg)
      leftCtx.fillStyle = avatarGradient
      leftCtx.arc(avatarCenterX, avatarCenterY, avatarSize / 2, 0, 360)
      leftCtx.fill()
      leftCtx.font = '40px Anuphan'
      leftCtx.textAlign = 'center'
      leftCtx.textBaseline = 'middle'
      leftCtx.fillText(emoji, avatarCenterX + 1, avatarCenterY + 3) // wierd

      // draw address
      const addressOffsetX = avatarCenterX + avatarSize / 2 + 24
      const addressOffsetY = avatarCenterY
      leftCtx.textBaseline = 'top'
      leftCtx.font = '700 48px Anuphan'
      leftCtx.textAlign = 'left'
      leftCtx.textBaseline = 'middle'
      leftCtx.fillStyle = colors.neutral1
      leftCtx.fillText(addressShorten(address), addressOffsetX, addressOffsetY)

      // draw protocol
      let protocolTextWidth = 72
      let protocolText = 'GMX'
      switch (protocol) {
        case ProtocolEnum.GMX:
          protocolTextWidth = 72
          protocolText = 'GMX'
          break
        case ProtocolEnum.KWENTA:
          protocolTextWidth = 117
          protocolText = 'Kwenta'
          break
        default:
          break
      }
      // protocol text
      const protocolTextOffsetLeft = leftWidth - 24 - protocolTextWidth
      leftCtx.font = '700 32px Anuphan'
      leftCtx.textAlign = 'left'
      leftCtx.fillStyle = colors.neutral1
      leftCtx.fillText(protocolText, protocolTextOffsetLeft, avatarCenterY)

      // protocol img
      const protocolImgSize = 32
      const protocolImgOffsetLeft = protocolTextOffsetLeft - 8 - protocolImgSize
      leftCtx.drawImage(
        protocolImg,
        protocolImgOffsetLeft,
        avatarCenterY - protocolImgSize / 2,
        protocolImgSize,
        protocolImgSize
      )
      // sub text
      const subProtocolTextOffsetRight = protocolImgOffsetLeft - 16
      leftCtx.font = '700 24px Anuphan'
      leftCtx.textAlign = 'right'
      leftCtx.fillStyle = colors.neutral1
      leftCtx.fillText('Trade on', subProtocolTextOffsetRight, avatarCenterY)

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
      switch (stats?.type) {
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
        default:
          break
      }
      leftCtx.fillText(`PNL in ${time} days`, leftWidth / 2, chartAreaOffsetY + 36)

      leftCtx.font = '700 56px Anuphan'
      leftCtx.textAlign = 'center'
      leftCtx.fillStyle = !stats
        ? colors.neutral1
        : stats.profit > 0
        ? colors.green1
        : stats.profit < 0
        ? colors.red1
        : colors.neutral1
      leftCtx.fillText('$' + formatNumber(stats?.profit, 0, 0), leftWidth / 2, chartAreaOffsetY + 36 + 32 + 16)
      // chart line
      const chartAxisOffsetY = chartAreaOffsetY + chartAreaHeight - chartFooterHeight
      if (lineCanvases) {
        for (const _canvas of lineCanvases) {
          const widthHeightRatio = _canvas.width / _canvas.height
          const desWidth = leftWidth - 32
          const desHeight = desWidth / widthHeightRatio
          const chartLineOffsetY = chartAxisOffsetY - desHeight
          leftCtx.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height, 16, chartLineOffsetY, desWidth, desHeight)
        }
      }
      // if (xAxises) {
      //   for (const _canvas of xAxises) {
      //     const widthHeightRatio = _canvas.width / _canvas.height
      //     const desWidth = leftWidth - 32
      //     const desHeight = desWidth / widthHeightRatio
      //     leftCtx.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height, 16, chartAxisOffsetY, desWidth, desHeight)
      //   }
      // }

      // draw footer
      const footerContentMiddleOffset = canvasHeight - (canvasHeight - chartAreaOffsetY - chartAreaHeight) / 2
      leftCtx.drawImage(logoImg, 24, footerContentMiddleOffset - 42 / 2, 182, 42)
      leftCtx.font = '20px Anuphan'
      leftCtx.textAlign = 'right'
      leftCtx.textBaseline = 'middle'
      leftCtx.fillStyle = colors.neutral3
      leftCtx.fillText(
        'The leading tool to analyze and copy the best on-chain traders.',
        leftWidth - 24,
        footerContentMiddleOffset
      )

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

      canvas.toBlob((blob) => {
        async function share() {
          if (!stats || !blob) return
          const res = await shareTraderApi({
            protocol,
            traderAddress: address,
            time: stats.type,
            imageBlob: blob,
          })
          if (!res) {
            toast.error(<ToastBody title="Error" message="Something went wrong" />)
            setIsGeneratingLink(false)
            setIsSocialMediaSharingOpen(false)
            return
          }
          setImage(res)
          setIsGeneratingLink(false)
        }
        share()
      })
    } catch {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
      setIsGeneratingLink(false)
    }
  }

  let shareLink = generateParamsUrl({
    url: `${import.meta.env.VITE_URL}${generateTraderDetailsRoute(protocol, address)}`,
    key: 'ref',
    value: referralCode,
  })
  //add time
  if (!!stats?.type) {
    shareLink = generateParamsUrl({
      url: shareLink,
      key: 'time',
      value: stats.type.toString(),
    })
  }

  return (
    <>
      <IconBox
        role="button"
        onClick={handleShare}
        icon={<ShareFat size={20} />}
        sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' } }}
      />
      {isSocialMediaSharingOpen && (
        <SocialMediaSharingModal
          title="Share This Trader"
          isOpen={isSocialMediaSharingOpen}
          link={shareLink}
          onDismiss={() => setIsSocialMediaSharingOpen(false)}
          isGeneratingLink={isGeneratingLink}
          image={image}
        />
      )}
    </>
  )
}
