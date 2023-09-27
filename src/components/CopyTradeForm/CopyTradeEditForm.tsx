import { useMemo } from 'react'

import CopyTraderForm from 'components/CopyTradeForm'
import { CopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade.d'
import useUpdateCopyTrade from 'hooks/features/useUpdateCopyTrade'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'

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
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade({
    onSuccess: () => {
      onSuccess()
      onDismiss()
    },
  })

  const defaultFormValues = useMemo(() => getFormValuesFromResponseData(copyTradeData), [copyTradeData])

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: UpdateCopyTradeData = {
      ...getRequestDataFromForm(formData),
      status: CopyTradeStatusEnum.RUNNING,
    }
    if (formData.account) data.account = formData.account
    updateCopyTrade({ data, copyTradeId: copyTradeData?.id ?? '' })
  }
  const onCancel = () => {
    updateCopyTrade({ data: { status: CopyTradeStatusEnum.STOPPED }, copyTradeId: copyTradeData?.id ?? '' })
  }

  return (
    <CopyTraderForm
      key={copyTradeData?.account}
      protocol={copyTradeData?.protocol ?? ProtocolEnum.GMX}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isMutating}
      defaultFormValues={defaultFormValues}
      isEdit={true}
      submitButtonText={'Update Copy Trade'}
    />
  )
}
