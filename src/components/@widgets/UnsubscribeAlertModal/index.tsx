import { Trans } from '@lingui/macro'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import { TraderAlertData } from 'entities/alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'

export default function UnsubscribeAlertModal({
  data,
  onDismiss,
  onConfirm,
  isConfirming,
}: {
  data: TraderAlertData
  onDismiss: () => void
  onConfirm: () => void
  isConfirming: boolean
}) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false} maxWidth="480px">
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <AccountWithProtocol address={data.address} protocol={data.protocol} size={32} sx={{ gap: 2 }} />
        <Type.Body my={12} textAlign="center" width="100%">
          <Trans>Are you sure you want to delete this trader from alert list?</Trans>
        </Type.Body>
        <Type.Caption mb={24} color="neutral2" textAlign="center" width="100%">
          <Trans>You won’t be notified each time this trader engages in new activity.</Trans>
        </Type.Caption>
        <Flex width="100%" sx={{ gap: 3 }}>
          <Button
            variant="outlineDanger"
            onClick={onConfirm}
            sx={{ flex: 1 }}
            disabled={isConfirming}
            isLoading={isConfirming}
          >
            <Trans>Yes</Trans>
          </Button>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={isConfirming}>
            <Trans>No</Trans>
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
