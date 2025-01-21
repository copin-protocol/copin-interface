import { Trans } from '@lingui/macro'

import useUnlinkPosition from 'hooks/features/useUnlinkPosition'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'

export default function UnlinkCopyPositionModal({
  copyId,
  onDismiss,
  onSuccess,
}: {
  copyId: string
  onDismiss: () => void
  onSuccess?: () => void
}) {
  const { unlinkPosition, isSubmitting } = useUnlinkPosition({
    onSuccess: () => {
      onDismiss()
      onSuccess?.()
    },
  })

  const onSubmit = () => {
    if (isSubmitting) return
    unlinkPosition(copyId)
  }

  return (
    <Modal title={'Unlink this position?'} isOpen onDismiss={onDismiss} hasClose>
      <Box px={24} pb={24}>
        <Type.Caption color="neutral2">
          <Trans>
            This action will unlink the BingX position; please ensure the BingX position is closed before proceeding.
          </Trans>
        </Type.Caption>

        <Flex mt={24} sx={{ gap: 3 }}>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            sx={{ flex: 1 }}
            onClick={onSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Unlink'}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
