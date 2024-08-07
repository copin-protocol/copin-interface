import { ArrowSquareOut } from '@phosphor-icons/react'
import { useRef, useState } from 'react'

import { EventDetailsData } from 'entities/event'
import useMyProfile from 'hooks/store/useMyProfile'
import SocialMediaSharingModal from 'theme/Modal/SocialMediaSharingModal'
import { Flex, IconBox } from 'theme/base'
import { generateParamsUrl } from 'utils/helpers/generateRoute'

export default function ShareEventButton({ event }: { event: EventDetailsData }) {
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? null

  const currentEvent = useRef('')
  const [isOpenSocialShareModal, setIsOpenSocialShareModal] = useState(false)

  const handleShare = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    currentEvent.current = event.slug ?? event.id
    setIsOpenSocialShareModal(true)
  }

  const onDismissModal = () => {
    setIsOpenSocialShareModal(false)
    currentEvent.current = ''
  }

  const sharedLink = `${import.meta.env.VITE_URL}/event/${currentEvent.current}`

  return (
    <>
      <Flex role="button" onClick={handleShare} sx={{ p: '2px', color: 'neutral3', '&:hover': { color: 'primary2' } }}>
        <IconBox icon={<ArrowSquareOut size={16} />} />
      </Flex>
      {isOpenSocialShareModal && !!currentEvent.current && (
        <SocialMediaSharingModal
          link={generateParamsUrl({ url: sharedLink, key: 'ref', value: referralCode })}
          isOpen={isOpenSocialShareModal}
          onDismiss={onDismissModal}
          isGeneratingLink={false}
        />
      )}
    </>
  )
}
