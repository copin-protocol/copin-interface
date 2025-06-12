import { useState } from 'react'

import { Button } from 'theme/Buttons'

import FeedBackModal from './FeedbackModal'

const FeedbackButton = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const handleFeedbackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowFeedbackModal(true)
  }

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false)
  }

  return (
    <>
      <Button
        onClick={handleFeedbackClick}
        sx={{
          background: 'transparent',
          color: ['inherit', 'neutral3', 'neutral3', 'neutral3'],
          fontWeight: 'normal',
          fontSize: '12px',
          p: 0,
          '&:hover': {
            color: 'white',
          },
        }}
      >
        FEEDBACK
      </Button>

      <FeedBackModal isOpen={showFeedbackModal} onDismiss={closeFeedbackModal} />
    </>
  )
}

export default FeedbackButton
