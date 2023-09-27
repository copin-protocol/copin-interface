import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'

export default function ConfirmStopModal({
  isOpen,
  onDismiss,
  onConfirm,
  isConfirming,
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  isConfirming: boolean
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} hasClose={false}>
      <Box p={3}>
        <Type.BodyBold mb={12} textAlign="center" width="100%">
          Are you sure to stop copy this trader
        </Type.BodyBold>
        <Type.Caption mb={24} textAlign="center" width="100%" color="neutral2">
          You need to manually handle all opening position of this trader
        </Type.Caption>
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
