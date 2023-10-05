import { ShareFat } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { sharePositionApi } from 'apis/storage'
import logoWithText from 'assets/images/logo.png'
import ToastBody from 'components/@ui/ToastBody'
import { ImageData } from 'entities/image'
import { PositionData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import useUsdPricesStore from 'hooks/store/useUsdPrices'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { IconBox } from 'theme/base'
import { default as themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generatePositionCanvas } from 'utils/helpers/generateImage'
import {
  generateClosedPositionRoute,
  generateOpeningPositionRoute,
  generateParamsUrl,
} from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

export default function SharePosition({ isOpening, stats }: { isOpening: boolean; stats: PositionData }) {
  const { prices } = useUsdPricesStore()
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const [isSocialMediaSharingOpen, setIsSocialMediaSharingOpen] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [image, setImage] = useState<ImageData | null>(null)

  const colors = themeColors(true)
  const protocolImg = new Image(32, 32)
  protocolImg.src = parseProtocolImage(stats?.protocol ?? ProtocolEnum.GMX)
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
      const canvas = generatePositionCanvas({
        isOpening,
        stats,
        prices,
        colors,
        protocolImg,
        logoImg,
      })
      if (canvas) {
        canvas.toBlob((blob) => {
          async function share() {
            if (!stats || !blob) return
            const res = await sharePositionApi({
              isOpening,
              position: stats,
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

  const shareLink = generateParamsUrl({
    url: `${import.meta.env.VITE_URL}${
      isOpening
        ? generateOpeningPositionRoute(stats)
        : generateClosedPositionRoute({ protocol: stats.protocol, id: stats.id, nextHours: nextHoursParam })
    }`,
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
          image={image}
        />
      )}
    </>
  )
}
