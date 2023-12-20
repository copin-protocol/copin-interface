import { Trans } from '@lingui/macro'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { unlinkToBotAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'

export default function UnlinkAlertModal({ onDismiss }: { onDismiss: () => void }) {
  const { mutate: unlink, isLoading } = useMutation(unlinkToBotAlertApi, {
    onSettled: () => onDismiss(),
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Unlink Copin Telegram Bot successfully</Trans>} />
      )
    },
    onError: () => {
      toast.error(<ToastBody title="Error" message={<Trans>Something went wrong, please try later</Trans>} />)
    },
  })
  const handleUnlink = () => {
    unlink()
  }
  return (
    <Modal isOpen onDismiss={onDismiss} hasClose={false} maxWidth="480px">
      <Flex width="100%" p={24} flexDirection="column" alignItems="center">
        <Type.Body my={12} textAlign="center" width="100%">
          <Trans>Unlink your account with Copin Telegram Bot?</Trans>
        </Type.Body>
        <Type.Caption mb={24} color="neutral2" textAlign="center" width="100%">
          <Trans>You won’t get any notification from our bot.</Trans>
        </Type.Caption>
        <Flex width="100%" sx={{ gap: 3 }}>
          <Button
            variant="outlineDanger"
            onClick={handleUnlink}
            sx={{ flex: 1 }}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Trans>Yes</Trans>
          </Button>
          <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={isLoading}>
            <Trans>No</Trans>
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
