import { Trans } from '@lingui/macro'
import React from 'react'

import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

interface ExportCsvConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  confirmingData: {
    estimatedQuota: number
    remainingQuota: number
  }
}

const ExportCsvConfirmModal = ({ isOpen, onClose, onConfirm, confirmingData }: ExportCsvConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      maxWidth="450px"
      title={<Trans>Do you want to export data?</Trans>}
      hasClose
    >
      <Box p={3}>
        <Box mb={4}>
          <Flex justifyContent="space-between" mb={2}>
            <Type.Caption>
              <Trans>Records to export</Trans>
            </Type.Caption>
            <Type.Caption>{formatNumber(confirmingData.estimatedQuota)} rows</Type.Caption>
          </Flex>
          <Flex justifyContent="space-between">
            <Type.Caption>
              <Trans>Remaining quota after export</Trans>
            </Type.Caption>
            <Type.Caption>
              {formatNumber(confirmingData.remainingQuota - confirmingData.estimatedQuota)} rows
            </Type.Caption>
          </Flex>
        </Box>

        <Button block variant="primary" onClick={onConfirm}>
          <Trans>Confirm</Trans>
        </Button>
      </Box>
    </Modal>
  )
}

export default ExportCsvConfirmModal
