import { Trans } from '@lingui/macro'
import { useCallback } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { bulkUpdateCopyTradeApi, updateCopyTradeApi } from 'apis/copyTradeApis'
import { postUpdateRefreshQueries } from 'components/@copyTrade/configs'
import { CopyTradeWithCheckingData } from 'components/@copyTrade/types'
import { parseInputValue } from 'components/@ui/TextWithEdit'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData } from 'entities/copyTrade'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useUpdateCopyTrade() {
  const { saveTraderCopying, removeTraderCopying } = useTraderCopying(undefined, undefined)
  const refetchQueries = useRefetchQueries()
  const { mutate: updateCopyTrade, isLoading: isMutating } = useMutation(updateCopyTradeApi, {
    onSuccess: async (data) => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Your update has been succeeded</Trans>} />
      )
      refetchQueries(postUpdateRefreshQueries)
      if (data.status === CopyTradeStatusEnum.RUNNING) {
        saveTraderCopying(data.account, data.protocol, data.copyWalletId)
      } else {
        removeTraderCopying(data.account, data.protocol, data.copyWalletId)
      }
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const toggleStatus = useCallback(
    async (data: CopyTradeData, onSuccess?: (data: CopyTradeData) => void) => {
      updateCopyTrade(
        {
          copyTradeId: data.id,
          data: {
            multipleCopy: data.multipleCopy,
            status:
              data.status === CopyTradeStatusEnum.RUNNING ? CopyTradeStatusEnum.STOPPED : CopyTradeStatusEnum.RUNNING,
          },
        },
        { onSuccess }
      )
    },
    [updateCopyTrade]
  )
  const updateNumberValue = ({
    copyTradeId,
    oldData,
    value,
    field,
  }: {
    copyTradeId: string
    oldData: CopyTradeWithCheckingData
    value: string
    field: keyof CopyTradeWithCheckingData
  }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    updateCopyTrade({
      copyTradeId,
      data: {
        account: oldData.account,
        accounts: oldData.accounts,
        multipleCopy: oldData.multipleCopy,
        [field]: numberValue,
      },
    })
  }

  return { updateCopyTrade, isMutating, toggleStatus, updateNumberValue }
}

export function useBulkUpdateCopyTrade() {
  return useMutation(bulkUpdateCopyTradeApi, {
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })
}
function getCopyTradeListApi() {
  throw new Error('Function not implemented.')
}
