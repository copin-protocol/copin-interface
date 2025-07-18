import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { createCustomAlertApi, deleteCustomAlertApi, updateCustomAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { BotAlertData } from 'entities/alert'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useCustomAlerts({
  onSuccess,
  createSuccessMsg,
  updateSuccessMsg,
  deleteSuccessMsg,
}: {
  onSuccess?: (data?: BotAlertData) => void
  createSuccessMsg?: React.ReactNode
  updateSuccessMsg?: React.ReactNode
  deleteSuccessMsg?: React.ReactNode
}) {
  const refetchQueries = useRefetchQueries()

  const { mutate: createCustomAlert, isLoading: submittingCreate } = useMutation(createCustomAlertApi, {
    onSuccess: (data) => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={createSuccessMsg ?? <Trans>This custom alert has been created successfully</Trans>}
        />
      )
      refetchQueries([
        QUERY_KEYS.GET_CUSTOM_ALERTS,
        QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
        QUERY_KEYS.GET_CUSTOM_TRADER_GROUP_BY_ID,
      ])
      onSuccess?.(data)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: updateCustomAlert, isLoading: submittingUpdate } = useMutation(updateCustomAlertApi, {
    onSuccess: (data) => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={updateSuccessMsg ?? <Trans>This custom alert has been updated successfully</Trans>}
        />
      )
      refetchQueries([
        QUERY_KEYS.GET_CUSTOM_ALERTS,
        QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
        QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
        QUERY_KEYS.GET_CUSTOM_TRADER_GROUP_BY_ID,
      ])
      onSuccess?.(data)
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: deleteCustomAlert, isLoading: submittingDelete } = useMutation(deleteCustomAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={deleteSuccessMsg ?? <Trans>This custom alert has been deleted successfully</Trans>}
        />
      )
      refetchQueries([QUERY_KEYS.GET_CUSTOM_ALERTS, QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE])
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  return {
    createCustomAlert,
    updateCustomAlert,
    deleteCustomAlert,
    submittingCreate,
    submittingUpdate,
    submittingDelete,
  }
}
