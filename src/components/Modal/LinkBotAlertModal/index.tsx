import { Trans } from '@lingui/macro'
import React from 'react'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'

export default function LinkBotAlertModal({
  state,
  address,
  protocol,
  onDismiss,
}: {
  state: string
  address: string
  protocol: ProtocolEnum
  onDismiss: () => void
}) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false} maxWidth="480px">
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <AccountWithProtocol address={address} protocol={protocol} size={32} sx={{ gap: 2 }} />
        <Flex my={12} alignItems="center" sx={{ gap: 1 }}>
          <Type.Body textAlign="center">
            <Trans>To get notifications from traders, you must use Copin Telegram Bot</Trans>
          </Type.Body>
        </Flex>
        <Type.Caption mb={24} color="neutral2" textAlign="center" width="100%">
          <Trans>Note: Each Telegram account is only allowed to link to a Copin account</Trans>
        </Type.Caption>
        <Flex width="100%" sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open(generateTelegramBotAlertUrl(state), '_blank')}
            sx={{ flex: 1 }}
          >
            <Trans>Open Telegram Bot</Trans>
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
