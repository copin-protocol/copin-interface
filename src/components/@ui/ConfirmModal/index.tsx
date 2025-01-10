import React, { ReactNode } from 'react'

import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex } from 'theme/base'

export default function ConfirmModal({
  onDismiss,
  onConfirm,
  message,
  isConfirming,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: {
  onDismiss: () => void
  onConfirm: () => void
  confirmText?: ReactNode
  cancelText?: ReactNode
  message: ReactNode
  isConfirming: boolean
}) {
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false}>
      <Box p={3} textAlign="center">
        {message}
        <Flex sx={{ gap: 3 }} mt={3}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={isConfirming}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            sx={{ flex: 1 }}
            disabled={isConfirming}
            isLoading={isConfirming}
          >
            {confirmText}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
