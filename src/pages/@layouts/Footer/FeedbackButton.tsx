import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useState } from 'react'

import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

import FeedbackForm from './FeedbackModal'

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
          color: ['white', 'white', 'white', 'neutral3'],
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

      <Modal isOpen={showFeedbackModal} onDismiss={closeFeedbackModal} aria-label="Feedback Form">
        <Box sx={{ bg: 'neutral7', borderRadius: 'sm', p: 16, overflowY: 'auto', mx: 'auto' }}>
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Type.BodyBold>
              <Trans>COPIN FEEDBACK</Trans>
            </Type.BodyBold>
            <IconBox
              role="button"
              icon={<XCircle size={20} />}
              sx={{ color: 'neutral3' }}
              onClick={closeFeedbackModal}
            />
          </Flex>
          <FeedbackForm />
        </Box>
      </Modal>
    </>
  )
}

export default FeedbackButton
