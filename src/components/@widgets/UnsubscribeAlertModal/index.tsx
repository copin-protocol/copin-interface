import { Trans } from '@lingui/macro'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { TraderAlertData } from 'entities/alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'
import { Z_INDEX } from 'utils/config/zIndex'

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
    <Modal isOpen onDismiss={onDismiss} hasClose={false} maxWidth="480px" zIndex={Z_INDEX.MODAL}>
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <AccountInfo
          address={data.address}
          protocol={data.protocol}
          avatarSize={32}
          hasLink={false}
          hasQuickView={false}
          textSx={{ width: 'fit-content' }}
        />
        <Type.LargeBold my={12} textAlign="center" width="100%">
          <Trans>Remove this trader from alert list?</Trans>
        </Type.LargeBold>
        <Type.Caption mb={24} color="neutral3" textAlign="center" width="100%">
          <Trans>You won’t be notified each time this trader places a trade</Trans>
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
