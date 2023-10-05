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
import { ProtocolEnum } from 'utils/config/enums'
import { generateTraderCanvas } from 'utils/helpers/generateImage'
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
      setIsSocialMediaSharingOpen(true)
      setIsGeneratingLink(true)

      // get Chart pnl
      const canvas = generateTraderCanvas({ address, protocol, stats, colors, logoImg, protocolImg })
      if (canvas) {
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
      }
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
