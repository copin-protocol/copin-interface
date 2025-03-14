import { Trans } from '@lingui/macro'
import { Ticket } from '@phosphor-icons/react'

import { IconMessageBox } from 'components/@ui/IconMessageBox'
import { Button } from 'theme/Buttons'
import DiscordV2Icon from 'theme/Icons/DiscordIconV2'
import FeedbackIcon from 'theme/Icons/FeedbackIcon'
import { Box, Flex, LinkText, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

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

export default FeedbackForm
