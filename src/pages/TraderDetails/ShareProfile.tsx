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
import { themeColors } from 'theme/colors'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { generateTraderCanvas } from 'utils/helpers/generateImage'
import { generateParamsUrl, generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { getProtocolDropdownImage } from 'utils/helpers/transform'

export default function ShareProfile({
  address,
  protocol,
  type,
  stats,
  iconSize = 20,
}: {
  address: string
  protocol: ProtocolEnum
  type: TimeFrameEnum
  stats: TraderData | undefined
  iconSize?: number
}) {
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null

  const [isSocialMediaSharingOpen, setIsSocialMediaSharingOpen] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [image, setImage] = useState<ImageData | null>(null)

  const protocolImg = new Image(40, 40)
  protocolImg.src = getProtocolDropdownImage({ protocol: protocol ?? DEFAULT_PROTOCOL, isActive: false })
  const logoImg = new Image(182, 42)
  logoImg.src = logoWithText

  const handleShare = async () => {
    try {
      setIsSocialMediaSharingOpen(true)
      if (!stats) return
      setIsGeneratingLink(true)

      // get Chart pnl
      const canvas = generateTraderCanvas({ address, protocol, type, stats, colors: themeColors, logoImg, protocolImg })
      if (canvas) {
        canvas.toBlob((blob) => {
          // async function share() {
          //   if (!blob) return
          //   const res = await shareTraderApi({
          //     protocol,
          //     traderAddress: address,
          //     time: type,
          //     imageBlob: blob,
          //   })
          //   if (!res) {
          //     toast.error(<ToastBody title="Error" message="Something went wrong" />)
          //     setIsGeneratingLink(false)
          //     setIsSocialMediaSharingOpen(false)
          //     return
          //   }
          //   setImage(res)
          //   setIsGeneratingLink(false)
          // }
          // share()
          if (blob) {
            shareTraderApi({
              protocol,
              traderAddress: address,
              time: type,
              imageBlob: blob,
            })
            setImage({ url: URL.createObjectURL(blob), width: 0, height: 0 })
            setIsGeneratingLink(false)
          } else {
            toast.error(<ToastBody title="Error" message="Something went wrong" />)
            setIsGeneratingLink(false)
            setIsSocialMediaSharingOpen(false)
          }
        })
      }
    } catch (e) {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
      setIsGeneratingLink(false)
    }
  }

  let shareLink = generateParamsUrl({
    url: `${import.meta.env.VITE_URL}${generateTraderMultiExchangeRoute({ protocol, address })}`,
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
        icon={<ShareFat size={iconSize} />}
        sx={{ color: 'neutral2', '&:hover': { color: 'neutral2' } }}
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
