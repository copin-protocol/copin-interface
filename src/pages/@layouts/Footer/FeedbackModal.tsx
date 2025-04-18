import { Trans } from '@lingui/macro'
import { Ticket, XCircle } from '@phosphor-icons/react'

import { IconMessageBox } from 'components/@ui/IconMessageBox'
import { Button } from 'theme/Buttons'
import DiscordV2Icon from 'theme/Icons/DiscordIconV2'
import FeedbackIcon from 'theme/Icons/FeedbackIcon'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, LinkText, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

export default function FeedBackModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} aria-label="Feedback Form">
      <Box sx={{ bg: 'neutral7', borderRadius: 'sm', p: 16, overflowY: 'auto', mx: 'auto' }}>
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Type.BodyBold>
            <Trans>COPIN FEEDBACK</Trans>
          </Type.BodyBold>
          <IconBox role="button" icon={<XCircle size={20} />} sx={{ color: 'neutral3' }} onClick={onDismiss} />
        </Flex>
        <FeedbackForm />
      </Box>
    </Modal>
  )
}

const FeedbackForm = () => {
  return (
    <Box as="form">
      <IconMessageBox
        height={140}
        message="Got ideas? Share your feedback on Discord!"
        messageColor="white"
        messageSize="12px"
        icons={[
          { icon: <DiscordV2Icon size={24} />, description: 'Join Discord' },
          { icon: <Ticket size={24} />, description: 'Create ticket' },
          { icon: <FeedbackIcon />, description: 'Share Feedback' },
        ]}
      />
      <Flex sx={{ justifyContent: 'center' }}>
        <Button
          type="submit"
          as="a"
          href={LINKS.discord}
          target="_blank"
          variant="primary"
          sx={{ minWidth: 158, fontSize: '13px', lineHeight: '24px' }}
        >
          <Trans>JOIN DISCORD</Trans>
        </Button>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2, mt: 24 }}>
        <Box sx={{ width: '45%', height: 1, bg: 'neutral3' }} />
        <Type.Caption color="neutral3">OR</Type.Caption>
        <Box sx={{ width: '45%', height: 1, bg: 'neutral3' }} />
      </Flex>
      <Flex justifyContent="center" mt={24}>
        <Type.Caption color="neutral3">
          Connect with us on Telegram:{' '}
          <LinkText to={LINKS.support} target="_blank" sx={{ color: '#4EAEFD !important' }}>
            <Trans> @leecopin</Trans>
          </LinkText>
        </Type.Caption>
      </Flex>
    </Box>
  )
}
