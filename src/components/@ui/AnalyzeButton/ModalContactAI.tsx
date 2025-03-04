import { Trans } from '@lingui/macro'
import { Sparkle } from '@phosphor-icons/react'

import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { LINKS } from 'utils/config/constants'
import { Z_INDEX } from 'utils/config/zIndex'

const ModalContactAI = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="450px"
      mode="bottom"
      title={
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.H5>Analyze With AI</Type.H5>
          <Type.Caption color="orange1" sx={{ px: '6px', py: '2px', backgroundColor: 'neutral5', borderRadius: '4px' }}>
            <Trans>Coming soon</Trans>
          </Type.Caption>
        </Flex>
      }
      hasClose
      zIndex={Z_INDEX.TOASTIFY}
    >
      <Flex flexDirection="column" pb={[3, 24]} px={[3, 24]}>
        <Flex sx={{ gap: 3, mb: 3, p: 12, backgroundColor: 'neutral6', borderRadius: '4px' }}>
          <Box>
            <Sparkle size={16} color={themeColors.neutral2} />
          </Box>
          <Type.Caption color="neutral2">
            <Trans>
              Join the waitlist today for exclusive early access to AI-driven insights that will revolutionize the way
              you trade!
            </Trans>
          </Type.Caption>
        </Flex>
        <Button
          sx={{ mt: 3, fontWeight: 'bold' }}
          variant="primary"
          as="a"
          href={LINKS.telegramAI}
          target="_blank"
          rel="noreferrer"
          onClick={onDismiss}
        >
          <Trans>Join Telegram Community</Trans>
        </Button>
      </Flex>
    </Modal>
  )
}

export default ModalContactAI
