import { Trans } from '@lingui/macro'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyTradeApi } from 'apis/copyTradeApis'
import ToastBody from 'components/@ui/ToastBody'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useUpdateCopyTrade({ onSuccess }: { onSuccess?: () => void }) {
  const { saveTraderCopying, removeTraderCopying } = useTraderCopying(undefined, undefined)
  const { mutate: updateCopyTrade, isLoading: isMutating } = useMutation(updateCopyTradeApi, {
    onSuccess: async (data) => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Your update has been succeeded</Trans>} />
      )
      if (data.status === CopyTradeStatusEnum.RUNNING) {
        saveTraderCopying(data.account, data.protocol)
      } else {
        removeTraderCopying(data.account, data.protocol)
      }
      onSuccess && onSuccess()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })
  return { updateCopyTrade, isMutating }
}
