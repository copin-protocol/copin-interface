import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import {
  bulkUpdateStatusAlertApi,
  deleteChannelAlertApi,
  deleteChannelWebhookAlertApi,
  generateLinkBotAlertApi,
  updateChannelAlertApi,
  updateChannelWebhookAlertApi,
} from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useSettingChannels({
  onGenerateSuccess,
  onSuccess,
}: {
  onGenerateSuccess?: (state?: string) => void
  onSuccess?: () => void
}) {
  const refetchQueries = useRefetchQueries()

  const { mutate: generateLinkBot, isLoading: isGeneratingLink } = useMutation(generateLinkBotAlertApi, {
    onSuccess: (state?: string) => {
      onGenerateSuccess?.(state)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: updateChannelAlert, isLoading: submittingUpdate } = useMutation(updateChannelAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This channel alert has been updated successfully</Trans>}
        />
      )
      refetchQueries([
        QUERY_KEYS.GET_BOT_ALERT,
        QUERY_KEYS.GET_CUSTOM_ALERTS,
        QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
        QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
      ])
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: deleteChannelAlert, isLoading: submittingDelete } = useMutation(deleteChannelAlertApi, {
    onSuccess: () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Unlink Alert successfully</Trans>} />)
      refetchQueries([
        QUERY_KEYS.GET_BOT_ALERT,
        QUERY_KEYS.GET_CUSTOM_ALERTS,
        QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
        QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
      ])
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: updateChannelWebhookAlert, isLoading: submittingUpdateWebhook } = useMutation(
    updateChannelWebhookAlertApi,
    {
      onSuccess: () => {
        toast.success(
          <ToastBody
            title={<Trans>Success</Trans>}
            message={<Trans>This channel alert has been updated successfully</Trans>}
          />
        )
        refetchQueries([
          QUERY_KEYS.GET_BOT_ALERT,
          QUERY_KEYS.GET_CUSTOM_ALERTS,
          QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
        ])
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      },
    }
  )

  const { mutate: deleteChannelWebhookAlert, isLoading: submittingDeleteWebhook } = useMutation(
    deleteChannelWebhookAlertApi,
    {
      onSuccess: () => {
        toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Delete Webhook successfully</Trans>} />)
        refetchQueries([
          QUERY_KEYS.GET_BOT_ALERT,
          QUERY_KEYS.GET_CUSTOM_ALERTS,
          QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
          QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
        ])
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      },
    }
  )

  const { mutate: updateStatusAlert, isLoading: submittingStatus } = useMutation(bulkUpdateStatusAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>This alert has been updated successfully</Trans>} />
      )
      refetchQueries([QUERY_KEYS.GET_BOT_ALERT])
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  return {
    generateLinkBot,
    updateChannelAlert,
    deleteChannelAlert,
    updateStatusAlert,
    updateChannelWebhookAlert,
    deleteChannelWebhookAlert,
    isGeneratingLink,
    submittingUpdate,
    submittingDelete,
    submittingStatus,
    submittingUpdateWebhook,
    submittingDeleteWebhook,
  }
}
