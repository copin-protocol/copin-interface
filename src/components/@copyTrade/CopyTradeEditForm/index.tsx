import { useMemo } from 'react'

import CopyTraderForm, { FormType } from 'components/@copyTrade/CopyTradeForm'
import { CopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade.d'
import useUpdateCopyTrade from 'hooks/features/copyTrade/useUpdateCopyTrade'

import { getFormValuesFromResponseData, getRequestDataFromForm } from '../helpers'
import { CopyTradeFormValues } from '../types'

export default function CopyTradeEditForm({
  onDismiss,
  onSuccess,
  copyTradeData,
  isLite = false,
}: {
  onDismiss: () => void
  onSuccess: () => void
  copyTradeData: CopyTradeData | undefined
  isLite?: boolean
}) {
  const { updateCopyTrade, isMutating } = useUpdateCopyTrade()

  const defaultFormValues = useMemo(() => getFormValuesFromResponseData(copyTradeData), [copyTradeData])

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: UpdateCopyTradeData = getRequestDataFromForm(formData)
    if (formData.account) data.account = formData.account
    updateCopyTrade(
      { data, copyTradeId: copyTradeData?.id ?? '' },
      {
        onSuccess: () => {
          onSuccess()
          onDismiss()
        },
      }
    )
  }
  const formTypes = ['edit', ...(isLite ? ['lite'] : [])] as FormType[]
  return (
    <CopyTraderForm
      key={copyTradeData?.account}
      onSubmit={onSubmit}
      isSubmitting={isMutating}
      submitButtonText={'Update Copy Trade'}
      defaultFormValues={defaultFormValues}
      formTypes={formTypes}
    />
  )
}
