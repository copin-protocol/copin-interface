import { ShareFat } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { sharePositionApi } from 'apis/shareApis'
import logoWithText from 'assets/images/logo.png'
import ToastBody from 'components/@ui/ToastBody'
import { SharePositionData } from 'entities/share'
import { PositionData } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { IconBox } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { generatePositionCanvas } from 'utils/helpers/generateImage'
import { generateParamsUrl, generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

export default function SharePosition({ isOpening, stats }: { isOpening: boolean; stats: PositionData }) {
  const { prices } = useRealtimeUsdPricesStore()
  const [isSocialMediaSharingOpen, setIsSocialMediaSharingOpen] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [shareData, setShareData] = useState<SharePositionData>()

  const { protocolImg, logoImg } = useMemo(() => {
    const protocolImg = new Image(32, 32)
    protocolImg.src = parseProtocolImage(stats?.protocol ?? ProtocolEnum.GMX)
    const logoImg = new Image(182, 42)
    logoImg.src = logoWithText
    return { protocolImg, logoImg }
  }, [stats?.protocol])

  const handleShare = async () => {
    if (!stats) {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
    }
    try {
      setIsSocialMediaSharingOpen(true)
      setIsGeneratingLink(true)

      const canvas = generatePositionCanvas({
        isOpening,
        stats,
        prices,
        colors: themeColors,
        protocolImg,
        logoImg,
      })
      if (canvas) {
        canvas.toBlob((blob) => {
          async function share() {
            if (!stats || !blob) return
            const res = await sharePositionApi({
              position: stats,
              imageBlob: blob,
            })
            if (!res) {
              toast.error(<ToastBody title="Error" message="Something went wrong" />)
              setIsGeneratingLink(false)
              setIsSocialMediaSharingOpen(false)
              return
            }
            setShareData(res)
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

  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null
  const shareLink = generateParamsUrl({
    url: `${import.meta.env.VITE_URL}${generatePositionDetailsRoute({
      protocol: stats?.protocol,
      id: stats?.id,
    })}`,
    key: 'ref',
    value: referralCode,
  })

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
          title="Share This Position"
          isOpen={isSocialMediaSharingOpen}
          link={shareLink}
          onDismiss={() => setIsSocialMediaSharingOpen(false)}
          isGeneratingLink={isGeneratingLink}
          image={shareData?.file}
        />
      )}
    </>
  )
}
