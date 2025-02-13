import { Trans } from '@lingui/macro'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { forceCloseCopyPositionApi } from 'apis/copyPositionApis'
import ToastBody from 'components/@ui/ToastBody'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useUnlinkPosition(args?: { onSuccess?: () => void; onError?: () => void }) {
  const { onSuccess, onError } = args ?? {}
  const { mutate: unlinkPosition, isLoading: isSubmitting } = useMutation(forceCloseCopyPositionApi, {
    onSuccess: async () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This copy position has been closed successfully</Trans>}
        />
      )
      onSuccess?.()
    },
    onError: (err) => {
      onError?.()
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })
  return { unlinkPosition, isSubmitting }
}
