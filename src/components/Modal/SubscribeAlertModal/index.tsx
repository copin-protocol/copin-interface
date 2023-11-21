import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React from 'react'

import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'

export default function SubscribeAlertModal({
  onDismiss,
  onConfirm,
  isConfirming,
}: {
  onDismiss: () => void
  onConfirm: () => void
  isConfirming: boolean
}) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false}>
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <IconButton
          variant="outline"
          icon={<TelegramIcon size={56} variant="Bold" />}
          size={56}
          sx={{ '&:hover': { cursor: 'initial' } }}
        />
        <Type.Body my={24} textAlign="center" width="100%">
          <Trans>Would you like to use a Copin’s Telegram Bot to receive your trader’s alert?</Trans>
        </Type.Body>
        <Flex width="100%" sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={isConfirming}>
            <Trans>No, thanks</Trans>
          </Button>
          <ButtonWithIcon
            variant="primary"
            icon={<ArrowSquareOut />}
            direction="right"
            onClick={onConfirm}
            sx={{ flex: 1 }}
            disabled={isConfirming}
            isLoading={isConfirming}
          >
            <Trans>Yes</Trans>
          </ButtonWithIcon>
        </Flex>
      </Flex>
    </Modal>
  )
}
