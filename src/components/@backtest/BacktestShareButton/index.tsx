import { Trans } from '@lingui/macro'
import { ShareFat } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { shareBacktestApi } from 'apis/shareApis'
import ToastBody from 'components/@ui/ToastBody'
import { RequestBackTestData } from 'entities/backTest'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { generateParamsUrl } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function BacktestShareButton({
  settings,
  protocol,
  sort,
  type,
}: {
  settings: RequestBackTestData
  protocol: ProtocolEnum
  sort?: any
  type: 'single' | 'multiple'
}) {
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null

  const sharedId = useRef('')
  const [isOpenSocialShareModal, setIsOpenSocialShareModal] = useState(false)
  const { mutate: shareBacktest, isLoading: isGeneratingLink } = useMutation(shareBacktestApi, {
    onSuccess: (data) => {
      sharedId.current = data
    },
    onMutate: () => {
      setIsOpenSocialShareModal(true)
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      setIsOpenSocialShareModal(false)
    },
  })
  const handleShare = () => {
    shareBacktest({
      protocol,
      type: 'back_test',
      query: {
        setting: settings,
        sort,
      },
    })
  }
  const onDismissModal = () => {
    setIsOpenSocialShareModal(false)
    sharedId.current = ''
  }
  const sharedLink = `${import.meta.env.VITE_URL}/${protocol}${
    type === 'single' ? ROUTES.SHARED_BACKTEST_SINGLE.path_prefix : ROUTES.SHARED_BACKTEST_MULTIPLE.path_prefix
  }/${sharedId.current}`
  return (
    <>
      <ButtonWithIcon icon={<ShareFat size={20} />} onClick={handleShare} variant="ghost">
        <Trans>Share</Trans>
      </ButtonWithIcon>

      {isOpenSocialShareModal && (
        <SocialMediaSharingModal
          link={generateParamsUrl({ url: sharedLink, key: 'ref', value: referralCode })}
          isOpen={isOpenSocialShareModal}
          onDismiss={onDismissModal}
          isGeneratingLink={isGeneratingLink}
        />
      )}
    </>
  )
}
