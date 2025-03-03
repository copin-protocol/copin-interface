import { Trans } from '@lingui/macro'
import { ShareFat } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { sharePositionApi } from 'apis/shareApis'
import logoWithText from 'assets/images/logo.png'
import ToastBody from 'components/@ui/ToastBody'
import { ImageData } from 'entities/image'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { generatePositionCanvas } from 'utils/helpers/generateImage'
import { generateParamsUrl, generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { getProtocolDropdownImage } from 'utils/helpers/transform'

export default function SharePosition({
  isOpening,
  stats,
  chartId,
}: {
  isOpening: boolean
  stats: PositionData
  chartId: string
}) {
  const { getPricesData } = useGetUsdPrices()
  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbolByIndexToken = getSymbolByIndexToken?.({ protocol: stats.protocol, indexToken: stats.indexToken })
  const prices = getPricesData({ protocol: stats.protocol })
  const [isSocialMediaSharingOpen, setIsSocialMediaSharingOpen] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  // const [shareData, setShareData] = useState<SharePositionData>()
  const [image, setImage] = useState<ImageData | null>(null)

  const { protocolImg, logoImg } = useMemo(() => {
    const protocolImg = new Image(40, 40)
    protocolImg.src = getProtocolDropdownImage({ protocol: stats?.protocol ?? DEFAULT_PROTOCOL, isActive: false })
    protocolImg.crossOrigin = 'anonymous'
    const logoImg = new Image(182, 42)
    logoImg.crossOrigin = 'anonymous'
    logoImg.src = logoWithText
    return { protocolImg, logoImg }
  }, [stats?.protocol])

  const handleShare = async () => {
    if (!stats || !symbolByIndexToken) {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
    }
    try {
      setIsSocialMediaSharingOpen(true)
      setIsGeneratingLink(true)

      const canvas = generatePositionCanvas({
        chartId,
        isOpening,
        stats,
        prices,
        colors: themeColors,
        protocolImg,
        logoImg,
        symbolByIndexToken,
      })
      if (canvas) {
        canvas.toBlob((blob) => {
          // async function share() {
          //   if (!stats || !blob) return
          //   const res = await sharePositionApi({
          //     position: stats,
          //     imageBlob: blob,
          //   })
          //   if (!res) {
          //     toast.error(<ToastBody title="Error" message="Something went wrong" />)
          //     setIsGeneratingLink(false)
          //     setIsSocialMediaSharingOpen(false)
          //     return
          //   }
          //   setImage(res)
          // }
          // share()
          if (blob) {
            sharePositionApi({
              position: stats,
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
    } catch {
      toast.error(<ToastBody title="Error" message="Something went wrong" />)
      setIsGeneratingLink(false)
    }
  }

  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null
  const shareLink = generateParamsUrl({
    url: `${import.meta.env.VITE_URL}${generatePositionDetailsRoute({
      id: stats?.id,
      protocol: stats?.protocol,
      txHash: stats?.txHashes?.[0],
      account: stats?.account,
      logId: stats?.logId,
      isLong: stats?.isLong,
    })}`,
    key: 'ref',
    value: referralCode,
  })

  return (
    <>
      <Flex alignItems="center">
        <ButtonWithIcon
          variant="ghost"
          inline
          icon={<ShareFat size={20} />}
          onClick={handleShare}
          spacing={1}
          sx={{ p: 0 }}
        >
          <Type.Caption display={['none', 'inline']}>
            <Trans>Share</Trans>
          </Type.Caption>
        </ButtonWithIcon>
      </Flex>
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
