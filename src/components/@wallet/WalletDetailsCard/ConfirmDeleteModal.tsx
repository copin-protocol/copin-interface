import { Trans } from '@lingui/macro'
import React from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { parseWalletName } from 'utils/helpers/transform'

export default function ConfirmDeleteModal({
  data,
  onDismiss,
  onConfirm,
  isConfirming,
}: {
  data: CopyWalletData
  onDismiss: () => void
  onConfirm: () => void
  isConfirming: boolean
}) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false}>
      <Box p={3}>
        <Type.BodyBold mb={12} textAlign="center" width="100%">
          {parseWalletName(data)}
        </Type.BodyBold>
        <Type.Body mb={12} textAlign="center" width="100%">
          Are you sure you want to delete this wallet?
        </Type.Body>
        <Alert
          mt={2}
          mb={24}
          variant="cardWarning"
          description={
            <Type.Caption textAlign="left">
              <Trans>Please delete all copy trades before deleting the copy wallet.</Trans>
            </Type.Caption>
          }
        />
        <Flex sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            sx={{ flex: 1 }}
            disabled={isConfirming}
            isLoading={isConfirming}
          >
            Confirm
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
