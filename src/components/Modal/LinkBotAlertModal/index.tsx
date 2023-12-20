import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React from 'react'

import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'

export default function LinkBotAlertModal({ state, onDismiss }: { state: string; onDismiss: () => void }) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false} maxWidth="480px">
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <IconButton
          variant="outline"
          icon={<TelegramIcon size={56} variant="Bold" />}
          size={56}
          sx={{ '&:hover': { cursor: 'initial' } }}
        />
        <Flex my={24} alignItems="center" sx={{ gap: 1 }}>
          <Type.Body textAlign="center">
            <Trans>Would you like to use a Copin’s Telegram Bot to receive your trader’s alert?</Trans>
          </Type.Body>
        </Flex>
        <Type.Caption mb={24} color="orange1" textAlign="center" width="100%">
          <Trans>Note: Each Telegram account is only allowed to link to a Copin account</Trans>
        </Type.Caption>
        <Flex width="100%" sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
            <Trans>No, thanks</Trans>
          </Button>
          <ButtonWithIcon
            type="button"
            variant="primary"
            icon={<ArrowSquareOut />}
            direction="right"
            sx={{ flex: 1 }}
            onClick={() => window.open(generateTelegramBotAlertUrl(state), '_top')}
          >
            <Trans>Open Telegram Bot</Trans>
          </ButtonWithIcon>
        </Flex>
      </Flex>
    </Modal>
  )
}
