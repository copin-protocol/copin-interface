import { Trans } from '@lingui/macro'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { addReferralCodeApi, skipReferralApi } from 'apis/userApis'
import ToastBody from 'components/@ui/ToastBody'

export default function useReferralActions({ onSuccess }: { onSuccess?: () => void }) {
  const addReferral = useMutation(addReferralCodeApi, {
    onSuccess: () => {
      onSuccess && onSuccess()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const skipReferral = useMutation(skipReferralApi, {
    onSuccess: () => {
      // onSuccess && onSuccess()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  return { addReferral, skipReferral, submitting: addReferral.isLoading, skipping: skipReferral.isLoading }
}
