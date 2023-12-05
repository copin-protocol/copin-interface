import { useMemo } from 'react'

import CopyTraderForm from 'components/CopyTradeForm'
import { CopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade.d'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import { CopyTradeStatusEnum } from 'utils/config/enums'

import { CopyTradeFormValues } from './configs'
import { getFormValuesFromResponseData, getRequestDataFromForm } from './helpers'

export default function CopyTradeEditForm({
  onDismiss,
  onSuccess,
  copyTradeData,
}: {
  onDismiss: () => void
  onSuccess: () => void
  copyTradeData: CopyTradeData | undefined
}) {
  const { checkIsEligible } = useCheckCopyTradeAction()
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      onSuccess()
      onDismiss()
    },
  })

  const defaultFormValues = useMemo(() => getFormValuesFromResponseData(copyTradeData), [copyTradeData])

  const onSubmit = (formData: CopyTradeFormValues) => {
    if (copyTradeData?.status === CopyTradeStatusEnum.STOPPED && !checkIsEligible()) {
      return
    }
    const data: UpdateCopyTradeData = {
      ...getRequestDataFromForm(formData),
      status: CopyTradeStatusEnum.RUNNING,
    }
    if (formData.account) data.account = formData.account
    updateCopyTrade({ data, copyTradeId: copyTradeData?.id ?? '' })
  }
  return (
    <CopyTraderForm
      key={copyTradeData?.account}
      onSubmit={onSubmit}
      isSubmitting={isMutating}
      submitButtonText={'Update Copy Trade'}
      defaultFormValues={defaultFormValues}
      isEdit={true}
    />
  )
}
