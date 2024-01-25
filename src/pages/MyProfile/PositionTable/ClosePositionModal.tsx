import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { forceCloseCopyPositionApi } from 'apis/copyPositionApis'
import ToastBody from 'components/@ui/ToastBody'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function ClosePositionModal({
  copyId,
  onDismiss,
  onSuccess,
}: {
  copyId: string
  onDismiss: () => void
  onSuccess?: () => void
}) {
  const { mutate: forceCloseCopyPosition, isLoading: submitting } = useMutation(forceCloseCopyPositionApi, {
    onSuccess: async () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This copy position has been closed successfully</Trans>}
        />
      )
      onDismiss()
      onSuccess && onSuccess()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const onSubmit = () => {
    if (submitting) return
    forceCloseCopyPosition(copyId)
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
            isLoading={submitting}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Unlink'}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
