import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { closeHlPosition } from 'apis/liteApis'
import ToastBody from 'components/@ui/ToastBody'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useIFHyperliquidActions({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: handleCloseHlPosition, isLoading: submittingClose } = useMutation(closeHlPosition, {
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>This position has been closed successfully</Trans>} />
      )
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  return {
    handleCloseHlPosition,
    submittingClose,
  }
}
