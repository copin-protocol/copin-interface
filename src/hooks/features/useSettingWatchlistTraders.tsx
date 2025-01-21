import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { createTraderAlertApi, deleteTraderAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

import useBotAlertContext from './useBotAlertProvider'

export default function useSettingWatchlistTraders({ onSuccess }: { onSuccess?: () => void }) {
  const { handleGenerateLinkBot } = useBotAlertContext()
  const refetchQueries = useRefetchQueries()

  const { mutate: createTraderAlert, isLoading: submittingCreate } = useMutation(createTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been subscribed successfully</Trans>}
        />
      )
      refetchQueries([QUERY_KEYS.GET_TRADER_ALERTS])
    },
    onError: (error: any) => {
      if (error?.message?.includes(`Can't find data`)) {
        handleGenerateLinkBot()
      } else {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      }
    },
  })

  const { mutate: deleteTraderAlert, isLoading: submittingDelete } = useMutation(deleteTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been removed successfully</Trans>}
        />
      )
      refetchQueries([QUERY_KEYS.GET_TRADER_ALERTS])
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  return { createTraderAlert, deleteTraderAlert, submittingCreate, submittingDelete }
}
